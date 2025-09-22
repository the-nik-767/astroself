import axios from "axios";
import { Platform } from "react-native";

// Enum for HTTP Status Codes
export enum HttpStatusCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  UNSUPPORTED_MEDIA_TYPE = 415,
  UNACCEPTABLE = 406,
  METHOD_NOT_ALLOWED = 405,
  ALREADY_EXISTS = 409,
  CONFLICT = 408,
  VERSION_OUT_OF_DATE = 418,
  SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
  NETWORK_CONNECT_TIMEOUT = 599,
}

const baseURL = __DEV__
  ? Platform.select({
      android: 'http://astrology.hcshub.in/api',
      ios: 'http://astrology.hcshub.in/api',
      default: 'http://astrology.hcshub.in/api',
    })
  : 'http://astrology.hcshub.in/api'; // Production URL

// Create Axios instance with default headers
const http = axios.create({
  baseURL,
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor for adding auth token
// http.interceptors.request.use(
//   async (config) => {
//     try {
//       const jsonValue = await AsyncStorage.getItem('USER_DATA');
//       const data = jsonValue != null ? JSON.parse(jsonValue) : null;
//       const token = data?.token;

//       if (token) {
//         config.headers.token = token;
//       }
//     } catch (error) {
//       console.error('Error setting auth token:', error);
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for handling errors
// http.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === HttpStatusCode.UNAUTHORIZED) {
//       // Handle unauthorized error (e.g., clear storage and redirect to login)
//       await AsyncStorage.clear();
//       // You might want to add navigation logic here
//     }
//     return Promise.reject(error);
//   }
// );

export default http;
