const { decodeJwtToken } = require('../../utils/token');
const Response = require('../../utils/response');

module.exports = async (ctx, next) => {
  const authToken = ctx.request.headers['auth-token'];
  if (!authToken) {
    return Response.unauthorized(ctx, { status: -1, msg: "Unauthorized" });
  }

  const isAuthenticated = await decodeJwtToken(authToken);
  if (!isAuthenticated.isValid) {
    return Response.unauthorized(ctx, { status: -1, msg: "Unauthorized" })
  }

  return await next();

};
