"use strict";

const STATUS_CODES = {
  CONTINUE: 100,
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  NOT_ACCEPTABLE: 406,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  REQUEST_ENTITY_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

const CODES = {
  OK: 1000,
  USER_EXISTED: 9996,
  PARAMETER_VALUE_IS_INVALID: 1004,
  USER_IS_NOT_VALIDATED: 9995,
  TOKEN_IS_INVALID: 9998,
  SERRVER_ERROR: 503,
};

const toResponse = (statusCode, params = {}) => {
  const { data = null, msg = null, status = 0 } = params;
  const result = {
    status,
    data,
    msg,
  };

  return result;
};

const bodyResponse = (statusCode, params = {}) => {
  const { code, data = null, msg = null } = params;
  const result = {
    data,
    msg,
    code,
  };

  return result;
};

/**
 * Utility Class to easily make Koa Response
 */
class Response {
  static get STATUS_CODES() {
    return STATUS_CODES;
  }
  static get CODES() {
    return CODES;
  }

  static forbidden(ctx, params = {}) {
    ctx.status = this.STATUS_CODES.FORBIDDEN;
    ctx.body = toResponse(ctx.status, params);
    return ctx.body;
  }

  static notFound(ctx, params = {}) {
    ctx.status = this.STATUS_CODES.NOT_FOUND;
    ctx.body = toResponse(ctx.status, params);
    return ctx.body;
  }

  static ok(ctx, params = {}) {
    ctx.status = this.STATUS_CODES.OK;
    ctx.body = bodyResponse(ctx.status, { ...params, code: this.CODES.OK });
    return ctx.body;
  }

  static badRequest(ctx, params = {}) {
    ctx.status = this.STATUS_CODES.BAD_REQUEST;
    ctx.body = bodyResponse(ctx.status, {
      ...params,
      code: this.CODES.SERRVER_ERROR,
    });
    return ctx.body;
  }

  static uesrExisted(ctx, params = {}) {
    ctx.status = this.STATUS_CODES.BAD_REQUEST;
    ctx.body = bodyResponse(ctx.status, {
      ...params,
      code: this.CODES.USER_EXISTED,
    });
    return ctx.body;
  }

  static uesrIsNotValidated(ctx, params = {}) {
    ctx.status = this.STATUS_CODES.BAD_REQUEST;
    ctx.body = bodyResponse(ctx.status, {
      ...params,
      code: this.CODES.USER_IS_NOT_VALIDATED,
    });
    return ctx.body;
  }

  static paramIsInValid(ctx, params = {}) {
    ctx.status = this.STATUS_CODES.BAD_REQUEST;
    ctx.body = bodyResponse(ctx.status, {
      ...params,
      code: this.CODES.PARAMETER_VALUE_IS_INVALID,
    });
    return ctx.body;
  }

  static unprocessableEntity(ctx, params = {}) {
    ctx.status = this.STATUS_CODES.UNPROCESSABLE_ENTITY;
    ctx.body = bodyResponse(ctx.status, {
      ...params,
      code: this.CODES.PARAMETER_VALUE_IS_INVALID,
    });
    return ctx.body;
  }

  static unauthorized(ctx, params = {}) {
    ctx.status = this.STATUS_CODES.UNAUTHORIZED;
    ctx.body = bodyResponse(ctx.status, {
      ...params,
      code: this.CODES.TOKEN_IS_INVALID,
    });
    return ctx.body;
  }

  static internalServerError(ctx, params = {}) {
    ctx.status = this.STATUS_CODES.INTERNAL_SERVER_ERROR;
    ctx.body = toResponse(ctx.status, params);
    return ctx.body;
  }
}

module.exports = Response;
