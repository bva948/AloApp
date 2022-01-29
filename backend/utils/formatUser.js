class FormatUser {
  static format(user, options) {
    if (!user) {
      return {};
    }

    const result = {
      id: user?.id,
      fullname: user?.fullname,
      phonenumber: user?.phonenumber,
      avatar: user?.avatar?.url || null,
      birthday: user?.birthday,
      active: user?.active,
      backgroundImage: user?.backgroundImage?.url || null,
      sex: user?.sex,
    };
    return result;
  }
  static formatContact(user, options) {
    if (!user) {
      return {};
    }

    const result = {
      id: user?.id,
      fullname: user?.fullname,
      phonenumber: user?.phonenumber,
      avatar: user?.avatar?.url || null,
      active: user?.active,
      value: user?.fullname,
      key: user?.id,
    };
    return result;
  }
  static formatUserInMessage(user, options) {
    if (!user) {
      return {};
    }

    const result = {
      id: user?.id,
      fullname: user?.fullname,
      avatar: user?.avatar?.url || null,
      active: user?.active,
    };

    return result;
  }
  static formatList(users, options) {
    if (!users) {
      return [];
    }
    return users.map((u) => this.format(u, options));
  }
  static formatListContacts(users, options) {
    if (!users) {
      return [];
    }
    return users.map((u) => this.formatContact(u, options));
  }
}
module.exports = FormatUser;
