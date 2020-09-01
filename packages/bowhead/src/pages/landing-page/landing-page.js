import React from "react";
import { Footer, NavBar } from "../../components";

const LandingPage = ({ children }) => {

  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
};

export default LandingPage;
