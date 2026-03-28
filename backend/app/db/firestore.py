from app.core.firebase import get_firestore


def get_users_collection():
    return get_firestore().collection("users")


def get_profiles_collection():
    return get_firestore().collection("profiles")

