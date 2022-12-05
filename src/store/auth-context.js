import React, { useState, useEffect, useCallback } from "react";
let logoutTimer;
const AuthContext = React.createContext({
  // 1. state
  token: "",
  isLoggedIn: false,
  // 2. function to change state
  login: (token) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime(); // assume expirationTime is a string

  const remainingDuration = adjExpirationTime - currentTime;
  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationTime = localStorage.getItem("expirationTime");

  const remainingDuration = calculateRemainingTime(storedExpirationTime);

  if (remainingDuration <= 6000) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }
  return {
    token: storedToken,
    duration: remainingDuration,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  // check if it's valid token
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }
  const [token, setToken] = useState(initialToken); // read data from local storage

  const userIsLoggedIn = !!token; //empty string->false, "xxx"->true

  // function to change the token state

  const handleLogout = useCallback(() => {
    setToken("");
    localStorage.removeItem("token"); // remove token from local storage to logout
    localStorage.removeItem("expirationTime");
    // clear timer when user logout
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const handleLogin = (token, expirationTime) => {
    // store token to local storage, which can store primitive type data
    // object -> string
    setToken(token);
    localStorage.setItem("token", token); // store token to local storage
    localStorage.setTimeout("expirationTime", expirationTime);

    const remainingDuration = calculateRemainingTime(expirationTime); // just login -> remainingDuration >0
    // set Time -> expire -> log out
    logoutTimer = setTimeout(handleLogout, remainingDuration);
  };
  // set timer when each time refresh / render page
  useEffect(() => {
    if (tokenData) {
      logoutTimer = setTimeout(handleLogout, tokenData.duration);
    }
  }, [tokenData, handleLogout]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: handleLogin,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
