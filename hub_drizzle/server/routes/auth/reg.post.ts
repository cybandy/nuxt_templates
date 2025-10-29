import { useValidatedBody, z } from 'h3-zod';

export default defineEventHandler(async (event) => {
  //   const body = await useValidatedBody(
  //     event,
  //     UserSchema.insert.extend({
  //       password: z
  //         .string()
  //         .min(8)
  //         .regex(/(?=.*[a-z])(?=.*[A-Z])(\d)(?=.*[@#$%^&*_])/, ''),
  //     }),
  //   );

  const body = await useValidatedBody(
    event,
    UserSchema.insert.extend({
      password: z.string(),
      email: z.email(),
    }),
  );

  // check password strength
  const p_str = checkPasswordStrength(body.password);
  if (p_str.score < 90) {
    throw createError('Password too weak');
  }

  // check logged in user
  const { user: logged_user } = await getUserSession(event);
  if (logged_user) {
    return sendRedirect(event, '/profile');
  }
  // check if email already exist
  const user = await findUserBy(
    eq(lower(tables.users.email), body.email.toLowerCase()),
  );
  if (user) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Account already exist with the email',
    });
  }

  const hashedPassword = await hashPassword(body.password);

  const _d = await createUser({ ...body, password: hashedPassword });

  await updateUserSession(event, _d);

  return sendNoContent(event, 204);
  // return sendRedirect(event, '/onboarding');
});
