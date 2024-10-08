import { Dimensions } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ar";
import { MMKV } from "react-native-mmkv";

dayjs.extend(relativeTime);
dayjs.locale("ar");

export const { width, height } = Dimensions.get("window");

export const storage = new MMKV();

export const getDataMMKV = (key: string) => {
  try {
    const json = storage.getString(key);
    if (!json) return null;
    return JSON.parse(json);
  } catch (error) {
    console.log("Error reading data from MMKV", error);
  }
};

export const storeDataMMKV = (key: string, value: any) => {
  try {
    storage.set(key, JSON.stringify(value));
  } catch (error) {
    console.log("Error storing data in MMKV", error);
  }
};

export const removeAllMMKV = () => {
  try {
    storage.clearAll();
  } catch (error) {
    console.log("Error removing all data from MMKV", error);
  }
};

export const dateFromNow = (date: Date) => {
  return dayjs(date).fromNow();
};

export const isDateInSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const dayInWeek = (date: Date) => {
  const days = [
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];
  return days[date?.getDay()];
};

export const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export const shuffleArr = (arr: any[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const wait = (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
