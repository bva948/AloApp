"use strict";
const { InvalidRequestBodyFormat } = require("../../../errors");
const FormatUser = require("../../../utils/formatUser");
const Response = require("../../../utils/response");
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    const { uid, fid, rId } = ctx.request.body;
    if (!uid) {
      throw new InvalidRequestBodyFormat("'UID' is required.");
    }
    if (!fid) {
      throw new InvalidRequestBodyFormat("'FID' is required.");
    }
    if (uid === fid) {
      throw new InvalidRequestBodyFormat("'UID' and 'FID' invalid.");
    }
    const validData1 = {
      uid: parseInt(uid, 10),
      fid: parseInt(fid, 10),
    };
    const validData2 = {
      uid: parseInt(fid, 10),
      fid: parseInt(uid, 10),
    };
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
      const [contact1, contact2] = await Promise.all([
        strapi.query("contacts").findOne(validData1),
        strapi.query("contacts").findOne(validData2),
      ]);
      if (contact1 || contact2) {
        return Response.uesrExisted(ctx, {
          msg: "Người dùng đã tồn tại.",
        });
      }
      await Promise.all([
        strapi.query("contacts").create(validData1),
        strapi.query("contacts").create(validData2),
      ]);
      if (rId) {
        await strapi.query("request-add-friend").delete({ id: rId });
      }
      return Response.ok(ctx, { data: null, msg: "OK" });
    } catch (err) {
      return Response.badRequest(ctx, {
        msg: "Xảy ra sự cố không mong muốn. Vui lòng thử lại sau.",
      });
    }
  },

  async getUserContacts(ctx) {
    const { uid } = ctx.request.body;
    if (!uid) {
      throw new InvalidRequestBodyFormat("'UID' is required.");
    }
    try {
      let data = await strapi.services["contacts"].getContacts(uid);
      return Response.ok(ctx, {
        data: data,
        msg: "OK",
      });
    } catch (err) {
      return Response.badRequest(ctx, {
        msg: "Xảy ra sự cố không mong muốn. Vui lòng thử lại sau.",
      });
    }
  },

  async getUserContactWishLists(ctx) {
    const { uid, page = 1, pageSize = 15 } = ctx.request.body;
    if (!uid) {
      throw new InvalidRequestBodyFormat("'UID' is required.");
    }
    if (page <= 0 || pageSize <= 0) {
      throw new InvalidRequestBodyFormat("'Page' or 'PageSize' invalid.");
    }
    const iswishlist = true;
    let data = await strapi.services["contacts"].getContacts(
      uid,
      page,
      pageSize,
      iswishlist
    );
    const count = await strapi.services["contacts"].count({ uid, iswishlist });
    const hasMore = page * pageSize < count;
    return Response.ok(ctx, {
      data: {
        lData: data,
        pagination: { hasMore, page, pageSize },
      },
      msg: "OK",
    });
  },

  async deleteUserContacts(ctx) {
    const { uid, fid } = ctx.request.body;
    if (!uid) {
      throw new InvalidRequestBodyFormat("'UID' is required.");
    }
    if (!fid) {
      throw new InvalidRequestBodyFormat("'FID' is required.");
    }
    if (uid === fid) {
      throw new InvalidRequestBodyFormat("'UID' and 'FID' invalid.");
    }
    const validData1 = {
      uid: parseInt(uid, 10),
      fid: parseInt(fid, 10),
    };
    const validData2 = {
      uid: parseInt(fid, 10),
      fid: parseInt(uid, 10),
    };
    try {
      const [contact1, contact2] = await Promise.all([
        strapi.query("contacts").findOne(validData1),
        strapi.query("contacts").findOne(validData2),
      ]);
      if (contact1) {
        await strapi.query("contacts").delete({ id: contact1?.id });
      }
      if (contact2) {
        await strapi.query("contacts").delete({ id: contact2?.id });
      }
      return Response.ok(ctx, { data: null, msg: "OK" });
    } catch (err) {
      return Response.badRequest(ctx, {
        msg: "Xảy ra sự cố không mong muốn. Vui lòng thử lại sau.",
      });
    }
  },

  async userWishLists(ctx) {
    const { uid, fid, iswishlist } = ctx.request.body;
    const type =
      iswishlist || iswishlist === 0 ? Number(iswishlist) : undefined;
    if (!uid) {
      throw new InvalidRequestBodyFormat("'UID' is required.");
    }
    if (!fid) {
      throw new InvalidRequestBodyFormat("'FID' is required.");
    }
    if (uid === fid) {
      throw new InvalidRequestBodyFormat("'UID' and 'FID' invalid.");
    }
    if (type !== 0 && type !== 1) {
      throw new InvalidRequestBodyFormat("'Iswishlist' invalid");
    }
    const validData = {
      uid: parseInt(uid, 10),
      fid: parseInt(fid, 10),
    };
    try {
      const contact = await strapi.query("contacts").findOne(validData);
      if (!contact) {
        return Response.uesrIsNotValidated(ctx, {
          msg: "Người dùng không tồn tại.",
        });
      }
      await strapi
        .query("contacts")
        .update({ id: contact.id }, { iswishlist: type === 1 });
    } catch (err) {
      return Response.badRequest(ctx, {
        msg: "Xảy ra sự cố không mong muốn. Vui lòng thử lại sau.",
      });
    }
    return Response.ok(ctx, { msg: "OK" });
  },

  async findByPhone(ctx) {
    const { uid, phonenumber } = ctx.request.body;
    if (!uid) {
      throw new InvalidRequestBodyFormat("'UID' is required.");
    }
    if (!phonenumber) {
      throw new InvalidRequestBodyFormat("'Phone' is required.");
    }
    try {
      let user = await strapi.query("users-zalo").findOne({ phonenumber });
      if (!user) {
        return Response.ok(ctx, {
          msg: `Số điện thoại này chưa kích hoạt Zalo. Vui lòng thử lại.`,
          data: {},
        });
      }
      user = FormatUser.format(user);

      let [checkIsFriend, checkRQAF1, checkRQAF2] = await Promise.all([
        strapi.query("contacts").findOne({
          uid: parseInt(uid, 10),
          fid: parseInt(user?.id, 10),
        }),
        strapi.query("request-add-friend").findOne({
          senderId: parseInt(uid, 10),
          reciverId: parseInt(user?.id, 10),
        }),
        strapi.query("request-add-friend").findOne({
          senderId: parseInt(user?.id, 10),
          reciverId: parseInt(uid, 10),
        }),
      ]);
      if (checkIsFriend) {
        user[`isFriend`] = true;
      }
      if (checkRQAF1) {
        user[`isRQAF`] = `Đã gửi yêu cầu kết bạn`;
        user[`waitting`] = true;
        user[`rId`] = checkRQAF1?.id;
      }
      if (user?.id === parseInt(uid, 10) || checkIsFriend || checkRQAF1) {
        user[`showBtn`] = false;
        return Response.ok(ctx, { data: user, msg: "OK" });
      }
      user[`showBtn`] = true;
      if (checkRQAF2) {
        user[`isRQAF`] = true;
        user[`rId`] = checkRQAF2?.id;
      }
      return Response.ok(ctx, { data: user, msg: "OK" });
    } catch (err) {
      return Response.badRequest(ctx, {
        msg: "Xảy ra sự cố không mong muốn. Vui lòng thử lại sau.",
      });
    }
  },
  async getIsFriend(ctx) {
    const { uid, fid } = ctx.request.body;
    if (!uid) {
      throw new InvalidRequestBodyFormat("'UID' is required.");
    }
    if (!fid) {
      throw new InvalidRequestBodyFormat("'Fid' is required.");
    }
    try {
      let [checkIsFriend, checkRQAF1, checkRQAF2] = await Promise.all([
        strapi.query("contacts").findOne({
          uid: parseInt(uid, 10),
          fid: parseInt(fid, 10),
        }),
        strapi.query("request-add-friend").findOne({
          senderId: parseInt(uid, 10),
          reciverId: parseInt(fid, 10),
        }),
        strapi.query("request-add-friend").findOne({
          senderId: parseInt(fid, 10),
          reciverId: parseInt(uid, 10),
        }),
      ]);
      let data = {
        isFriend: false,
        isRQAF: false,
        isSRQAF: false,
      };
      if (checkIsFriend) {
        data.isFriend = true;
      }
      if (checkRQAF1) {
        data.isRQAF = true;
        data[`rId`] = checkRQAF1?.id;
      }
      if (checkRQAF2) {
        data.isSRQAF = true;
        data[`rId`] = checkRQAF2?.id;
      }
      return Response.ok(ctx, { data: data, msg: "OK" });
    } catch (err) {
      return Response.badRequest(ctx, {
        msg: "Xảy ra sự cố không mong muốn. Vui lòng thử lại sau.",
      });
    }
  },
};
