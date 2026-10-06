import os

from src.database import SessionLocal
from src.modules.auths.security import hash_password
from src.modules.users.models import RoleEnum, User


def seed_development_admin() -> None:
    username = os.getenv("DEV_ADMIN_USERNAME", "lucarthur")
    password = os.getenv("DEV_ADMIN_PASSWORD", "prime")

    with SessionLocal() as db:
        user = db.query(User).filter(User.username == username).first()
        if user is None:
            user = User(username=username)
            db.add(user)

        user.first_name = "Luc"
        user.last_name = "Arthur"
        user.hashed_password = hash_password(password)
        user.role = RoleEnum.admin
        user.restaurant_id = None
        db.commit()