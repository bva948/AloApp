import NetInfo from "@react-native-community/netinfo";
import { intervalToDuration } from "date-fns";
import { SERVICE_URL } from "../../services/base.services";

const strapiMedia = SERVICE_URL;
const specificCharacter = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

export const nextScreen = (navigation, next, data = {}) => {
  navigation.navigate(next, data);
};

export const isVietnamesePhoneNumber = (number) => {
  return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
};

export const isEmpty = (obj) => {
  if (Array.isArray(obj)) {
    return obj.length === 0;
  }
  return Object.keys(obj).length === 0;
};

export const containNumber = (fullName) => {
  return /\d/.test(fullName);
};

export const checkPassword = (password) => {
  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,30}$/.test(password);
};

export const containSpecificCharacter = (text) => {
  return specificCharacter.test(text);
};

export const checkConnected = async () => {
  return await NetInfo.fetch().then((state) => {
    return state.isConnected;
  });
};

export const getStrapiMedia = (media) => {
  return strapiMedia + media;
};

export const formatPhoneNumber = (phoneNumber) => {
  let match = phoneNumber.match(/^(\d{4})(\d{3})(\d{3})$/);
  if (match) {
    return match[1] + " " + match[2] + " " + match[3];
  }
  return phoneNumber;
};

export const checkTime = (startDate, endDate) => {
  return intervalToDuration({
    start: new Date(startDate),
    end: endDate ? new Date(endDate) : new Date(),
  });
};

export const dateTimeFormat = (dt) => {
  var date = new Date(dt);
  var dateStr =
    ("00" + date.getHours()).slice(-2) +
    ":" +
    ("00" + date.getMinutes()).slice(-2) +
    ` ` +
    ("00" + date.getDate()).slice(-2) +
    "/" +
    ("00" + (date.getMonth() + 1)).slice(-2) +
    "/" +
    date.getFullYear();
  return dateStr;
};

export const timeFormat = (dt) => {
  var date = new Date(dt);
  var dateStr =
    ("00" + date.getHours()).slice(-2) + ":" + ("00" + date.getMinutes()).slice(-2) + ` Hôm nay`;
  return dateStr;
};

export function timeSince(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval;

  interval = seconds / 31536000;
  if (interval > 1) {
    return dateFullFormat(date);
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return dateFullFormat(date);
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return dateFullFormat(date);
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " giờ";
  }
  interval = seconds / 60;
  if (interval >= 1) {
    return Math.floor(interval) + " phút";
  }
  if (interval < 1 && seconds > 10) {
    return `${seconds} giây`;
  }
  return `Vừa xong`;
}

export const dateFullFormat = (dt) => {
  var date = new Date(dt);
  var dateStr =
    ("00" + date.getDate()).slice(-2) +
    "/" +
    ("00" + (date.getMonth() + 1)).slice(-2) +
    "/" +
    date.getFullYear();
  return dateStr;
};

export const timeM = (dt) => {
  var date = new Date(dt);
  var dateStr = ("00" + date.getHours()).slice(-2) + ":" + ("00" + date.getMinutes()).slice(-2);
  return dateStr;
};
