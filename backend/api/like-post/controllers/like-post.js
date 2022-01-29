"use strict";
const Response = require("../../../utils/response");
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    const { uid, pid } = ctx.request.body;
    try {
      const rs = await strapi.query("like-post").findOne({ uid, pid });
      if (!rs) {
        await strapi.query("like-post").create({ uid, pid });
        return Response.ok(ctx, {
          data: { like: true },
          msg: "OK",
        });
      } else {
        await strapi.query("like-post").delete({ id: rs?.id });
        return Response.ok(ctx, {
          data: { like: false },
          msg: "OK",
        });
      }
    } catch (err) {
      return Response.badRequest(ctx, {
        msg: "Xảy ra sự cố không mong muốn. Vui lòng thử lại sau.",
      });
    }
  },
};
