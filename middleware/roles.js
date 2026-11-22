const ALLOWED_ROLES = ["student", "tutor", "admin"];

/**
 * Role guard. The role comes from the verified JWT payload (req.auth), never
 * from the request body, query string or client-supplied headers.
 */
export function requireRole(...roles) {
  const allowed = roles.filter((role) => ALLOWED_ROLES.includes(role));

  return (req, res, next) => {
    if (!req.auth) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!allowed.includes(req.auth.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action.",
      });
    }

    return next();
  };
}

export const requireStudent = requireRole("student");
export const requireTutor = requireRole("tutor");
export const requireAdmin = requireRole("admin");
