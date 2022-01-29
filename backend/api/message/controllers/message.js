"use strict";
const { InvalidRequestBodyFormat } = require("../../../errors");
const FormatMessage = require("../../../utils/formatMessage");
const Response = require("../../../utils/response");
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    const { roomchatId, senderId, content, image = null } = ctx.request.body;
    if (!roomchatId) {
      throw new InvalidRequestBodyFormat("'Room Id' is required.");
    }
    if (!senderId) {
      throw new InvalidRequestBodyFormat("'Sender Id' is required.");
    }
    const validData = {
      roomchatId: parseInt(roomchatId, 10),
      senderId: parseInt(senderId, 10),
      content,
      image,
    };
    try {
      const existed = await strapi.query("room-chat").findOne({
        members_contains: senderId,
        id: roomchatId,
      });
      if (!existed) {
        return Response.uesrIsNotValidated(ctx, {
          data: null,
          msg: "Người dùng không tồn tại. Vui lòng thử lại.",
        });
      }
      const rs = await strapi.query("message").create(validData);
      const data = FormatMessage.format(rs);
      return Response.ok(ctx, { data: data, msg: "OK" });
    } catch (err) {
      return Response.badRequest(ctx, {
        msg: "Xảy ra sự cố không mong muốn. Vui lòng thử lại sau.",
      });
    }
  },

  async findByRoomChatId(ctx) {
    const { roomchatId, page = 1, pageSize = 40 } = ctx.request.body;
    if (!roomchatId) {
      throw new InvalidRequestBodyFormat("'Room Id' is required.");
    }
    if (page <= 0 || pageSize <= 0) {
      throw new InvalidRequestBodyFormat("'Page' or 'PageSize' invalid.");
    }
    const validData = {
      roomchatId: roomchatId,
      _start: (page - 1) * pageSize,
      _limit: pageSize,
      _sort: "created_at:DESC",
    };
    try {
      const rs = await strapi.query("message").find(validData);
      const data = FormatMessage.formatList(rs);
      const count = await strapi.services["message"].count({
        roomchatId: roomchatId,
      });
      const hasMore = page * pageSize < count;
      return Response.ok(ctx, {
        data: {
          lData: data,
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

  async setUnRead(ctx) {
    const { roomchatId, uid } = ctx.request.body;
    if (!roomchatId) {
      throw new InvalidRequestBodyFormat("'Room Id' is required.");
    }
    if (!uid) {
      throw new InvalidRequestBodyFormat("'Uid' is required.");
    }
    const validData = {
      roomchatId: roomchatId,
      senderId_ne: uid,
      unRead: true,
    };
    try {
      const rs = await strapi.query("message").find(validData);
      const rss = await Promise.all(
        rs.map(async (m) => {
          await strapi.query("message").update({ id: m.id }, { unRead: false });
        })
      );
      return Response.ok(ctx, { data: rss, msg: "OK" });
    } catch (err) {
      return Response.badRequest(ctx, {
        msg: "Xảy ra sự cố không mong muốn. Vui lòng thử lại sau.",
      });
    }
  },

  async setMessageUnRead(ctx) {
    const { mId } = ctx.request.body;
    if (!mId) {
      throw new InvalidRequestBodyFormat("'Room Id' is required.");
    }
    try {
      await strapi.query("message").update({ id: mId }, { unRead: false });
      return Response.ok(ctx, { data: null, msg: "OK" });
    } catch (err) {
      return Response.badRequest(ctx, {
        msg: "Xảy ra sự cố không mong muốn. Vui lòng thử lại sau.",
      });
    }
  },
};
