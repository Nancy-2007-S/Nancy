from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.firebase import init_firebase
from app.routes.auth import router as auth_router
from app.routes.profile import router as profile_router

app = FastAPI(title="Auth API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    init_firebase()

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(profile_router, prefix="/api", tags=["profile"])

@app.exception_handler(RuntimeError)
async def runtime_error_handler(_request, exc: RuntimeError):
    # In dev, surface configuration errors (e.g. missing Firebase credentials)
    return JSONResponse(status_code=500, content={"detail": str(exc)})


@app.get("/health")
async def health_check():
    return {"status": "ok"}
