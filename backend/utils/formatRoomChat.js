class FormatRoomChat {
  static format(roomchat, options) {
    if (!roomchat) {
      return {};
    }

    const result = {
      id: roomchat?.id,
      members: roomchat?.members,
    };

    return result;
  }
  static formatList(roomchats, options) {
    if (!roomchats) {
      return [];
    }
    return roomchats.map((roomchat) => this.format(roomchat, options));
  }
}
module.exports = FormatRoomChat;
