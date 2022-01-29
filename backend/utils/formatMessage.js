class FormatMessage {
  static format(message, options) {
    if (!message) {
      return {};
    }

    const result = {
      id: message?.id,
      senderId: message?.senderId,
      content: message?.content,
      image: message?.image,
      createdAt: message?.created_at,
      unRead: message?.unRead,
      roomchatId: message?.roomchatId,
    };

    return result;
  }
  static formatList(messages, options) {
    if (!messages) {
      return [];
    }
    return messages.map((message) => this.format(message, options));
  }
}
module.exports = FormatMessage;
