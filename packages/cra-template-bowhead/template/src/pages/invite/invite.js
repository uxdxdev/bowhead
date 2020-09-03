import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { verifyInvitedUser } from "../../actions/userActions";
import { PageLoadingSpinner } from "../../components";

const Invite = ({
  verifyInvitedUser,
  isVerified
}) => {
  useEffect(() => {
    verifyInvitedUser();
  }, [verifyInvitedUser]);

  if (isVerified) {
    return <Redirect to="/dashboard" />;
  }

  return <PageLoadingSpinner />;
};

const mapStateToProps = (
  state
) => {
  const {
    firebase: {
      auth: {
        uid
      }
    },
    auth: {
      isVerifyingInvitedUser,
      isInvitedUserVerified
    }
  } = state;

  const isVerified = uid && !isVerifyingInvitedUser && isInvitedUserVerified;
  return {
    isVerified
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    verifyInvitedUser: () => dispatch(verifyInvitedUser()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Invite);
