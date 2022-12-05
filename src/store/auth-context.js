import React, { useState } from "react";

const AuthContext = React.createContext({
  // 1. state
  token: "",
  isLoggedIn: false,
  // 2. function to change state
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem("token");
  const [token, setToken] = useState(initialToken); // read data from local storage

  const userIsLoggedIn = !!token; //empty string->false, "xxx"->true

  // function to change the token state
  const handleLogin = (token) => {
    // store token to local storage, which can store primitive type data
    // object -> string
    setToken(token);
    localStorage.setItem("token", token); // store token to local storage
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token"); // remove token from local storage to logout
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
