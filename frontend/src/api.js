const API_BASE_URL = "http://localhost:8000";

async function parseResponse(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Unexpected server response");
  }
}

export async function signupUser(payload) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await parseResponse(response);
  if (!response.ok) {
    const message = typeof data.detail === "string" 
      ? data.detail 
      : Array.isArray(data.detail) 
        ? data.detail[0]?.msg || "Validation error"
        : data.detail?.message || "Failed to register user";
    throw new Error(message);
  }
  return data;
}

export async function loginUser(payload) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await parseResponse(response);
  if (!response.ok) {
    const message = typeof data.detail === "string" 
      ? data.detail 
      : Array.isArray(data.detail) 
        ? data.detail[0]?.msg || "Validation error"
        : data.detail?.message || "Invalid email or password";
    throw new Error(message);
  }
  return data;
}

export async function loginWithGoogle(idToken) {
  const response = await fetch(`${API_BASE_URL}/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id_token: idToken }),
  });

  const data = await parseResponse(response);
  if (!response.ok) {
    const message = typeof data.detail === "string" 
      ? data.detail 
      : Array.isArray(data.detail) 
        ? data.detail[0]?.msg || "Validation error"
        : data.detail?.message || "Google login failed";
    throw new Error(message);
  }
  return data;
}

export async function getProfile(accessToken) {
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    throw new Error("Unauthorized");
  }

  const data = await parseResponse(response);
  if (!response.ok) {
    throw new Error(data.detail || "Failed to load profile");
  }
  return data;
}

export async function saveCareerProfile(accessToken, payload) {
  const response = await fetch(`${API_BASE_URL}/api/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await parseResponse(response);
  if (!response.ok) {
    throw new Error(data.detail || "Failed to save career profile");
  }
  return data;
}

export async function parseResumeFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/profile/parse-resume`, {
    method: "POST",
    body: formData,
  });

  const data = await parseResponse(response);
  if (!response.ok) {
    throw new Error(data.detail || "Failed to parse resume");
  }
  return data;
}
