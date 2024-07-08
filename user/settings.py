from datetime import timedelta
from pathlib import Path
from pydantic import BaseModel
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os


load_dotenv()

BASE_DIR = Path(__file__).parent


class DBSettings(BaseModel):
    DB_USER: str = os.environ.get('DB_USER')
    DB_PASSWORD: str = os.environ.get('DB_PASSWORD')
    DB_HOST: str = os.environ.get('DB_HOST')
    DB_PORT: int = os.environ.get('DB_PORT')
    DB_NAME: str = os.environ.get('DB_NAME')


class AuthJWT(BaseModel):
    private_key_path: Path = BASE_DIR / 'auth' / 'certs' / "jwt-private.pem"
    public_key_path: Path = BASE_DIR / 'auth' / 'certs' / "jwt-public.pem"
    algorithm: str = "RS256"
    access_token_expire_minutes: int = 1
    refresh_token_expire_days: timedelta = timedelta(minutes=2)


class Settings(BaseSettings):
    api_v1_prefix: str = "/api/v1"
    auth_jwt: AuthJWT = AuthJWT()
    db_settings: DBSettings = DBSettings()


settings = Settings()

