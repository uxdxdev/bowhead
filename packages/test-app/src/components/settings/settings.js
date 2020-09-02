import React from "react";
import { Paper } from "@material-ui/core";
import { UserManagement } from "../user-management";
import { Workspaces } from "../workspaces";
import { CreateWorkspace } from '../create-workspace'
import { PageLoadingSpinner } from "../page-loading-spinner";
import { useStyles } from "./styles";
import { useSettings } from "./hooks";

const Settings = () => {
  const { paper } = useStyles();

  const { isLoading, isOwner } = useSettings();


  return isLoading ? (
    <PageLoadingSpinner />
  ) : (
      <>
        <Paper className={paper} variant="outlined">
          <CreateWorkspace />
        </Paper>

        <Paper className={paper} variant="outlined">
          <Workspaces />
        </Paper>
        {isOwner && (
          <Paper className={paper} variant="outlined">
            <UserManagement />
          </Paper>
        )}
      </>
    );
};

export default Settings;
