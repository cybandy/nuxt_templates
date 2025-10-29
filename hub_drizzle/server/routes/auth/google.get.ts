export default defineOAuthGoogleEventHandler({
  config: {},
  async onSuccess(event, { user: oauthUser, tokens }) {
    const { user: userSession } = await myGetUserSession(event)

    const redirect_page = '/'

    if (userSession?.id) {
      // console.log('already logged in', id);

      const user = await findUserById(userSession.id);
      if (user) {
        await updateUser(userSession?.id, {
          googleId: oauthUser.sub,
          googleToken: tokens.access_token,
        });

        await updateUserSession(event, { ...userSession });
        return sendRedirect(event, redirect_page);
      }
    }

    let user = await findUserByGoogleId(oauthUser.sub);

    if (user) {
      // console.log('user already exist in db');
      await updateUser(user.id, {
        googleId: oauthUser.sub,
        googleToken: tokens.access_token,
      });

      await updateUserSession(event, getSafeUser(user))
      return sendRedirect(event, redirect_page);
    }

    // If the user is not signed in, search for an existing user with that email address without a Google ID
    // If it exists, tells the user to link the Google account

    user = await findUserBy(
      and(
        eq(lower(tables.users.email), oauthUser.email.toLowerCase()),
        isNull(tables.users.googleId),
      ),
    );

    if (user) {
      await updateUser(user.id, {
        googleId: oauthUser.sub,
        googleToken: tokens.access_token,
      });

      await updateUserSession(event, getSafeUser(user))
      return sendRedirect(event, redirect_page);
    }

    // Fall back to the user's login if the name is not available

    const userName = (oauthUser.name as string) || `${oauthUser.given_name} ${oauthUser.family_name}`;

    // If the user is not signed in and no user exists with that GitHub ID or email address, create a new user

    const createdUser = await createUser({
      firstName: userName.split('')[0] as string,
      lastName: (userName.split('')[1] as string) || '',
      email: oauthUser.email as string,
      avatar: oauthUser.picture as string,
      googleId: oauthUser.sub as string,
      googleToken: tokens.access_token as string,
      // verifiedAt: new Date().toUTCString(),
    });

    await updateUserSession(event, getSafeUser(createdUser));

    await updateSession(
      event,
      { password: useRuntimeConfig().session.password },
      { to: '/onboarding' },
    );

    return sendRedirect(event, '/onboarding');
  },
});
