"use strict";

const { InvalidRequestBodyFormat } = require("../../../errors");
const Response = require("../../../utils/response");
const FormatUser = require("../../../utils/formatUser");
const { createJwtToken } = require("../../../utils/token");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    const { phonenumber, password, fullname } = ctx.request.body;
    if (!phonenumber) {
      throw new InvalidRequestBodyFormat("'Phone number' is required.");
    }
    if (!password) {
      throw new InvalidRequestBodyFormat("'Password' is required.");
    }
    if (!fullname) {
      throw new InvalidRequestBodyFormat("'Name' is required.");
    }
    const validData = {
      phonenumber,
      password,
      fullname,
    };
    try {
      const user = await strapi
        .query("users-zalo")
        .findOne({ phonenumber: phonenumber });
      if (user) {
        return Response.uesrExisted(ctx, {
          msg: "Số điện thoại đã được sử dụng.",
        });
      }
      await strapi.query("users-zalo").create(validData);
    } catch (err) {
      return Response.badRequest(ctx, {
        msg: "Xảy ra sự cố không mong muốn. Vui lòng thử lại sau.",
      });
    }
    return Response.ok(ctx, { msg: "OK" });
  },

  async login(ctx) {
    const { phonenumber, password } = ctx.request.body;
    if (!phonenumber) {
      throw new InvalidRequestBodyFormat("'Phone number' is required.");
    }
    if (!password) {
      throw new InvalidRequestBodyFormat("'Password' is required.");
    }
    const validData = {
      phonenumber,
      password,
    };
    let user;
    try {
      const user1 = await strapi.query("users-zalo").findOne({ phonenumber });
      if (!user1) {
        return Response.uesrIsNotValidated(ctx, {
          msg: "Bạn chưa đăng ký tài khoản Zalo. Bạn có muốn tạo tài khoản mới?",
        });
      }
      user = await strapi.query("users-zalo").findOne(validData);
      if (!user) {
        return Response.paramIsInValid(ctx, {
          msg: "Mật khẩu không chính xác. Vui lòng kiểm tra và thử lại.",
        });
      }
      user = FormatUser.format(user);
      const jwt = await createJwtToken(user);
      user.active = true;
      user.token = jwt;
      await strapi
        .query("users-zalo")
        .update({ id: user?.id }, { active: true });
    } catch (err) {
      return Response.badRequest(ctx, {
        msg: "Xảy ra sự cố không mong muốn. Vui lòng thử lại sau.",
      });
    }
    return Response.ok(ctx, { msg: "OK", data: user });
  },

  async logout(ctx) {
    const { uid } = ctx.request.body;
    if (!uid) {
      throw new InvalidRequestBodyFormat("'Uid' is required.");
    }
    try {
      const user = await strapi.query("users-zalo").findOne({ id: uid });
      if (!user) {
        return Response.uesrIsNotValidated(ctx, {
          msg: "Người dùng không tồn tại.",
        });
      }
      await strapi.query("users-zalo").update({ id: uid }, { active: false });
    } catch (err) {
      return Response.badRequest(ctx, {
        msg: "Xảy ra sự cố không mong muốn. Vui lòng thử lại sau.",
      });
    }
    return Response.ok(ctx, { msg: "OK" });
  },

  async findByPhone(ctx) {
    const { phonenumber } = ctx.request.body;
    if (!phonenumber) {
      throw new InvalidRequestBodyFormat("'Phone Number' is required.");
    }
    let user;
    try {
      user = await strapi.query("users-zalo").findOne({ phonenumber });
      user = FormatUser.format(user);
    } catch (err) {
      return Response.badRequest(ctx, {
        msg: "Xảy ra sự cố không mong muốn. Vui lòng thử lại sau.",
      });
    }
    return Response.ok(ctx, { msg: "OK", data: user });
  },

  async forgotPassword(ctx) {
    const { phonenumber, newpassword } = ctx.request.body;
    if (!phonenumber) {
      throw new InvalidRequestBodyFormat("'Phone number' is required.");
    }
    if (!newpassword) {
      throw new InvalidRequestBodyFormat("'New Password' is required.");
    }
    try {
      const user = await strapi
        .query("users-zalo")
        .findOne({ phonenumber: phonenumber });
      if (!user) {
        return Response.uesrIsNotValidated(ctx, {
          msg: "Người dùng không tồn tại.",
        });
      }
      await strapi
        .query("users-zalo")
        .update({ id: user?.id }, { password: newpassword });
    } catch (err) {
      return Response.badRequest(ctx, {
        msg: "Xảy ra sự cố không mong muốn. Vui lòng thử lại sau.",
      });
    }
    return Response.ok(ctx, { msg: "OK" });
  },
  async changePassword(ctx) {
    const { uid, oldPassword, newPassword } = ctx.request.body;
    if (!uid) {
      throw new InvalidRequestBodyFormat("'Uid' is required.");
    }
    if (!oldPassword) {
      throw new InvalidRequestBodyFormat("'Old password' is required.");
    }
    if (!newPassword) {
      throw new InvalidRequestBodyFormat("'New Password' is required.");
    }
    try {
      const user = await strapi
        .query("users-zalo")
        .findOne({ id: uid, password: oldPassword });
      if (!user) {
        return Response.uesrIsNotValidated(ctx, {
          msg: "Người dùng không tồn tại.",
        });
      }
      await strapi
        .query("users-zalo")
        .update({ id: uid }, { password: newPassword });
    } catch (err) {
      return Response.badRequest(ctx, {
        msg: "Xảy ra sự cố không mong muốn. Vui lòng thử lại sau.",
      });
    }
    return Response.ok(ctx, { msg: "OK" });
  },
  async getFriendInfo(ctx) {
    const { fid } = ctx.request.body;
    if (!fid) {
      throw new InvalidRequestBodyFormat("'Fid' is required.");
    }
    try {
      let user = await strapi.query("users-zalo").findOne({ id: fid });
      if (!user) {
        return Response.uesrIsNotValidated(ctx, {
          msg: "Người dùng không tồn tại.",
        });
      }
      user = FormatUser.format(user);
      return Response.ok(ctx, { msg: "OK", data: user });
    } catch (err) {
      return Response.badRequest(ctx, {
        msg: "Xảy ra sự cố không mong muốn. Vui lòng thử lại sau.",
      });
    }
  },
};
