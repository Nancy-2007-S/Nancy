import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  updateProfile 
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";
import { parseResume } from "./resumeParser";

export async function signupUser({ name, email, password }) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Set display name in Firebase Auth
    await updateProfile(user, { displayName: name });
    
    // Initialize user doc in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    }, { merge: true });

    return { message: "User registered successfully", user };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function loginUser({ email, password }) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { 
      message: "Login successful", 
      user: userCredential.user,
      access_token: await userCredential.user.getIdToken() 
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Ensure user exists in Firestore
    const userSnap = await getDoc(doc(db, "users", user.uid));
    if (!userSnap.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName || "Google User",
        email: user.email,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
    }

    return { 
      message: "Login successful", 
      user,
      access_token: await user.getIdToken() 
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getProfile(accessToken) {
  // If we have an accessToken, we can get the user from auth. 
  // However, in our new architecture, useAuth already provides the user.
  const user = auth.currentUser;
  if (!user) throw new Error("Unauthorized");

  const docSnap = await getDoc(doc(db, "users", user.uid));
  if (!docSnap.exists()) {
    return { detail: "Profile not found" };
  }
  return docSnap.data();
}

const GOAL_MAP = {
  "Full Stack Developer": "full_stack",
  "Data Scientist": "data_science",
  "Frontend Developer": "frontend",
  "Backend Developer": "backend",
  "ML Engineer": "ml_engineer",
  "AI Engineer": "ml_engineer",
  "Cloud Engineer": "devops",
};

export async function saveCareerProfile(accessToken, payload) {
  const user = auth.currentUser;
  if (!user) throw new Error("Unauthorized");

  if (!payload.skills && !payload.interests) {
    throw new Error("Profile data is incomplete");
  }

  const primaryInterest = payload.interests[0] || "full_stack";
  const roadmapGoal = GOAL_MAP[primaryInterest] || "full_stack";

  try {
    // Save to users collection
    await setDoc(doc(db, "users", user.uid), {
      name: user.displayName || "User",
      email: user.email,
      skills: payload.skills,
      interests: payload.interests,
      goal: roadmapGoal,
      onboarding_completed: true,
      academic_background: payload.academic_background,
      projects: payload.projects,
      experience: payload.experience,
      updated_at: serverTimestamp(),
    }, { merge: true });

    // Save to progress collection (as the backend did)
    await setDoc(doc(db, "progress", user.uid), {
      roadmapId: roadmapGoal,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    return { message: "Profile saved successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function parseResumeFile(file) {
  // Directly call the browser-side parser
  return await parseResume(file);
}
