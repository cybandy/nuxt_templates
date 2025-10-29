/**
 * can access files
 * example - localhost:3000/files/avatar.png
 */
export default defineEventHandler(async (event) => {
  const { pathname } = getRouterParams(event);
  if (!pathname) {
    return createError({
      statusCode: 404,
      statusMessage: 'Not Found',
    });
  }
  return hubBlob().serve(event, pathname);
});
