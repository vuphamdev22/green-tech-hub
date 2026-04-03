export interface JwtPayload {
  sub?: string;
  roles?: string[];
  [key: string]: unknown;
}

const decodePayload = (payload: string) => {
  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(base64);
    const percentEncoded = Array.from(decoded)
      .map((char) => `%${("00" + char.charCodeAt(0).toString(16)).slice(-2)}`)
      .join("");
    return decodeURIComponent(percentEncoded);
  } catch (error) {
    console.error("Failed to decode JWT payload", error);
    return null;
  }
};

export function parseJwt<T extends JwtPayload = JwtPayload>(token?: string | null): T | null {
  if (!token) {
    return null;
  }
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }
  const decoded = decodePayload(parts[1]);
  if (!decoded) {
    return null;
  }
  try {
    return JSON.parse(decoded) as T;
  } catch (error) {
    console.error("Failed to parse JWT payload as JSON", error);
    return null;
  }
}
