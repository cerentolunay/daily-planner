from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from ..deps import get_current_user, get_db
from ...models.user import User
from ...schemas.auth import (
    EmailRequest,
    MessageResponse,
    PasswordResetConfirm,
    RefreshTokenRequest,
    TokenResponse,
    UserCreate,
    UserLogin,
    UserRead,
    VerifyCodeRequest,
)
from ...services.auth_rate_limit import check_auth_rate_limit
from ...services.auth_service import (
    can_send_code,
    create_auth_code,
    create_user,
    decode_refresh_token,
    get_user_by_email,
    get_user_by_id,
    normalize_email,
    send_auth_code_email,
    token_pair,
    update_user_password,
    verify_auth_code,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["auth"])


def _rate_key(request: Request, action: str, email: str) -> str:
    client = request.client.host if request.client else "unknown"
    return f"{action}:{client}:{normalize_email(email)}"


def _send_code(db: Session, email: str, purpose: str):
    allowed, wait_seconds = can_send_code(db, email, purpose)
    if not allowed:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=f"Yeni kod için {wait_seconds} saniye bekle.")
    code = create_auth_code(db, email, purpose)
    send_auth_code_email(email, code, purpose)


@router.post("/register", response_model=MessageResponse)
def register(user_in: UserCreate, request: Request, db: Session = Depends(get_db)):
    check_auth_rate_limit(_rate_key(request, "register", user_in.email), limit=5, window_seconds=60)
    if "@" not in user_in.email:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Geçerli bir e-posta gir.")
    existing = get_user_by_email(db, user_in.email)
    if existing and existing.is_email_verified:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Bu e-posta zaten kayıtlı.")
    user = existing or create_user(db, user_in)
    if existing:
        user.name = user_in.name.strip()
        user.password_hash = update_user_password(db, user, user_in.password).password_hash
    _send_code(db, user.email, "email_verification")
    return MessageResponse(detail="Doğrulama kodu e-postana gönderildi.")


@router.post("/verify-email", response_model=MessageResponse)
def verify_email(payload: VerifyCodeRequest, request: Request, db: Session = Depends(get_db)):
    check_auth_rate_limit(_rate_key(request, "verify-email", payload.email), limit=8, window_seconds=60)
    user = get_user_by_email(db, payload.email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Kullanıcı bulunamadı.")
    ok, message = verify_auth_code(db, payload.email, "email_verification", payload.code)
    if not ok:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=message)
    user.is_email_verified = True
    db.commit()
    return MessageResponse(detail="E-posta doğrulandı. Şimdi giriş yapabilirsin.")


@router.post("/resend-verification", response_model=MessageResponse)
def resend_verification(payload: EmailRequest, request: Request, db: Session = Depends(get_db)):
    check_auth_rate_limit(_rate_key(request, "resend-verification", payload.email), limit=4, window_seconds=60)
    user = get_user_by_email(db, payload.email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Kullanıcı bulunamadı.")
    if user.is_email_verified:
        return MessageResponse(detail="Bu hesap zaten doğrulanmış.")
    _send_code(db, user.email, "email_verification")
    return MessageResponse(detail="Yeni doğrulama kodu gönderildi.")


@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, request: Request, db: Session = Depends(get_db)):
    check_auth_rate_limit(_rate_key(request, "login", credentials.email), limit=8, window_seconds=60)
    user = get_user_by_email(db, credentials.email)
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="E-posta veya şifre hatalı.")
    if not user.is_email_verified:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Giriş için önce e-posta kodunu doğrula.")
    return TokenResponse(**token_pair(user))


@router.post("/refresh", response_model=TokenResponse)
def refresh(payload: RefreshTokenRequest, db: Session = Depends(get_db)):
    token_payload = decode_refresh_token(payload.refresh_token)
    if not token_payload or not token_payload.get("sub"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Oturum yenileme tokenı geçersiz.")
    try:
        user_id = UUID(str(token_payload["sub"]))
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Oturum yenileme tokenı geçersiz.")
    user = get_user_by_id(db, user_id)
    if not user or not user.is_email_verified:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Oturum yenilenemedi.")
    return TokenResponse(**token_pair(user))


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(payload: EmailRequest, request: Request, db: Session = Depends(get_db)):
    check_auth_rate_limit(_rate_key(request, "forgot-password", payload.email), limit=4, window_seconds=60)
    user = get_user_by_email(db, payload.email)
    if user:
        _send_code(db, user.email, "password_reset")
    return MessageResponse(detail="Eğer bu e-posta kayıtlıysa şifre sıfırlama kodu gönderildi.")


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(payload: PasswordResetConfirm, request: Request, db: Session = Depends(get_db)):
    check_auth_rate_limit(_rate_key(request, "reset-password", payload.email), limit=8, window_seconds=60)
    user = get_user_by_email(db, payload.email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Kullanıcı bulunamadı.")
    ok, message = verify_auth_code(db, payload.email, "password_reset", payload.code)
    if not ok:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=message)
    update_user_password(db, user, payload.new_password)
    return MessageResponse(detail="Şifre güncellendi. Yeni şifrenle giriş yapabilirsin.")


@router.post("/logout", response_model=MessageResponse)
def logout():
    return MessageResponse(detail="Oturum kapatıldı.")


@router.get("/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)):
    return current_user
