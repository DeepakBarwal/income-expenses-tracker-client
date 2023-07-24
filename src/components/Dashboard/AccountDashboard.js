import AccountSummary from "./AccountSummary";
import AccountList from "./AccountList";
import { useContext, useEffect } from "react";
import { authContext } from "../context/AuthContext/AuthContext";

const AccountDashboard = () => {
  const { fetchProfileAction, profile, error } = useContext(authContext);

  // dispatch action
  useEffect(() => {
    fetchProfileAction();
  }, []);

  return (
    <>
      {error ? (
        <>
          <div
            className="bg-red-100 border text-center border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </>
      ) : (
        <>
          <AccountSummary accounts={profile?.accounts} />
          <AccountList accounts={profile?.accounts} />
        </>
      )}
    </>
  );
};

export default AccountDashboard;
