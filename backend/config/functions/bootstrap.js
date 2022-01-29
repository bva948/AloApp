"use strict";

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#bootstrap
 */

async function setPublicPermissions(newPermissions) {
  // Find the ID of the public role
  const publicRole = await strapi
    .query("role", "users-permissions")
    .findOne({ type: "public" });

  // List all available permissions
  const publicPermissions = await strapi
    .query("permission", "users-permissions")
    .find({
      type: ["users-permissions", "application"],
      role: publicRole.id,
    });

  // Update permission to match new config
  const controllersToUpdate = Object.keys(newPermissions);
  const updatePromises = publicPermissions
    .filter((permission) => {
      // Only update permissions included in newConfig
      if (!controllersToUpdate.includes(permission.controller)) {
        return false;
      }
      if (!newPermissions[permission.controller].includes(permission.action)) {
        return false;
      }
      return true;
    })
    .map((permission) => {
      // Enable the selected permissions
      return strapi
        .query("permission", "users-permissions")
        .update({ id: permission.id }, { enabled: true });
    });
  await Promise.all(updatePromises);
}

module.exports = async () => {
  await setPublicPermissions({
    "room-chat": [`findbyid`, `create`, `delete`],
    message: ["findbyroomchatid", "setmessageunread", "setunread", "create"],
    "users-zalo": [
      "create",
      "findbyphone",
      "forgotpassword",
      "login",
      "logout",
      "update",
      "changepassword",
      `getfriendinfo`,
    ],
    contacts: [
      "create",
      "deleteusercontacts",
      "userwishlists",
      "getusercontacts",
      "getidusercontacts",
      "getusercontactwishlists",
      `findbyphone`,
      `getisfriend`,
    ],
    "request-add-friend": [
      `create`,
      `findbyid`,
      `count`,
      `delete`,
      `getrequestaddfriend`,
    ],
    post: [`create`, `find`, `update`, `delete`, `findbyid`],
    "like-post": [`create`],
    "post-comment": [`create`, `getbypostid`],
  });

  const io = require("socket.io")(strapi.server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });

  let users = [];

  const addUser = (userId, socketId) => {
    const user = users.find((user) => user.id === userId);
    if (!user) {
      users.push({
        id: userId,
        socketId,
      });
    } else {
      users = users.map((item) => {
        if (item?.id === userId) {
          return { ...item, socketId };
        }
        return item;
      });
    }
  };

  const getUser = (userId) => {
    return users.find((user) => user.id === userId);
  };

  const getUserBySocketId = (socketId) => {
    return users.find((user) => user.socketId === socketId);
  };

  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };

  let otherDevice = false;

  io.on("connection", function (socket) {
    // connect
    socket.on(`addUser`, (userId) => {
      const u = users.find((u) => u?.id === userId);
      if (u) {
        otherDevice = true;
        const logout = true;
        io.to(u?.socketId).emit(`otherDevice`, logout);
      }
      addUser(userId, socket.id);
    });

    // send message

    socket.on(`sendMessage`, ({ data, reciverId }) => {
      const reciverUser = getUser(reciverId);
      if (reciverUser) {
        io.to(reciverUser.socketId).emit(`getMessage`, data);
      }
    });

    socket.on(`sendComment`, ({ data, uid }) => {
      let us = users.filter((u) => u?.id !== uid);
      us.forEach((u) => {
        io.to(u.socketId).emit(`getComment`, data);
      });
    });

    socket.on(`sendRQAF`, (data) => {
      const reciverUser = getUser(parseInt(data?.reciverId, 10));
      if (reciverUser) {
        io.to(reciverUser.socketId).emit(`getRequestAddFriend`, data);
      }
    });
    // like post
    socket.on(`likePost`, (data) => {
      const us = users.filter((u) => u?.id !== data?.uid);
      us.forEach((u) => {
        io.to(u.socketId).emit(`getLikePost`, data);
      });
    });

    // disconnect
    socket.on(`disconnect`, async () => {
      const user = getUserBySocketId(socket.id);
      if (!otherDevice) {
        const rs = await strapi
          .query("users-zalo")
          .update({ id: user?.id }, { active: false });
      }
      otherDevice = false;
      removeUser(socket.id);
    });
  });
};
