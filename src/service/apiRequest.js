import api from "./api";
import axios from "axios";

export const getSongs = async (data, headerData) => {
  return axios
    .create({
      baseURL: process.env.REACT_APP_SONGS_DB_URL,
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.9",
      "Content-Type": "application/json",
    })
    .get("", data, {
      headers: {
        ...headerData,
      },
    })
    .then((resp) => resp)
    .catch((error) => error.response);
};

export const getRequest = async (requestUrl, data, headerData) => {
  return api
    .get(requestUrl, data, {
      headers: { ...headerData },
    })
    .then((resp) => resp)
    .catch((error) => error.response);
};

export const postRequest = async (requestUrl, data, headerData) => {
  return axios
    .create({
      baseURL: process.env.REACT_APP_SPOTIFY_ACCOUNT_URL,
      withCredentials: false,
      crossDomain: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .post(
      requestUrl,
      {
        grant_type: "client_credentials",
        client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
        client_secret: process.env.REACT_APP_SPOTIFY_CLIENT_SECRET,
      },
      {
        headers: { ...headerData },
      }
    )
    .then((resp) => resp)
    .catch((error) => error.response);
};
