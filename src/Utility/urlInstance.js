import axios from "axios";

let axiosInstance = axios.create({
  // baseURL:"https://ialabbooking.be.evangadisc.com/api"
  // baseURL: "http://localhost:6370/api",
  baseURL: "https://iafistlabbooking.be.evangadisc.com/api",
});
export { axiosInstance };
