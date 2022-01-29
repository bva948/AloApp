"use strict";

const FormatUser = require("../../../utils/formatUser");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async getContacts(uid, iswishlist = false) {
    let userContacts;
    if (iswishlist) {
      userContacts = await strapi.services["contacts"].find({
        uid,
        iswishlist,
      });
    } else {
      userContacts = await strapi.services["contacts"].find({
        uid,
      });
    }
    const userIds = userContacts.map((u) => u.fid);
    let query = {
      id_in: userIds,
      _sort: "fullname:ASC",
    };
    const res = await strapi.services["users-zalo"].find(query);
    const data = FormatUser.formatListContacts(res);
    return data;
  },
};
