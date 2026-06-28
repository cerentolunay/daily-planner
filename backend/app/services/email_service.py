import smtplib
from email.message import EmailMessage

from ..core.config import get_settings


def auth_code_subject(purpose: str) -> str:
    if purpose == "password_reset":
        return "DailyPlanner şifre sıfırlama kodun"
    return "DailyPlanner doğrulama kodun"


def auth_code_plain_text(code: str, purpose: str) -> str:
    settings = get_settings()
    action = "şifreni sıfırlamak" if purpose == "password_reset" else "e-posta adresini doğrulamak"
    return (
        f"DailyPlanner kodun: {code}\n\n"
        f"Bu kod {settings.auth_code_expire_minutes} dakika geçerlidir.\n"
        f"Kodu {action} için kullanabilirsin.\n\n"
        "Bu işlemi sen başlatmadıysan bu e-postayı yok sayabilirsin."
    )


def auth_code_html(code: str, purpose: str) -> str:
    settings = get_settings()
    title = "Şifre sıfırlama kodun" if purpose == "password_reset" else "E-posta doğrulama kodun"
    action = "şifreni sıfırlamak" if purpose == "password_reset" else "hesabını aktif etmek"
    return f"""\
<!doctype html>
<html lang="tr">
  <body style="margin:0;background:#D2C7FF;font-family:Arial,sans-serif;color:#5D5491;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#FFFFFF;border-radius:24px;padding:28px;border:1px solid rgba(93,84,145,0.18);">
            <tr>
              <td>
                <div style="display:inline-block;background:#FFD230;color:#5D5491;border-radius:16px;padding:10px 14px;font-weight:800;">DailyPlanner</div>
                <h1 style="margin:24px 0 8px;font-size:26px;line-height:1.2;color:#5D5491;">{title}</h1>
                <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#5D5491;">Bu kodu {action} için kullan.</p>
                <div style="letter-spacing:8px;text-align:center;background:#E1FB62;border-radius:20px;padding:18px 20px;font-size:32px;font-weight:900;color:#5D5491;">{code}</div>
                <p style="margin:20px 0 0;font-size:14px;line-height:1.6;color:#5D5491;">Kod {settings.auth_code_expire_minutes} dakika geçerlidir. Bu işlemi sen başlatmadıysan e-postayı yok sayabilirsin.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
"""


def send_auth_code_email(email: str, code: str, purpose: str):
    settings = get_settings()
    subject = auth_code_subject(purpose)
    plain_text = auth_code_plain_text(code, purpose)

    if not settings.smtp_host:
        print(f"[DailyPlanner auth code] to={email} purpose={purpose} code={code}")
        return

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = f"{settings.smtp_from_name} <{settings.smtp_from_email}>"
    message["To"] = email
    message.set_content(plain_text)
    message.add_alternative(auth_code_html(code, purpose), subtype="html")

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as server:
        if settings.smtp_use_tls:
            server.starttls()
        if settings.smtp_username and settings.smtp_password:
            server.login(settings.smtp_username, settings.smtp_password)
        server.send_message(message)
