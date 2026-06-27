from .calendar.connector import CalendarConnector
from .discord.connector import DiscordConnector
from .github.connector import GithubConnector
from .gmail.connector import GmailConnector
from .slack.connector import SlackConnector
from .whatsapp.connector import WhatsAppConnector

connector_registry = {
    "whatsapp": WhatsAppConnector(),
    "gmail": GmailConnector(),
    "calendar": CalendarConnector(),
    "slack": SlackConnector(),
    "github": GithubConnector(),
    "discord": DiscordConnector(),
}
