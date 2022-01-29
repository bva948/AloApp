"use strict";

const Response = require("../../../utils/response");
const FormatUser = require("../../../utils/formatUser");
const { InvalidRequestBodyFormat } = require("../../../errors");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    const { pid, uid, comment } = ctx.request.body;
    if (!pid) {
      throw new InvalidRequestBodyFormat("'Post id' is required.");
    }
    if (!uid) {
      throw new InvalidRequestBodyFormat("'UID' is required.");
    }
    if (!comment) {
      throw new InvalidRequestBodyFormat("'Comment' is required.");
    }

    try {
      const p = await strapi.query("post").findOne({ id: pid });
      if (!p) {
        return Response.badRequest(ctx, {
          msg: "Bài viết không tồn tại.",
        });
      }
      let [rs, u] = await Promise.all([
        strapi.query("post-comment").create({ pid, uid, comment }),
        strapi.query("users-zalo").findOne({ id: uid }),
      ]);
      u = FormatUser.formatUserInMessage(u);
      rs = { ...rs, userInfo: u };
      return Response.ok(ctx, { data: rs, msg: "OK" });
    } catch (err) {
      return Response.badRequest(ctx, {
        msg: "Xảy ra sự cố không mong muốn. Vui lòng thử lại sau.",
      });
    }
  },
  async getByPostId(ctx) {
    const { pid, page = 1, pageSize = 15 } = ctx.request.body;
    if (!pid) {
      throw new InvalidRequestBodyFormat("'Post id' is required.");
    }

    try {
      const p = await strapi.query("post").findOne({ id: pid });
      if (!p) {
        return Response.badRequest(ctx, {
          msg: "Bài viết không tồn tại.",
        });
      }
      let [listC, count] = await Promise.all([
        strapi.query("post-comment").find({
          pid,
          _start: (page - 1) * pageSize,
          _limit: pageSize,
          _sort: `created_at:DESC`,
        }),
        strapi.query("post-comment").count({ pid }),
      ]);
      listC = await Promise.all(
        listC.map(async (item) => {
          let u = await strapi.query("users-zalo").findOne({ id: item?.uid });
          u = FormatUser.formatUserInMessage(u);
          return { ...item, userInfo: u };
        })
      );
      const hasMore = page * pageSize < count;
      listC.reverse();
      return Response.ok(ctx, {
        data: {
          lData: listC,
          pagination: {
            hasMore,
            page,
            pageSize,
          },
        },
        msg: "OK",
      });
    } catch (err) {
      return Response.badRequest(ctx, {
        msg: "Xảy ra sự cố không mong muốn. Vui lòng thử lại sau.",
      });
    }
  },
};
