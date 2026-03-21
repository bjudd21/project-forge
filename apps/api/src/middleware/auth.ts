import { clerkMiddleware, getAuth } from '@clerk/express';
import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from 'express';

const prisma = new PrismaClient();

// Apply to app before all routes — validates the Clerk session JWT
export { clerkMiddleware };

// Requires a valid Clerk session, returns 401 otherwise
export const requireUser: RequestHandler = (req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized', code: 'AUTH_REQUIRED' });
    return;
  }
  next();
};

// Returns the authenticated Clerk user ID, or null if unauthenticated
export function getClerkUserId(req: Parameters<RequestHandler>[0]): string | null {
  const { userId } = getAuth(req);
  return userId ?? null;
}

// Upserts the Clerk user into the local database on first access.
// Email is extracted from JWT session claims (Clerk includes it by default).
export const syncUser: RequestHandler = async (req, _res, next) => {
  const { userId, sessionClaims } = getAuth(req);
  if (!userId) return next();

  try {
    const email = (sessionClaims?.email as string | undefined) ?? `${userId}@pending.clerk`;
    await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: {
        id: userId,
        clerkId: userId,
        email,
      },
    });
  } catch (err) {
    // Non-fatal — log and proceed; user record will be synced on next request
    console.error('[auth] syncUser failed:', err);
  }

  next();
};
