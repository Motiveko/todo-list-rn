import { Platform } from "react-native";
const API_HOST = "https://motiveko.mooo.com";
const platform = Platform.OS;
const googleAndroidClientId = process.env
  .EXPO_PUBLIC_ANDROID_CLIENT_ID as string;
const googleWebClientId = process.env.EXPO_PUBLIC_WEB_CLIENT_ID as string;

export const Config = {
  apiHost: API_HOST,
  googleAndroidClientId,
  googleWebClientId,
  platform,
  googleClientId:
    platform === "android" ? googleAndroidClientId : googleWebClientId,
};
