module.exports = {
  settings: {
    errorHandler: {
      enabled: true,
    },
    cors: {
      origin: ["*"], //allow all origins
      headers: ["*"], //allow all headers
    },
    parser: {
      enabled: true,
      multipart: true,
      formidable: {
        maxFileSize: 8 * 1024 * 1024, // Defaults to 200mb
      },
    },
  },
};
