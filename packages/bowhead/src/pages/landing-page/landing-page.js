import React from "react";
import { NavBar } from "../../components";

const LandingPage = ({ children }) => {

  return (
    <>
      <NavBar />
      {children}
    </>
  );
};

export default LandingPage;
