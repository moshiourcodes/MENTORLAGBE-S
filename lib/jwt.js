import { createRemoteJWKSet, jwtVerify } from "jose";

const appUrl = (process.env.FRONTEND_URL || "http://localhost:3000").replace(
  /\/$/,
  ""
);

const issuer = process.env.JWT_ISSUER || appUrl;
const audience = process.env.JWT_AUDIENCE || "mentorlagbe-express";

// Better Auth's JWT plugin publishes public keys at /api/auth/jwks.
// jose caches them and automatically refetches when a new kid appears.
const JWKS = createRemoteJWKSet(new URL(`${appUrl}/api/auth/jwks`));

/**
 * Verifies signature, expiration, issuer and audience, then returns only the
 * trusted claims Express is allowed to use. Never accept identity fields from
 * the request body or headers.
 */
export async function verifyExpressJwt(token) {
  const { payload } = await jwtVerify(token, JWKS, {
    issuer,
    audience,
  });

  return {
    id: payload.sub,
    userId: payload.sub,
    email: typeof payload.email === "string" ? payload.email : undefined,
    name: typeof payload.name === "string" ? payload.name : undefined,
    role: typeof payload.role === "string" ? payload.role : undefined,
    plan: typeof payload.plan === "string" ? payload.plan : undefined,
  };
}
