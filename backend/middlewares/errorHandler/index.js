'use strict';

const debug = require('debug')('koa:error-handler');
const Response = require('../../utils/response');
const {
  InvalidRequestBodyFormat
} = require('../../errors');

/**
 * Return middleware that handle exceptions in Koa.
 * Dispose to the first middleware.
 *
 * @return {function} Koa middleware.
 */
module.exports = strapi => {
  return {
    initialize() {
      strapi.app.use(
        async function errorHandler(ctx, next) {
          try {
            await next();

            // Respond 404 Not Found for unhandled request
            if (!ctx.body && (!ctx.status || ctx.status === 404)) {
              debug('Unhandled by router');
              return Response.notFound(ctx, {status: -1, msg: "Not found"});
            }
            if (!ctx.body && (!ctx.status || ctx.status > 400)) {  // todo: handle chi tiet sau
              debug('Unhandled by router');
              return Response.forbidden(ctx, {status: -1, msg: "Forbidden"});
            }
          } catch (err) {
            debug('An error occured: %s', err.name);

            if (err instanceof InvalidRequestBodyFormat) {
              return Response.unprocessableEntity(ctx, {msg: err.message || "Unprocessable Entity"});
            }
            return Response.internalServerError(ctx, {status: -1, msg: err.message || "Internal Server Error"});
          }
        }
      );
    },
  };
};
