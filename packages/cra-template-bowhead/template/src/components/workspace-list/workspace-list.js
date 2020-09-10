import React from "react";
import { connect } from "react-redux";
import * as constants from "../../utils/constants"
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { leaveWorkspace, deleteWorkspace } from "../../actions/workspaceActions";

const useStyles = makeStyles((theme) => ({
  listItemText: {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  listItemSecondary: {
    paddingRight: theme.spacing(16),
  }
}));

const Workspaces = (props) => {
  const { workspaces, leaveWorkspace, deleteWorkspace, uid, workspaceErrors } = props;

  const classes = useStyles();

  const handleLeaveWorkspace = (workspaceId) => {
    if (uid && workspaceId) {
      leaveWorkspace({ uid, workspaceId });
    } else {
      console.error("handleLeaveWorkspace");
    }
  };

  const handleDeleteWorkspace = async (workspaceId) => {
    if (uid && workspaceId) {
      deleteWorkspace({ uid, workspaceId })
    } else {
      console.error("handleDeleteWorkspace");
    }
  };

  const isMemberOfWorkspaces = workspaces && Object.keys(workspaces).length > 0;

  return (
    <>
      <Typography component="h2" variant="h6">
        Workspaces
      </Typography>
      {isMemberOfWorkspaces ? (
        <List dense>
          {Object.keys(workspaces).map((workspaceId) => {

            const workspaceRole = workspaces[workspaceId]?.role;
            const isMember = workspaceRole === constants.USER_ROLES.MEMBER;
            const isOwner = workspaceRole === constants.USER_ROLES.OWNER;
            const workspacePermissionDenied = workspaceErrors[`workspaces/${workspaceId}`]?.code === "permission-denied";
            const errorMessage = workspacePermissionDenied ? "Permission Denied" : null;
            const workspaceName = workspaces[workspaceId]?.name;
            return (
              workspaceName && (
                <ListItem key={`workspace-${workspaceId}`}
                  classes={{
                    secondaryAction: classes.listItemSecondary,
                  }}>
                  <ListItemText
                    primary={`${workspaceName} `}
                    secondary={workspaceRole}
                    classes={{
                      primary: classes.listItemText,
                      secondary: classes.listItemText
                    }}
                  />
                  {errorMessage && (
                    <ListItemText
                      primary={errorMessage}
                      primaryTypographyProps={{
                        color: "error",
                      }}
                      classes={{
                        primary: classes.listItemText,
                        secondary: classes.listItemText
                      }}
                    />
                  )}
                  {isMember && (
                    <ListItemSecondaryAction>
                      <Button
                        color="secondary"
                        variant="contained"
                        onClick={() => handleLeaveWorkspace(workspaceId)}
                      >
                        Leave
                      </Button>
                    </ListItemSecondaryAction>
                  )}
                  {isOwner && (
                    <ListItemSecondaryAction>
                      <Button
                        color="secondary"
                        variant="contained"
                        onClick={() => handleDeleteWorkspace(workspaceId)}
                      >
                        Delete
                      </Button>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              )
            );
          })}
        </List>
      ) : (
          <Typography>You are not a member of any workspaces yet.</Typography>
        )}
    </>
  );
};

const mapStateToProps = (state) => {
  const {
    firebase: {
      auth: { uid },
    },
    firestore: {
      errors: { byQuery },
      data: { userWorkspaces }
    },
  } = state;

  const workspaces = userWorkspaces && userWorkspaces[uid]?.workspaces;

  return {
    workspaces,
    workspaceErrors: byQuery,
    uid
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    leaveWorkspace: ({ uid, workspaceId }) =>
      dispatch(leaveWorkspace({ uid, workspaceId })),
    deleteWorkspace: ({ uid, email, workspaceId }) =>
      dispatch(deleteWorkspace({ uid, email, workspaceId })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Workspaces);
