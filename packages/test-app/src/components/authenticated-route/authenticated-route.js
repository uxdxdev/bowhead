import React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";

const AuthenticatedRoute = ({ isAuthenticated, ...rest }) => {
  if (!isAuthenticated) {
    return <Redirect to="/signin" />
  }

  return <Route {...rest} />;
};

const mapStateToProps = state => {
  const {
    firebase: { auth: { uid } },
  } = state;

  const isAuthenticated = !!uid

  return {
    isAuthenticated
  };
};

export default connect(mapStateToProps)(AuthenticatedRoute);
