import React, { useState } from "react";
import { connect } from "react-redux";
import {
  createWorkspace
} from "../../store/actions/workspaceActions";
import { Paper, Typography, TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ButtonLoadingSpinner, ButtonBox } from "../";
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
}));

const CreateWorkspace = ({
  isCreatingWorkspace,
  createWorkspaceError,
  createWorkspace,
  email,
  uid
}) => {
  const classes = useStyles();
  const history = useHistory();

  const [formInput, setFormInput] = useState({});

  const handleChange = (id, value) => {
    setFormInput((currentState) =>
      Object.assign(currentState, {
        [id]: value,
      })
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const workspaceName = formInput?.workspace;
    createWorkspace({ workspaceName, email, uid }).then(() => {
      history.push(`/dashboard/project`);
    })
  };

  return (
    <Paper className={classes.paper} variant="outlined">
      <Typography component="h1" variant="h6" gutterBottom>
        Create a new workspace
      </Typography>
      <form onSubmit={handleSubmit} className={classes.root}>
        <TextField
          id="workspace"
          label="Workspace name"
          required
          type="text"
          autoComplete="workspace"
          onChange={({ target: { id, value } }) =>
            handleChange(id, value)
          }
          fullWidth
          inputProps={{ maxLength: "50" }}
          variant="outlined"
          margin="dense"
        />
        <ButtonBox>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={isCreatingWorkspace}
          >
            Create
          </Button>
          {isCreatingWorkspace && <ButtonLoadingSpinner />}
        </ButtonBox>

        {createWorkspaceError ? (
          <Typography color="error">{createWorkspaceError}</Typography>
        ) : null}
      </form>
    </Paper>
  );
};

const mapStateToProps = (state) => {
  const {
    workspace: { isCreatingWorkspace, createWorkspaceError },
    firebase: {
      auth: { uid, email }
    },
  } = state;

  return {
    isCreatingWorkspace,
    createWorkspaceError,
    uid,
    email
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createWorkspace: ({ workspaceName, email, uid }) => dispatch(createWorkspace({ workspaceName, email, uid })),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CreateWorkspace);
