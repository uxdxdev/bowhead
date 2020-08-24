import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import {
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  authenticateWithEmailLink,
  resetSendEmailLink,
  removeMember,
} from "../../store/actions/authActions";

import { ButtonLoadingSpinner, ButtonBox } from "../";
import { AUTH_TYPE, USER_ROLES } from "../../utils/constants";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  button: {
    marginRight: theme.spacing(1),
  },
  listItemText: {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  listItemSecondary: {
    paddingRight: theme.spacing(16),
  }
}));

const UserManagement = ({
  sendEmailAuthError,
  isSendingEmailLink,
  isEmailLinkSent,
  authenticateWithEmailLink,
  resetSendEmailLink,
  uid,
  email,
  activeWorkspaceId,
  members,
  removeMember,
  workspaceName,
}) => {
  const classes = useStyles();

  const [emailInput, setEmailInput] = useState("");

  const handleChange = (value) => {
    setEmailInput(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isSendingEmailLink && emailInput) {
      authenticateWithEmailLink({
        email: emailInput,
        data: {
          workspaceId: activeWorkspaceId,
          workspaceName
        }
      });
    }
  };

  // reset email input when link is sent
  // this will allow the user to enter a new email without
  // having to delete the old one.
  useEffect(() => {
    if (isEmailLinkSent) {
      setEmailInput("");
    }
  }, [isEmailLinkSent]);

  // reset the send email link statuses when
  // the user navigates away from the user management page
  useEffect(() => {
    return () => {
      resetSendEmailLink();
    };
  }, [resetSendEmailLink]);

  const handleRemoveMember = (member) => {
    removeMember({ uid, workspaceId: activeWorkspaceId, email: member });
  };

  return (
    <>
      <Typography component="h2" variant="h6">
        Members ({workspaceName})
      </Typography>
      <Typography>
        Add teammates to {workspaceName} by sending them an invite email.
      </Typography>
      <form onSubmit={handleSubmit} autoComplete="on">
        <TextField
          id="inviteEmailInput"
          label="Email"
          required
          type="email"
          autoComplete="email"
          onChange={({ target: { value } }) => handleChange(value)}
          // fullWidth
          inputProps={{ maxLength: "100", size: 50 }}
          value={emailInput}
          variant="outlined"
          margin="dense"
        />
        <ButtonBox>
          <Button
            color="primary"
            variant="contained"
            className={classes.button}
            type="submit"
            // disable if sending link or user enters own email
            disabled={isSendingEmailLink || emailInput === email}
          >
            Invite
          </Button>
          {isSendingEmailLink && <ButtonLoadingSpinner />}
          {isEmailLinkSent && (
            <Typography color="secondary">Email link sent</Typography>
          )}
        </ButtonBox>

        {sendEmailAuthError && (
          <ButtonBox>
            <Typography color="error">{sendEmailAuthError.message}</Typography>
          </ButtonBox>
        )}
      </form>

      <List dense>
        {members &&
          Object.keys(members).map((member) => {
            const role = members[member];
            const isOwner = role === USER_ROLES.OWNER;
            return (
              <ListItem key={member} classes={{
                secondaryAction: classes.listItemSecondary,
              }} >
                <ListItemText
                  primary={`${member} `}
                  secondary={`${members[member]}`}
                  classes={{
                    primary: classes.listItemText,
                    secondary: classes.listItemText
                  }}
                />
                {!isOwner && (
                  <ListItemSecondaryAction>
                    <Button
                      color="secondary"
                      variant="contained"
                      onClick={() => !isOwner && handleRemoveMember(member)}
                    >
                      Remove
                    </Button>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            );
          })}
      </List>
    </>
  );
};

const mapStateToProps = (state) => {
  const {
    auth: {
      sendEmailAuthError,
      isSendingEmailLink,
      isEmailLinkSent,
      activeWorkspaceId,
    },
    firebase: {
      auth: {
        uid,
        email
      }
    },
    firestore: {
      data: { workspaces: firestoreWorkspaces },
    },
  } = state;

  const firestoreWorkspace =
    firestoreWorkspaces && firestoreWorkspaces[activeWorkspaceId];

  return {
    uid,
    sendEmailAuthError,
    isSendingEmailLink,
    isEmailLinkSent,
    email,
    activeWorkspaceId,
    members: firestoreWorkspace?.members,
    workspaceName: firestoreWorkspace?.name,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    authenticateWithEmailLink: ({ email, data }) =>
      dispatch(authenticateWithEmailLink({ email, ref: AUTH_TYPE.INVITE, data })),
    resetSendEmailLink: () => dispatch(resetSendEmailLink()),
    removeMember: (activeWorkspaceId, member) =>
      dispatch(removeMember(activeWorkspaceId, member)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManagement);
