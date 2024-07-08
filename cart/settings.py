from pathlib import Path
from pydantic import BaseModel
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os


load_dotenv()

BASE_DIR = Path(__file__)


class DBSettings(BaseModel):
    DB_USER: str = os.environ.get('DB_USER')
    DB_PASSWORD: str = os.environ.get('DB_PASSWORD')
    DB_HOST: str = os.environ.get('DB_HOST')
    DB_PORT: int = os.environ.get('DB_PORT')
    DB_NAME: str = os.environ.get('DB_NAME')


class Settings(BaseSettings):
    db_settings: DBSettings = DBSettings()


settings = Settings()

