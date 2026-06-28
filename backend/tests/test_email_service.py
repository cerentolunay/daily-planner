from types import SimpleNamespace

from app.services import email_service


class FakeSMTP:
    sent_messages = []
    started_tls = False
    login_args = None

    def __init__(self, host, port, timeout):
        self.host = host
        self.port = port
        self.timeout = timeout

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, traceback):
        return False

    def starttls(self):
        FakeSMTP.started_tls = True

    def login(self, username, password):
        FakeSMTP.login_args = (username, password)

    def send_message(self, message):
        FakeSMTP.sent_messages.append(message)


def test_auth_code_template_contains_code_and_expiry(monkeypatch):
    monkeypatch.setattr(email_service, "get_settings", lambda: SimpleNamespace(auth_code_expire_minutes=10))

    plain_text = email_service.auth_code_plain_text("123456", "email_verification")
    html = email_service.auth_code_html("123456", "email_verification")

    assert "123456" in plain_text
    assert "10 dakika" in plain_text
    assert "123456" in html
    assert "DailyPlanner" in html


def test_send_auth_code_email_uses_smtp_and_html_template(monkeypatch):
    FakeSMTP.sent_messages = []
    FakeSMTP.started_tls = False
    FakeSMTP.login_args = None
    monkeypatch.setattr(email_service.smtplib, "SMTP", FakeSMTP)
    monkeypatch.setattr(
        email_service,
        "get_settings",
        lambda: SimpleNamespace(
            smtp_host="smtp.example.com",
            smtp_port=587,
            smtp_username="dailyplanner",
            smtp_password="secret",
            smtp_from_email="noreply@example.com",
            smtp_from_name="DailyPlanner",
            smtp_use_tls=True,
            auth_code_expire_minutes=10,
        ),
    )

    email_service.send_auth_code_email("cerem@example.com", "654321", "password_reset")

    assert FakeSMTP.started_tls is True
    assert FakeSMTP.login_args == ("dailyplanner", "secret")
    assert len(FakeSMTP.sent_messages) == 1
    message = FakeSMTP.sent_messages[0]
    assert message["To"] == "cerem@example.com"
    assert "şifre sıfırlama" in message["Subject"]
    assert "654321" in message.get_body(preferencelist=("html",)).get_content()
