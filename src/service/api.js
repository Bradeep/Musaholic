import axios from "axios";

export default axios.create({
  baseURL: process.env.REACT_APP_SPOTIFY_API_URL,
  withCredentials: false,
  crossDomain: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
