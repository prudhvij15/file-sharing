const generateFilename = (originalFilename) => {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 8);
  const filename = `${timestamp}_${randomString}_${originalFilename}`;

  return filename;
};

module.exports = {
  generateFilename,
};
