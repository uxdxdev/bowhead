import React from "react";
import { Paper } from "@material-ui/core";
import { DeleteAccount } from "../delete-account";
import { PageLoadingSpinner } from "../page-loading-spinner";
import { useStyles } from "./styles";
import { useSettings } from "./hooks";

const Settings = () => {
  const { paper } = useStyles();
  const { isLoading } = useSettings();

  return isLoading ? (
    <PageLoadingSpinner />
  ) : (
      <Paper className={paper} variant="outlined">
        <DeleteAccount />
      </Paper>
    );
};

export default Settings;
