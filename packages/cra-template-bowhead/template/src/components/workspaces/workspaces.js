import React from "react";
import { connect } from "react-redux";
import { USER_ROLES } from '../../utils/constants'
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { leaveWorkspace, deleteWorkspace } from "../../store/actions/workspaceActions";

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
  const { firestoreWorkspaces, profileWorkspaces, leaveWorkspace, deleteWorkspace, uid, workspaceErrors } = props;

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

  const isMemberOfWorkspaces = profileWorkspaces && Object.keys(profileWorkspaces).length > 0;

  return (
    <>
      <Typography component="h2" variant="h6">
        Workspaces
      </Typography>
      {isMemberOfWorkspaces ? (
        <List dense>
          {Object.keys(profileWorkspaces).map((workspaceId) => {

            const workspaceRole = profileWorkspaces[workspaceId]?.role;
            const isMember = workspaceRole === USER_ROLES.MEMBER;
            const isOwner = workspaceRole === USER_ROLES.OWNER;
            const workspacePermissionDenied = workspaceErrors[`workspaces/${workspaceId}`]?.code === "permission-denied";
            const workspaceDeleted = firestoreWorkspaces && firestoreWorkspaces[workspaceId] === null;
            const errorMessage = (workspacePermissionDenied || workspaceDeleted) ? "Permission Denied" : null;
            const workspaceName = profileWorkspaces[workspaceId]?.name;
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
      profile: { workspaces: profileWorkspaces },
    },
    firestore
  } = state;

  const {
    errors: { byQuery },
    data: { workspaces: firestoreWorkspaces }
  } = firestore;

  return {
    firestoreWorkspaces,
    profileWorkspaces,
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
