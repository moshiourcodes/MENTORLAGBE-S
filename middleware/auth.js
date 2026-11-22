import { verifyExpressJwt } from "../lib/jwt.js";

function bearerToken(req) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
}

/** Requires a valid Better Auth-issued JWT in the Authorization header. */
export async function requireAuth(req, res, next) {
  const token = bearerToken(req);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  try {
    req.auth = await verifyExpressJwt(token);
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
      reason: error instanceof Error ? error.name : "unknown",
    });
  }
}

/**
 * Allows anonymous requests but attaches verified identity when a token is
 * present. Used on public endpoints that can be personalised later.
 */
export async function optionalAuth(req, res, next) {
  const token = bearerToken(req);

  if (!token) {
    return next();
  }

  try {
    req.auth = await verifyExpressJwt(token);
  } catch {
    // A bad token on a public route is treated as anonymous.
  }

  return next();
}
