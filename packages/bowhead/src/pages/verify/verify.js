import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { verifyUser } from "../../actions/authActions";
import { PageLoadingSpinner } from "../../components";

const Verify = ({
  verifyUser,
  isLoading
}) => {
  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  if (isLoading) {
    return <Redirect to="/dashboard" />;
  }

  return <PageLoadingSpinner />;
};

const mapStateToProps = (
  state
) => {
  const { firebase: { auth: { uid } }, bowhead: { isVerifyingUser, isVerified }
  } = state;

  const isLoading = uid && !isVerifyingUser && isVerified;
  return {
    isLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    verifyUser: () => dispatch(verifyUser()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Verify);
