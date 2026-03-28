import os
import threading
import json

from dotenv import load_dotenv
import firebase_admin
from firebase_admin import auth, credentials, firestore

load_dotenv()

_lock = threading.Lock()
_db: firestore.Client | None = None


def _backend_root() -> str:
    # backend/app/core/firebase.py -> backend/
    return os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))


def _resolve_service_account_path() -> str:
    backend_root = _backend_root()
    service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "serviceAccountKey.json")

    # If user provided a relative path, resolve it from backend root.
    if not os.path.isabs(service_account_path):
        service_account_path = os.path.join(backend_root, service_account_path)

    service_account_path = os.path.normpath(service_account_path)

    if os.path.exists(service_account_path):
        return service_account_path

    # Fallback: try to find serviceAccountKey*.json in backend root.
    try:
        candidates = [
            f
            for f in os.listdir(backend_root)
            if f.lower().startswith("serviceaccountkey") and f.lower().endswith(".json")
        ]
        if len(candidates) == 1:
            return os.path.join(backend_root, candidates[0])
    except OSError:
        pass

    raise RuntimeError(
        "Firebase service account file not found. "
        f"Looked for: {service_account_path}. "
        f"Expected in: {backend_root}. "
        "Download it from Firebase Console (Service Accounts -> Generate private key) "
        "and place it as `serviceAccountKey.json` in the `backend/` folder, "
        "or set `FIREBASE_SERVICE_ACCOUNT_PATH` to the full path. "
        "Alternatively, set `FIREBASE_SERVICE_ACCOUNT_JSON` to the JSON contents."
    )


def init_firebase() -> None:
    """Initialize the Firebase Admin SDK if not already done."""
    with _lock:
        if not firebase_admin._apps:
            print("[Firebase] Initializing Firebase Admin SDK...")
            service_account_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
            if service_account_json:
                try:
                    cred_info = json.loads(service_account_json)
                except json.JSONDecodeError as e:
                    raise RuntimeError("Invalid FIREBASE_SERVICE_ACCOUNT_JSON (must be valid JSON).") from e
                cred = credentials.Certificate(cred_info)
            else:
                cred_path = _resolve_service_account_path()
                cred = credentials.Certificate(cred_path)
            
            firebase_admin.initialize_app(cred)
            project_id = getattr(cred, "project_id", "unknown")
            print(f"[Firebase] Firebase initialized successfully. Project: {project_id}")


def get_firestore() -> firestore.Client:
    global _db

    if _db is not None:
        return _db

    init_firebase()
    
    with _lock:
        if _db is None:
            _db = firestore.client()
        return _db

