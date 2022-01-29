"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async beforeDelete(params) {
      const { id } = params;
      const [data, data2] = await Promise.all([
        strapi.query("like-post").find({ pid: id }),
        strapi.query("post-comment").find({ pid: id }),
      ]);
      await Promise.all(
        data.map((item) => strapi.query("like-post").delete({ id: item?.id }))
      );
      await Promise.all(
        data2.map((item) => strapi.query("post-comment").delete({ id: item?.id }))
      );
    },
  },
};
