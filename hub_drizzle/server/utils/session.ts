import type { H3Event } from 'h3';
import type { User, UserSessionRequired, UserSession } from '#auth-utils';
import type * as z from 'zod';

export async function updateUserSession(
  event: H3Event,
  user: User,
) {
  await replaceUserSession(event, { user });
}

interface myUserSessionRequired extends UserSessionRequired {
  user: z.output<typeof UserSchema.select>
}
interface myGetUserSession extends UserSession {
  user: z.output<typeof UserSchema.select>
}
export async function myRequireUserSession(
  event: H3Event,
  opts = { statusCode: 401, message: 'Unauthorized' },
) {
  return requireUserSession(event, opts) as Promise<myUserSessionRequired>;
}

export async function myGetUserSession(event: H3Event) {
  return getUserSession(event) as Promise<myGetUserSession>
}