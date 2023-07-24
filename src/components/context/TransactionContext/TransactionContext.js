import React, { createContext, useReducer } from "react";
import axios from "axios";
import { TRANSACTION_URL } from "../../../constants/backendApiV1Urls.js";

import {
  TRANSACTION_CREATION_SUCCESS,
  TRANSACTION_CREATION_FAIL,
} from "./transactionsActionTypes";
import { useNavigate } from "react-router-dom";

export const transactionContext = createContext();

const INITIAL_STATE = {
  transaction: null,
  transactions: [],
  isLoading: false,
  error: null,
  token: JSON.parse(localStorage.getItem("userAuth")),
};
const transactionReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case TRANSACTION_CREATION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        transaction: payload,
      };
    case TRANSACTION_CREATION_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload,
        transaction: null,
      };
    default:
      return state;
  }
};

const TransactionContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, INITIAL_STATE);
  const navigate = useNavigate();

  //create transaction
  const createTransactionAction = async (accountData) => {
    try {
      //header
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state?.token?.token}`,
        },
      };
      //request
      const res = await axios.post(TRANSACTION_URL, accountData, config);

      if (res?.data?.status === "success") {
        dispatch({
          type: TRANSACTION_CREATION_SUCCESS,
          payload: res?.data?.data,
        });
      }
      //   Redirect
      navigate(`/account-details/${accountData.accountId}`);
    } catch (error) {
      dispatch({
        type: TRANSACTION_CREATION_FAIL,
        payload: error?.response?.data?.message,
      });
    }
  };
  return (
    <transactionContext.Provider
      value={{
        transaction: state.transaction,
        transactions: state.transactions,
        createTransactionAction,
        error: state?.error,
      }}
    >
      {children}
    </transactionContext.Provider>
  );
};

export default TransactionContextProvider;
