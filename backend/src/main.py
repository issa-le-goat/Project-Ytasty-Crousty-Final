import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware

# Importation de tous les routeurs de l'application
from src.database import Base, engine
from src.modules.auths.router import router as auth_router
from src.modules.users.router import router as users_router
from src.modules.restaurants.router import router as restaurants_router
from src.modules.products.router import router as products_router
from src.modules.ordres.router import router as orders_router
from src.seed import seed_development_admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    if os.getenv("SEED_DEV_ADMIN", "false").lower() == "true":
        seed_development_admin()
    yield

app = FastAPI(
    title="Ytasty Crousty API",
    description="API REST pour la gestion du réseau de restaurants Ytasty Crousty.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", status_code=status.HTTP_200_OK, tags=["Health"])
def health_check():
    return {"status": "ok"}

# Enregistrement des différents modules (Routes)
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(restaurants_router)
app.include_router(products_router)
app.include_router(orders_router)