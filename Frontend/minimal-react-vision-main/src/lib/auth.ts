import jwtDecode from "jwt-decode";

interface JwtPayload {
  sub: string;        // sau id, depinde cum emiţi token‑ul în Spring
  exp: number;
  // orice alte claim‑uri...
}

/**
 * Returnează id‑ul user‑ului din localStorage, sau null dacă nu există/expirat
 */
export function getCurrentUserId(): number | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = jwtDecode<JwtPayload>(token);
    const now = Date.now() / 1000;
    if (payload.exp && payload.exp < now) {
      localStorage.removeItem("token");
      return null;
    }
    return Number(payload.sub);     // adaptează dacă e alt field
  } catch {
    localStorage.removeItem("token");
    return null;
  }
}

/**
 * Returnează token‑ul pentru header Authorization
 */
export function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
