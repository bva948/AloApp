"use strict";
const Response = require("../../../utils/response");
const { InvalidRequestBodyFormat } = require("../../../errors");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    const { uid, page = 1, pageSize = 15 } = ctx.request.body;
    if (!uid) {
      throw new InvalidRequestBodyFormat("'UID' is required.");
    }
    try {
      let listF = await strapi.query("contacts").find({
        uid,
      });
      listF = listF?.map((item) => parseInt(item?.fid, 10));
      listF.push(uid);
      let [data, count] = await Promise.all([
        strapi.query("post").find({
          author_in: listF,
          _start: (page - 1) * pageSize,
          _limit: pageSize,
          _sort: `created_at:DESC`,
        }),
        strapi.query("post").count({
          author_in: listF,
        }),
      ]);
      const hasMore = page * pageSize < count;
      data = await Promise.all(
        data.map(async (item) => {
          const [author, isLike, likeCount, commentCount] = await Promise.all([
            strapi.query("users-zalo").findOne({ id: item?.author }),
            strapi.query("like-post").findOne({ uid, pid: item?.id }),
            strapi.query("like-post").count({ pid: item?.id }),
            strapi.query("post-comment").count({ pid: item?.id }),
          ]);
          return {
            ...item,
            author: {
              id: author?.id,
              fullname: author?.fullname,
              avatar: author?.avatar?.url || null,
            },
            isUserLike: isLike ? true : false,
            likeCount,
            commentCount,
          };
        })
      );
      return Response.ok(ctx, {
        data: {
          lData: data,
          pagination: {
            page,
            pageSize,
            hasMore,
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

  async create(ctx) {
    const { author, content, listImage = [] } = ctx.request.body;
    try {
      let [data, userInfo] = await Promise.all([
        strapi.query("post").create({
          author,
          content,
          listImage,
        }),
        strapi.query("users-zalo").findOne({ id: author }),
      ]);
      data = {
        ...data,
        author: {
          id: userInfo?.id,
          fullname: userInfo?.fullname,
          avatar: userInfo?.avatar?.url || null,
        },
        likeCount: 0,
        commentCount: 0,
      };
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

  async findById(ctx) {
    const { uid, page = 1, pageSize = 15 } = ctx.request.body;
    if (!uid) {
      throw new InvalidRequestBodyFormat("'UID' is required.");
    }
    try {
      let [data, count] = await Promise.all([
        strapi.query("post").find({
          author: parseInt(uid, 10),
          _start: (page - 1) * pageSize,
          _limit: pageSize,
          _sort: `created_at:DESC`,
        }),
        strapi.query("post").count({
          author: parseInt(uid, 10),
        }),
      ]);
      const hasMore = page * pageSize < count;
      data = await Promise.all(
        data.map(async (item) => {
          const [isLike, likeCount, commentCount] = await Promise.all([
            strapi.query("like-post").findOne({ uid, pid: item?.id }),
            strapi.query("like-post").count({ pid: item?.id }),
            strapi.query("post-comment").count({ pid: item?.id }),
          ]);
          return {
            ...item,
            isUserLike: isLike ? true : false,
            likeCount,
            commentCount,
          };
        })
      );
      return Response.ok(ctx, {
        data: {
          lData: data,
          pagination: {
            page,
            pageSize,
            hasMore,
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
