export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true,
  },
  async onSuccess(event, { user: oauthUser, tokens }) {
    const { user: userSession } = await myGetUserSession(event)

    const redirect_page = '/'

    // if already logged in then link account
    if (userSession?.id) {
      const user = await findUserById(userSession.id);
      if (user) {
        await updateUser(userSession.id, {
          githubId: oauthUser.id,
          githubToken: tokens.access_token,
        });

        await updateUserSession(event, { ...userSession });
        return sendRedirect(event, redirect_page);
      }
    }

    let user = await findUserByGitHubId(oauthUser.id);

    if (user) {
      // console.log('user already exist in db');
      await updateUser(user.id, {
        githubId: oauthUser.id,
        githubToken: tokens.access_token,
      });

      // console.log('update session');
      await updateUserSession(event, getSafeUser(user));

      await updateSession(
        event,
        { password: useRuntimeConfig(event).session.password },
        { to: redirect_page },
      );

      // console.log('sending redirect');
      // return sendRedirect(event, redirect_page);
      return sendNoContent(event);
    }

    // If the user is not signed in, search for an existing user with that email address without a GitHub ID
    // If it exists, then link the GitHub account
    // console.log('user is not already in the system');

    user = await findUserBy(
      and(
        eq(lower(tables.users.email), oauthUser.email?.toLowerCase()),
        isNull(tables.users.githubId),
      ),
    );

    if (user) {
      await updateUser(user.id, {
        githubId: oauthUser.id,
        githubToken: tokens.access_token,
      });

      await updateUserSession(event, getSafeUser(user))
      return sendRedirect(event, redirect_page);
    }

    // Fall back to the user's login if the name is not available
    const userName = oauthUser.name || oauthUser.login;

    // If the user is not signed in and no user exists with that GitHub ID or email address, create a new user
    const createdUser = await createUser({
      firstName: userName.split('')[0] as string,
      lastName: (userName.split('')[1] as string) || '',
      email: oauthUser.email as string,
      avatar: oauthUser.avatar_url as string,
      githubId: oauthUser.id as number,
      githubToken: tokens.access_token as string,
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
