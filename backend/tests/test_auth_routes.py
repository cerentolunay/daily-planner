from types import SimpleNamespace
from datetime import datetime, timezone
from uuid import uuid4

import pytest
from fastapi import HTTPException

from app.api.routes import auth as auth_routes


class FakeUser:
    def __init__(self, email="cerem@example.com", verified=False):
        self.id = uuid4()
        self.name = "Cerem"
        self.email = email
        self.password_hash = "hash"
        self.is_email_verified = verified
        self.created_at = datetime.now(timezone.utc)
        self.updated_at = datetime.now(timezone.utc)


def fake_request():
    return SimpleNamespace(client=SimpleNamespace(host="127.0.0.1"))


@pytest.fixture(autouse=True)
def no_rate_limit(monkeypatch):
    monkeypatch.setattr(auth_routes, "check_auth_rate_limit", lambda *args, **kwargs: None)


def test_register_creates_unverified_user_and_sends_code(monkeypatch):
    sent = {}
    user = FakeUser()

    monkeypatch.setattr(auth_routes, "get_user_by_email", lambda db, email: None)
    monkeypatch.setattr(auth_routes, "create_user", lambda db, user_in: user)
    monkeypatch.setattr(auth_routes, "can_send_code", lambda db, email, purpose: (True, 0))
    monkeypatch.setattr(auth_routes, "create_auth_code", lambda db, email, purpose: "123456")
    monkeypatch.setattr(auth_routes, "send_auth_code_email", lambda email, code, purpose: sent.update({"email": email, "code": code, "purpose": purpose}))

    response = auth_routes.register(
        auth_routes.UserCreate(name="Cerem", email="cerem@example.com", password="dailyplanner123"),
        fake_request(),
        db=object(),
    )

    assert response.detail == "Doğrulama kodu e-postana gönderildi."
    assert sent == {"email": "cerem@example.com", "code": "123456", "purpose": "email_verification"}
    assert user.is_email_verified is False


def test_unverified_user_cannot_login(monkeypatch):
    monkeypatch.setattr(auth_routes, "get_user_by_email", lambda db, email: FakeUser(verified=False))
    monkeypatch.setattr(auth_routes, "verify_password", lambda password, password_hash: True)

    with pytest.raises(HTTPException) as exc:
        auth_routes.login(auth_routes.UserLogin(email="cerem@example.com", password="dailyplanner123"), fake_request(), db=object())

    assert exc.value.status_code == 403


def test_verified_user_can_login(monkeypatch):
    user = FakeUser(verified=True)
    monkeypatch.setattr(auth_routes, "get_user_by_email", lambda db, email: user)
    monkeypatch.setattr(auth_routes, "verify_password", lambda password, password_hash: True)
    monkeypatch.setattr(
        auth_routes,
        "token_pair",
        lambda current_user: {
            "access_token": "access.jwt",
            "refresh_token": "refresh.jwt",
            "token_type": "bearer",
            "user": current_user,
        },
    )

    response = auth_routes.login(auth_routes.UserLogin(email="cerem@example.com", password="dailyplanner123"), fake_request(), db=object())

    assert response.access_token == "access.jwt"
    assert response.refresh_token == "refresh.jwt"
    assert response.user.email == "cerem@example.com"


def test_refresh_requires_valid_refresh_token(monkeypatch):
    user = FakeUser(verified=True)
    monkeypatch.setattr(auth_routes, "decode_refresh_token", lambda token: {"sub": str(user.id)})
    monkeypatch.setattr(auth_routes, "get_user_by_id", lambda db, user_id: user)
    monkeypatch.setattr(
        auth_routes,
        "token_pair",
        lambda current_user: {
            "access_token": "new.access",
            "refresh_token": "new.refresh",
            "token_type": "bearer",
            "user": current_user,
        },
    )

    response = auth_routes.refresh(auth_routes.RefreshTokenRequest(refresh_token="refresh.jwt"), db=object())

    assert response.access_token == "new.access"
    assert response.refresh_token == "new.refresh"


def test_password_reset_verifies_code_and_updates_password(monkeypatch):
    user = FakeUser(verified=True)
    updated = {}

    monkeypatch.setattr(auth_routes, "get_user_by_email", lambda db, email: user)
    monkeypatch.setattr(auth_routes, "verify_auth_code", lambda db, email, purpose, code: (True, "Kod doğrulandı."))
    monkeypatch.setattr(auth_routes, "update_user_password", lambda db, current_user, password: updated.update({"email": current_user.email, "password": password}))

    response = auth_routes.reset_password(
        auth_routes.PasswordResetConfirm(email="cerem@example.com", code="123456", new_password="newpassword123"),
        fake_request(),
        db=object(),
    )

    assert response.detail == "Şifre güncellendi. Yeni şifrenle giriş yapabilirsin."
    assert updated == {"email": "cerem@example.com", "password": "newpassword123"}
