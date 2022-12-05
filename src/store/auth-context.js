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
  const [token, setToken] = useState("");

  const userIsLoggedIn = !!token; //empty string->false, "xxx"->true

  // function to change the token state
  const handleLogin = (token) => {
    setToken(token);
  };

  const handleLogout = () => {
    setToken("");
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
