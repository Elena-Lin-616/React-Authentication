import React, { useState } from "react";

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
export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem("token");
  const [token, setToken] = useState(initialToken); // read data from local storage

  const userIsLoggedIn = !!token; //empty string->false, "xxx"->true

  // function to change the token state

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token"); // remove token from local storage to logout
  };

  const handleLogin = (token, expirationTime) => {
    // store token to local storage, which can store primitive type data
    // object -> string
    setToken(token);
    localStorage.setItem("token", token); // store token to local storage

    const remainingDuration = calculateRemainingTime(expirationTime); // just login -> remainingDuration >0
    // set Time -> expire -> log out
    setTimeout(handleLogout, remainingDuration);
  };
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
