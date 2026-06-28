import base64
import hashlib
import hmac
import json
import secrets
import smtplib
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage
from uuid import UUID

from sqlalchemy.orm import Session

from ..core.config import get_settings
from ..models.auth_code import AuthCode
from ..models.user import User
from ..schemas.auth import UserCreate


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def normalize_email(email: str) -> str:
    return email.strip().lower()


def _b64url_encode(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).rstrip(b"=").decode("ascii")


def _b64url_decode(value: str) -> bytes:
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode(value + padding)


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 200_000)
    return f"pbkdf2_sha256$200000${_b64url_encode(salt)}${_b64url_encode(digest)}"


def verify_password(password: str, password_hash: str) -> bool:
    try:
        algorithm, iterations, salt, expected = password_hash.split("$", 3)
        if algorithm != "pbkdf2_sha256":
            return False
        digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), _b64url_decode(salt), int(iterations))
        return hmac.compare_digest(_b64url_encode(digest), expected)
    except (TypeError, ValueError):
        return False


def _hash_code(code: str) -> str:
    settings = get_settings()
    digest = hmac.new(settings.jwt_secret_key.encode("utf-8"), code.encode("utf-8"), hashlib.sha256).digest()
    return _b64url_encode(digest)


def create_token(user: User, token_type: str, expires_minutes: int) -> str:
    settings = get_settings()
    now = utc_now()
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "type": token_type,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=expires_minutes)).timestamp()),
    }
    signing_input = ".".join(
        [
            _b64url_encode(json.dumps(header, separators=(",", ":")).encode("utf-8")),
            _b64url_encode(json.dumps(payload, separators=(",", ":")).encode("utf-8")),
        ]
    )
    signature = hmac.new(settings.jwt_secret_key.encode("utf-8"), signing_input.encode("ascii"), hashlib.sha256).digest()
    return f"{signing_input}.{_b64url_encode(signature)}"


def create_access_token(user: User) -> str:
    return create_token(user, "access", get_settings().jwt_access_token_expire_minutes)


def create_refresh_token(user: User) -> str:
    return create_token(user, "refresh", get_settings().jwt_refresh_token_expire_minutes)


def decode_token(token: str, expected_type: str | None = None) -> dict | None:
    settings = get_settings()
    try:
        header_b64, payload_b64, signature_b64 = token.split(".", 2)
        signing_input = f"{header_b64}.{payload_b64}"
        expected = hmac.new(settings.jwt_secret_key.encode("utf-8"), signing_input.encode("ascii"), hashlib.sha256).digest()
        if not hmac.compare_digest(_b64url_encode(expected), signature_b64):
            return None
        payload = json.loads(_b64url_decode(payload_b64))
        if int(payload.get("exp", 0)) < int(utc_now().timestamp()):
            return None
        if expected_type and payload.get("type") != expected_type:
            return None
        return payload
    except (TypeError, ValueError, json.JSONDecodeError):
        return None


def decode_access_token(token: str) -> dict | None:
    return decode_token(token, "access")


def decode_refresh_token(token: str) -> dict | None:
    return decode_token(token, "refresh")


def token_pair(user: User) -> dict:
    return {
        "access_token": create_access_token(user),
        "refresh_token": create_refresh_token(user),
        "token_type": "bearer",
        "user": user,
    }


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == normalize_email(email)).first()


def get_user_by_id(db: Session, user_id: UUID):
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, user_in: UserCreate):
    user = User(
        name=user_in.name.strip(),
        email=normalize_email(user_in.email),
        password_hash=hash_password(user_in.password),
        is_email_verified=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user_password(db: Session, user: User, password: str):
    user.password_hash = hash_password(password)
    db.commit()
    db.refresh(user)
    return user


def _latest_active_code(db: Session, email: str, purpose: str):
    return (
        db.query(AuthCode)
        .filter(AuthCode.email == normalize_email(email), AuthCode.purpose == purpose, AuthCode.consumed_at.is_(None))
        .order_by(AuthCode.created_at.desc())
        .first()
    )


def can_send_code(db: Session, email: str, purpose: str) -> tuple[bool, int]:
    settings = get_settings()
    latest = _latest_active_code(db, email, purpose)
    if not latest or not latest.created_at:
        return True, 0
    elapsed = (utc_now() - latest.created_at).total_seconds()
    if elapsed < settings.auth_code_resend_seconds:
        return False, int(settings.auth_code_resend_seconds - elapsed)
    return True, 0


def create_auth_code(db: Session, email: str, purpose: str) -> str:
    settings = get_settings()
    code = f"{secrets.randbelow(1_000_000):06d}"
    auth_code = AuthCode(
        email=normalize_email(email),
        purpose=purpose,
        code_hash=_hash_code(code),
        expires_at=utc_now() + timedelta(minutes=settings.auth_code_expire_minutes),
    )
    db.add(auth_code)
    db.commit()
    return code


def verify_auth_code(db: Session, email: str, purpose: str, code: str) -> tuple[bool, str]:
    settings = get_settings()
    auth_code = _latest_active_code(db, email, purpose)
    if not auth_code:
        return False, "Kod bulunamadı."
    now = utc_now()
    if auth_code.locked_until and auth_code.locked_until > now:
        return False, "Çok fazla hatalı deneme yapıldı. Lütfen biraz sonra tekrar dene."
    if auth_code.expires_at < now:
        return False, "Kodun süresi dolmuş."
    if not hmac.compare_digest(auth_code.code_hash, _hash_code(code.strip())):
        auth_code.attempts += 1
        if auth_code.attempts >= settings.auth_code_max_attempts:
            auth_code.locked_until = now + timedelta(minutes=settings.auth_code_lock_minutes)
        db.commit()
        return False, "Kod hatalı."
    auth_code.consumed_at = now
    db.commit()
    return True, "Kod doğrulandı."


def send_auth_code_email(email: str, code: str, purpose: str):
    settings = get_settings()
    subject = "DailyPlanner doğrulama kodun" if purpose == "email_verification" else "DailyPlanner şifre sıfırlama kodun"
    body = f"DailyPlanner kodun: {code}\n\nBu kod {settings.auth_code_expire_minutes} dakika geçerlidir."

    if not settings.smtp_host:
        print(f"[DailyPlanner auth code] to={email} purpose={purpose} code={code}")
        return

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = f"{settings.smtp_from_name} <{settings.smtp_from_email}>"
    message["To"] = email
    message.set_content(body)

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as server:
        if settings.smtp_use_tls:
            server.starttls()
        if settings.smtp_username and settings.smtp_password:
            server.login(settings.smtp_username, settings.smtp_password)
        server.send_message(message)
