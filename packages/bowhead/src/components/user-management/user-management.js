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
  sendSignInEmailLink,
  resetSendEmailLink,
} from "../../actions/authActions";
import {
  removeMember,
} from "../../actions/workspaceActions";
import { ButtonLoadingSpinner } from "../button-loading-spinner";
import { ButtonBox } from "../button-box";
import * as constants from "../../utils/constants";

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
  sendSignInEmailLink,
  resetSendEmailLink,
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
      sendSignInEmailLink({
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

  const handleRemoveMember = ({ uid }) => {
    removeMember({ uid, workspaceId: activeWorkspaceId });
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
          Object.keys(members).map((uid) => {
            const role = members[uid].role;
            const email = members[uid].email;
            const isOwner = role === constants.USER_ROLES.OWNER;
            return (
              <ListItem key={uid} classes={{
                secondaryAction: classes.listItemSecondary,
              }} >
                <ListItemText
                  primary={`${email} `}
                  secondary={`${role}`}
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
                      onClick={() => !isOwner && handleRemoveMember({ uid })}
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
    },
    workspace: { activeWorkspaceId },
    firebase: {
      auth: {
        email
      }
    },
    firestore: {
      data: { workspaces },
    },
  } = state;

  const activeWorkspace = workspaces && workspaces[activeWorkspaceId];
  return {
    sendEmailAuthError,
    isSendingEmailLink,
    isEmailLinkSent,
    email,
    activeWorkspaceId,
    members: activeWorkspace?.members,
    workspaceName: activeWorkspace?.name,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendSignInEmailLink: ({ email, data }) =>
      dispatch(sendSignInEmailLink({ email, ref: constants.AUTH_TYPE.INVITE, data })),
    resetSendEmailLink: () => dispatch(resetSendEmailLink()),
    removeMember: ({ workspaceId, uid }) =>
      dispatch(removeMember({ workspaceId, uid })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManagement);
