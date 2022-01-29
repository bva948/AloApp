"use strict";
const { InvalidRequestBodyFormat } = require("../../../errors");
const FormatMessage = require("../../../utils/formatMessage");
const FormatRoomChat = require("../../../utils/formatRoomChat");
const FormatUser = require("../../../utils/formatUser");
const Response = require("../../../utils/response");
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    const { uid, fid } = ctx.request.body;
    if (!uid) {
      throw new InvalidRequestBodyFormat("'UID' is required.");
    }
    if (!fid) {
      throw new InvalidRequestBodyFormat("'FID' is required.");
    }
    try {
      const [user, userf] = await Promise.all([
        strapi.query("users-zalo").findOne({ id: parseInt(uid, 10) }),
        strapi.query("users-zalo").findOne({ id: parseInt(fid, 10) }),
      ]);
      if (!user || !userf) {
        return Response.uesrIsNotValidated(ctx, {
          msg: "Người dùng không tồn tại.",
        });
      }
      const rsFind = await strapi.query("room-chat").find({
        members_contains: uid,
      });
      let data = rsFind.find((c) => c?.members.includes(parseInt(fid, 10)));
      if (!data) {
        data = await strapi.query("room-chat").create({
          members: [uid, fid],
        });
        if (!data) {
          return Response.badRequest(ctx, {
            msg: "Xảy ra sự cố không mong muốn. Vui lòng thử lại sau.",
          });
        }
      }
      const rid = data?.members?.filter((id) => id != uid);
      let rUser = await strapi.query("users-zalo").findOne({ id_in: rid });
      rUser = FormatUser.formatUserInMessage(rUser);
      data = FormatRoomChat.format(data);
      let totalUnRead = await strapi.query("message").count({
        roomchatId: data?.id,
        senderId_ne: uid,
        unRead: true,
      });

      return Response.ok(ctx, {
        data: {
          ...data,
          reciveUser: rUser,
          totalUnRead,
        },
        msg: "OK",
      });
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
      const rs = await strapi.query("room-chat").find({
        members_contains: uid,
      });

      let data = await Promise.all(
        rs.map(async (rc) => {
          const rid = rc?.members?.filter((id) => id != uid);
          let rUser = await strapi.query("users-zalo").findOne({ id_in: rid });
          rUser = FormatUser.formatUserInMessage(rUser);
          let lastMessage = await strapi.query("message").findOne({
            roomchatId: rc?.id,
            _sort: "created_at:DESC",
          });
          lastMessage = FormatMessage.format(lastMessage);
          let totalUnRead = await strapi.query("message").count({
            roomchatId: rc?.id,
            senderId_ne: uid,
            unRead: true,
          });
          let newrc = FormatRoomChat.format(rc);
          return {
            ...newrc,
            reciveUser: rUser,
            lastMessage,
            totalUnRead,
          };
        })
      );
      data = data?.filter((item) => Object.keys(item?.lastMessage).length > 0);

      data.sort((a, b) => {
        const ad = new Date(a?.lastMessage?.createdAt);
        const bd = new Date(b?.lastMessage?.createdAt);
        return bd.getTime() - ad.getTime();
      });

      return Response.ok(ctx, {
        data: data
          ? {
              lData: data,
            }
          : [],
        msg: "OK",
      });
    } catch (err) {
      return Response.badRequest(ctx, {
        msg: "Xảy ra sự cố không mong muốn. Vui lòng thử lại sau.",
      });
    }
  },

  async delete(ctx) {
    const { roomchatId } = ctx.request.body;
    if (!roomchatId) {
      throw new InvalidRequestBodyFormat("'Room' is required.");
    }
    try {
      const check = await strapi.query("room-chat").findOne({
        id: roomchatId,
      });
      if (!check) {
        return Response.paramIsInValid(ctx, {
          msg: "Tin nhắn không tồn tại",
        });
      }
      const listMessage = await strapi.query("message").find({
        roomchatId: check?.id,
      });
      await Promise.all(
        listMessage?.map((message) => {
          strapi.query("message").delete({ id: message?.id });
        })
      );
      await strapi.query(`room-chat`).delete({ id: check?.id });
      return Response.ok(ctx, {
        data: null,
        msg: "OK",
      });
    } catch (err) {
      return Response.badRequest(ctx, {
        msg: "Xảy ra sự cố không mong muốn. Vui lòng thử lại sau.",
      });
    }
  },
};
