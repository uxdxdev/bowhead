import React from "react";
import { Paper } from "@material-ui/core";
import { Details } from "../details";
import { DeleteAccount } from "../delete-account";
import { Billing } from "../billing";
import { PageLoadingSpinner } from "../page-loading-spinner";
import { useStyles } from "./styles";
import { useAccount } from "./hooks";

const Account = () => {
  const { paper } = useStyles();
  const { isLoading } = useAccount();

  return isLoading ? (
    <PageLoadingSpinner />
  ) : (
      <>
        <Paper className={paper} variant="outlined">
          <Details />
        </Paper>
        <Billing />
        <Paper className={paper} variant="outlined">
          <DeleteAccount />
        </Paper>
      </>
    );
};

export default Account;
