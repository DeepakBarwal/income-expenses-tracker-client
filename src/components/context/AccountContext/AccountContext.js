import { createContext, useReducer } from "react";
import {
  ACCOUNT_DETAILS_SUCCESS,
  ACCOUNT_DETAILS_FAIL,
  ACCOUNT_CREATION_SUCCESS,
  ACCOUNT_CREATION_FAIL,
} from "./accountActionTypes.js";
import { ACCOUNT_URL } from "../../../constants/backendApiV1Urls.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const accountContext = createContext();

// Initial State
const INITIAL_STATE = {
  userAuth: JSON.parse(localStorage.getItem("userAuth")),
  account: null,
  accounts: [],
  isLoading: false,
  error: null,
};

const accountReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    // Account Details
    case ACCOUNT_DETAILS_SUCCESS:
      return { ...state, account: payload, isLoading: false, error: null };

    case ACCOUNT_DETAILS_FAIL:
      return { ...state, account: null, isLoading: false, error: payload };

    // Create Account
    case ACCOUNT_CREATION_SUCCESS:
      return { ...state, account: payload, isLoading: false, error: null };

    case ACCOUNT_CREATION_FAIL:
      return { ...state, account: null, isLoading: false, error: payload };

    default:
      return state;
  }
};

export default function AccountContextProvider({ children }) {
  const [state, dispatch] = useReducer(accountReducer, INITIAL_STATE);
  const navigate = useNavigate();

  //   get account details action
  const getAccountDetailsAction = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${state?.userAuth?.token}`,
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.get(`${ACCOUNT_URL}/${id}`, config);
      if (res?.data?.status === "success") {
        dispatch({
          type: ACCOUNT_DETAILS_SUCCESS,
          payload: res?.data?.data,
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: ACCOUNT_DETAILS_FAIL,
        payload: error?.response?.data?.message,
      });
    }
  };

  //   create account action
  const createAccountAction = async (formData) => {
    const config = {
      headers: {
        Authorization: `Bearer ${state?.userAuth?.token}`,
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post(`${ACCOUNT_URL}`, formData, config);
      if (res?.data?.status === "success") {
        dispatch({
          type: ACCOUNT_CREATION_SUCCESS,
          payload: res?.data?.data,
        });
      }
      // Redirect
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      dispatch({
        type: ACCOUNT_CREATION_FAIL,
        payload: error?.response?.data?.message,
      });
    }
  };

  return (
    <accountContext.Provider
      value={{
        getAccountDetailsAction,
        account: state?.account,
        createAccountAction,
        error: state?.error,
      }}
    >
      {children}
    </accountContext.Provider>
  );
}
