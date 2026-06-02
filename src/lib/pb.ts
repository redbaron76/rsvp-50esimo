import PocketBase from "pocketbase";

export const pb = new PocketBase(import.meta.env.VITE_API_BASE_URL);

const accessToken = import.meta.env.VITE_API_ACCESS_TOKEN;

if (accessToken) {
  pb.beforeSend = (url, options) => {
    options.headers = {
      ...options.headers,
      "X-Access-Token": accessToken,
    };
    return { url, options };
  };
}
