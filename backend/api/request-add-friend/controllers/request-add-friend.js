"use strict";
const { InvalidRequestBodyFormat } = require("../../../errors");
const FormatUser = require("../../../utils/formatUser");
const Response = require("../../../utils/response");
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async count(ctx) {
    const { uid } = ctx.request.body;
    if (!uid) {
      throw new InvalidRequestBodyFormat("'UID' is required.");
    }
    try {
      const rs = await strapi
        .query("request-add-friend")
        .count({ reciverId: uid });
      return Response.ok(ctx, { data: rs, msg: "OK" });
    } catch (err) {
      return Response.badRequest(ctx, {
        msg: "Xảy ra sự cố không mong muốn. Vui lòng thử lại sau.",
      });
    }
  },

  async create(ctx) {
    const { senderId, reciverId, message = null } = ctx.request.body;
    if (!senderId) {
      throw new InvalidRequestBodyFormat("'UID' is required.");
    }
    if (!reciverId) {
      throw new InvalidRequestBodyFormat("'FID' is required.");
    }
    const validData = {
      senderId: parseInt(senderId, 10),
      reciverId: parseInt(reciverId, 10),
      message,
    };
    try {
      const [user, userf] = await Promise.all([
        strapi.query("users-zalo").findOne({ id: parseInt(senderId, 10) }),
        strapi.query("users-zalo").findOne({ id: parseInt(reciverId, 10) }),
      ]);
      if (!user || !userf) {
        return Response.uesrIsNotValidated(ctx, {
          msg: "Người dùng không tồn tại.",
        });
      }
      const check = await strapi.query("request-add-friend").findOne({
        senderId: parseInt(senderId, 10),
        reciverId: parseInt(reciverId, 10),
      });
      if (check) return Response.ok(ctx, { data: null, msg: "OK" });
      const rs = await strapi.query("request-add-friend").create(validData);
      return Response.ok(ctx, { data: rs, msg: "OK" });
    } catch (err) {
      return Response.badRequest(ctx, {
        msg: "Xảy ra sự cố không mong muốn. Vui lòng thử lại sau.",
      });
    }
  },

  async findById(ctx) {
    const { uid } = ctx.request.body;
    if (!uid) {
      throw new InvalidRequestBodyFormat("'UID' is required.");
    }
    try {
      let rq = await strapi.query("request-add-friend").find({
        reciverId: parseInt(uid, 10),
      });
      rq = await Promise.all(
        rq.map(async (r) => {
          let u = await strapi
            .query("users-zalo")
            .findOne({ id: parseInt(r?.senderId, 10) });

          u = FormatUser.format(u);
          return {
            id: r?.id,
            senderId: r?.senderId,
            senderUser: u,
            reciverId: r?.reciverId,
            message: r?.message,
          };
        })
      );
      return Response.ok(ctx, { data: rq, msg: "OK" });
    } catch (err) {
      return Response.badRequest(ctx, {
        msg: "Xảy ra sự cố không mong muốn. Vui lòng thử lại sau.",
      });
    }
  },

  async delete(ctx) {
    const { id } = ctx.params;
    if (!id) {
      throw new InvalidRequestBodyFormat("'ID' is required.");
    }
    try {
      await strapi.query("request-add-friend").delete({ id });
      return Response.ok(ctx, { data: null, msg: "OK" });
    } catch (err) {
      return Response.badRequest(ctx, {
        msg: "Xảy ra sự cố không mong muốn. Vui lòng thử lại sau.",
      });
    }
  },

  async getRequestAddFriend(ctx) {
    const { uid } = ctx.request.body;
    if (!uid) {
      throw new InvalidRequestBodyFormat("'UID' is required.");
    }
    try {
      let rq = await strapi.query("request-add-friend").find({
        senderId: parseInt(uid, 10),
      });
      rq = await Promise.all(
        rq.map(async (r) => {
          let u = await strapi
            .query("users-zalo")
            .findOne({ id: parseInt(r?.reciverId, 10) });
          u = FormatUser.format(u);
          return {
            id: r?.id,
            senderId: r?.senderId,
            reciverUser: u,
            message: r?.message,
          };
        })
      );
      return Response.ok(ctx, { data: rq, msg: "OK" });
    } catch (err) {
      return Response.badRequest(ctx, {
        msg: "Xảy ra sự cố không mong muốn. Vui lòng thử lại sau.",
      });
    }
  },
};
