import { useValidatedParams, useValidatedQuery, z, zh } from 'h3-zod';

export default defineEventHandler(async (event) => {
  const { user } = await myRequireUserSession(event); // for authorization. further logic can be implemented below

  const { limit, cursor } = await useValidatedQuery(
    event,
    z.object({ limit: zh.intAsString, cursor: z.string().optional() }),
  );

  return hubBlob().list({
    limit: limit ? limit : 10,
    cursor: cursor ? cursor : undefined,
    prefix: `/storage`, // change to suite your project
    folded: true,
  });

  // return 'Hello Nitro';
});
