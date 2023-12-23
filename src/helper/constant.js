import axios from "axios";

export const baseURL = "https://app-apis.zingo.online";

export const dbObject = axios.create({
  withCredentials: true,
  baseURL: "https://app-apis.zingo.online",
});
