import React from "react";
import { Paper } from "@material-ui/core";
import {
  Details,
  UserManagement,
  DeleteAccount,
  Workspaces,
  Billing
} from "./components";
import { PageLoadingSpinner } from "../";
import { useStyles } from "./styles";
import { useAccount } from "./hooks";

const Account = () => {
  const { paper } = useStyles();
  const { isLoading, isOwner, isSubscribed } = useAccount();

  return isLoading ? (
    <PageLoadingSpinner />
  ) : (
      <>
        <Paper className={paper} variant="outlined">
          <Details />
        </Paper>
        <Billing />
        {isSubscribed && isOwner && (
          <Paper className={paper} variant="outlined">
            <UserManagement />
          </Paper>
        )}

        <Paper className={paper} variant="outlined">
          <Workspaces />
        </Paper>

        <Paper className={paper} variant="outlined">
          <DeleteAccount />
        </Paper>
      </>
    );
};

export default Account;
