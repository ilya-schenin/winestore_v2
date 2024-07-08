import uuid
import bcrypt
import jwt
from datetime import datetime, timedelta
from settings import settings
from auth.shemas import User

DEFAULT_PRIVATE_KEY = settings.auth_jwt.private_key_path.read_text()
DEFAULT_ALGORITHM = settings.auth_jwt.algorithm
DEFAULT_EXPIRE_TIMEDELTA = settings.auth_jwt.access_token_expire_minutes
DEFAULT_PUBLIC_KEY = settings.auth_jwt.public_key_path.read_text()


def encode_jwt(
    payload: dict,
    private_key: str = DEFAULT_PRIVATE_KEY,
    algorithm: str = DEFAULT_ALGORITHM,
    expire_minutes: int = DEFAULT_EXPIRE_TIMEDELTA,
    expire_timedelta: timedelta | None = None,
) -> str:

    to_encode = payload.copy()
    now = datetime.utcnow()
    if expire_timedelta:
        expire = now + expire_timedelta
    else:
        expire = now + timedelta(minutes=expire_minutes)
    to_encode.update(
        exp=expire,
        iat=now,
    )
    encoded = jwt.encode(
        to_encode,
        private_key,
        algorithm=algorithm,
    )
    return encoded


def decode_jwt(
    token: str | bytes,
    public_key: str = DEFAULT_PUBLIC_KEY,
    algorithm: str = DEFAULT_ALGORITHM,
) -> dict:
    decoded = jwt.decode(
        token,
        public_key,
        algorithms=[algorithm],
    )
    return decoded


def hash_password(password: str) -> bytes:
    salt = bcrypt.gensalt()
    pwd_bytes: bytes = password.encode()
    return bcrypt.hashpw(pwd_bytes, salt)


def validate_password(password: str, hashed_password: bytes) -> bool:
    return bcrypt.checkpw(
        password=password.encode(),
        hashed_password=hashed_password,
    )


def create_jwt(
    token_data: dict,
    token_type: str,
    expire_minutes: int = settings.auth_jwt.access_token_expire_minutes,
    expire_timedelta: timedelta | None = None

) -> str:
    jwt_payload = {"type": token_type}
    jwt_payload.update(token_data)
    return encode_jwt(
        jwt_payload,
        expire_timedelta=expire_timedelta,
        expire_minutes=expire_minutes
    )


def create_access_token(user: User):
    jwt_payload = {
        "sub": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.first_name,
    }

    return create_jwt(
        jwt_payload,
        'access',
        expire_minutes=settings.auth_jwt.access_token_expire_minutes
    )


def create_refresh_token(
        user: User,
        expire_timedelta=settings.auth_jwt.refresh_token_expire_days,
        jti: str = str(uuid.uuid4())
):
    jwt_payload = {
        "sub": user.id,
        'jti': jti
    }
    return create_jwt(
        jwt_payload,
        'refresh',
        expire_timedelta=expire_timedelta
    )
