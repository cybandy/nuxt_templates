import { useValidatedQuery, z, zh } from 'h3-zod';
export default defineEventHandler(async (event) => {
  const { team_id } = await useValidatedQuery(
    event,
    z.object({ team_id: z.string() }),
  );

  const { user, team_id: teamId } = await myRequireUserSession(event);

  if (teamId === team_id) {
    return sendNoContent(event);
  }

  await isTeamUser(team_id, user.id);

  await replaceUserSession(event, { user: user, team_id });

  return sendNoContent(event);
});
