import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import { Typography } from "@material-ui/core";

const Details = ({ firebaseAuth }) => {
  const { email, createdAt, lastLoginAt } = firebaseAuth;

  return (
    <>
      <Typography component="h2" variant="h6">
        Email
      </Typography>
      <Typography>{email}</Typography>

      <Typography component="h2" variant="h6">
        Cake Day
      </Typography>
      <Typography>{moment(createdAt, "x").format("LL")}</Typography>

      <Typography component="h2" variant="h6">
        Last Login
      </Typography>
      <Typography>{moment(lastLoginAt, "x").format("LLLL")}</Typography>
    </>
  );
};

const mapStateToProps = state => {
  const {
    firebase: {
      auth: firebaseAuth,
    },
  } = state;


  return {
    firebaseAuth
  };
};

export default connect(mapStateToProps)(Details);
