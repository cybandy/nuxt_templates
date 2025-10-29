export default defineEventHandler(async (event) => {
  const { pathname } = getRouterParams(event);
  if (!pathname) {
    return createError({
      statusCode: 400,
      statusMessage: 'Invalid name',
    });
  }
  await myRequireUserSession(event);

  const form = await readFormData(event);
  const file = form.get('file') as File;
  // const filename = form.get('filename') as string;

  if (!file || !file.size) {
    throw createError({ statusCode: 400, message: 'No file provided' });
  }

  // change to suite your requirements
  ensureBlob(file, {
    maxSize: '2MB',
    types: ['image'],
  });

  const uploaded_file = await hubBlob().put(pathname, file, {
    addRandomSuffix: false,
    prefix: `images/`, // change
  });

  return {
    file: uploaded_file,
    path: uploaded_file.pathname,
  };
});
