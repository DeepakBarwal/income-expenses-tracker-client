import { createContext, useReducer } from "react";
import axios from "axios";
import {
  LOGIN_URL,
  PROFILE_URL,
  REGISTER_URL,
} from "../../../constants/backendApiV1Urls";
import {
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  FETCH_PROFILE_FAIL,
  FETCH_PROFILE_SUCCESS,
  LOGOUT,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
} from "./authActionTypes.js";
import { useNavigate } from "react-router-dom";

export const authContext = createContext();

const INITIAL_STATE = {
  userAuth: JSON.parse(localStorage.getItem("userAuth")) || null,
  error: null,
  isLoading: false,
  profile: null,
};

// Auth Reducer
const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    // Register
    case REGISTER_SUCCESS:
      return { ...state, isLoading: false, error: null, userAuth: payload };

    case REGISTER_FAIL:
      return { ...state, error: payload, isLoading: false, userAuth: null };

    // Login
    case LOGIN_SUCCESS:
      // Add user to localStorage
      localStorage.setItem("userAuth", JSON.stringify(payload));
      return { ...state, isLoading: false, error: null, userAuth: payload };

    case LOGIN_FAILED:
      return { ...state, error: payload, isLoading: false, userAuth: null };

    // Profile
    case FETCH_PROFILE_SUCCESS:
      return { ...state, isLoading: false, error: null, profile: payload };

    case FETCH_PROFILE_FAIL:
      return { ...state, isLoading: false, error: payload, profile: null };

    // Logout
    case LOGOUT:
      // Remove user from localStorage
      localStorage.removeItem("userAuth");
      return { ...state, isLoading: false, error: null, userAuth: null };

    default:
      return state;
  }
};

export default function AuthContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const navigate = useNavigate();

  //   login action
  const loginUserAction = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post(LOGIN_URL, formData, config);
      if (res?.data?.status === "success") {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data,
        });
      }
      // redirect
      navigate("/dashboard");
    } catch (error) {
      dispatch({
        type: LOGIN_FAILED,
        payload: error?.response?.data?.message,
      });
      console.error(error);
    }
  };

  //   register action
  const registerUserAction = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post(REGISTER_URL, formData, config);
      if (res?.data?.status === "success") {
        dispatch({
          type: REGISTER_SUCCESS,
          payload: res.data,
        });
      }
      // redirect
      navigate("/login");
    } catch (error) {
      dispatch({
        type: REGISTER_FAIL,
        payload: error?.response?.data?.message,
      });
      console.error(error);
    }
  };

  // profile action
  const fetchProfileAction = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state?.userAuth?.token}`,
      },
    };
    try {
      const res = await axios.get(PROFILE_URL, config);
      if (res?.data?.status === "success") {
        dispatch({ type: FETCH_PROFILE_SUCCESS, payload: res.data.data });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: FETCH_PROFILE_FAIL,
        payload: error?.response?.data?.message,
      });
    }
  };

  // logout action
  const logoutUserAction = () => {
    dispatch({
      type: LOGOUT,
      payload: null,
    });
    // redirect
    navigate("/login");
  };

  return (
    <authContext.Provider
      value={{
        loginUserAction,
        userAuth: state?.userAuth,
        token: state?.userAuth?.token,
        fetchProfileAction,
        profile: state?.profile,
        error: state?.error,
        logoutUserAction,
        registerUserAction,
      }}
    >
      {children}
    </authContext.Provider>
  );
}
