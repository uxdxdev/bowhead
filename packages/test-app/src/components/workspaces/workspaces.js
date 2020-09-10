import React from "react";
import { Paper } from "@material-ui/core";
import { UserManagement } from "../user-management";
import { WorkspaceList } from "../workspace-list";
import { CreateWorkspace } from '../create-workspace'
import { PageLoadingSpinner } from "../page-loading-spinner";
import { useStyles } from "./styles";
import { useWorkspaces } from "./hooks";

const Settings = () => {

  const { paper } = useStyles();
  const { isLoading, isWorkspaceOwner, isSubscribed } = useWorkspaces();

  if (!isSubscribed) {
    return <div>Please subscribe to access Workspaces</div>
  }

  return isLoading ? (
    <PageLoadingSpinner />
  ) : (
      <>
        <Paper className={paper} variant="outlined">
          <CreateWorkspace />
        </Paper>

        <Paper className={paper} variant="outlined">
          <WorkspaceList />
        </Paper>
        {isWorkspaceOwner && (
          <Paper className={paper} variant="outlined">
            <UserManagement />
          </Paper>
        )}
      </>
    );
};

export default Settings;
