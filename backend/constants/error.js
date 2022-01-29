'use strict';

/**
 * Client Failures
 */
 module.exports.POST_IS_NOT_EXISTED = {
  statusCode: 9992,
  code: 'POST_IS_NOT_EXISTED',
  message: 'Bài viết không tồn tại.'
};

module.exports.CODE_VERIFY_IS_INCORRECT = {
  statusCode: 9993,
  code: 'CODE_VERIFY_IS_INCORRECT',
  message: 'Mã xác thực không đúng.'
};

module.exports.NO_DATA = {
  statusCode: 9994,
  code: 'NO_DATA',
  message: 'Không có dữ liệu hoặc không còn dữ liệu.'
};

module.exports.USER_IS_NOT_VALIDATED = {
  statusCode: 9995,
  code: 'USER_IS_NOT_VALIDATED',
  message: 'Không có người dùng này.'
};

module.exports.USER_EXISTED = {
  statusCode: 9996,
  code: 'USER_EXISTED',
  message: 'Người dùng đã tồn tại.'
};

module.exports.METHOD_IS_INVALID = {
  statusCode: 9997,
  code: 'METHOD_IS_INVALID',
  message: 'Phương thức không đúng.'
};

module.exports.TOKEN_IS_INVALID = {
  statusCode: 9998,
  code: 'TOKEN_IS_INVALID',
  message: 'Sai token.'
};