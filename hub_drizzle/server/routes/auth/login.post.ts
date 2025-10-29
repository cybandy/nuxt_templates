import { useValidatedBody, z } from 'h3-zod';

export default defineEventHandler(async (event) => {
  const body = await useValidatedBody(
    event,
    z.object({
      email: z.email(),
      password: z.string(),
    }),
  );

  // check logged in user
  const { user: logged_user } = await getUserSession(event);
  if (logged_user) {
    return sendRedirect(event, '/profile');
  }
  // check if user already exist
  const user = await findUserBy(
    eq(lower(tables.users.email), body.email.toLowerCase()),
  );

  if (!user) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Account does not exist',
    });
  }

  if (!user.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Account seems to be registered with a social login',
    });
  }

  const _validPwd = await verifyPassword(user.password, body.password);

  if (!_validPwd) {
    throw createError('Invalid login details');
  }

  await updateUserSession(event, getSafeUser(user))

  return sendNoContent(event, 204);
  // return await sendRedirect(event, '/profile');
});
