import React, { useState } from "react";
import { connect } from "react-redux";
import {
  createWorkspace
} from "../../actions/workspaceActions";
import { Typography, TextField, Button } from "@material-ui/core";
import { ButtonBox } from "../button-box";
import { ButtonLoadingSpinner } from "../button-loading-spinner"

const CreateWorkspace = ({
  isCreatingWorkspace,
  createWorkspaceError,
  createWorkspace,
  email,
  uid
}) => {

  const [formInput, setFormInput] = useState({ workspace: '' });

  const handleChange = (e) => {
    const id = e?.target?.id;
    const value = e?.target?.value;
    setFormInput((prevState) => ({ ...prevState, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const workspaceName = formInput?.workspace;
    createWorkspace({ workspaceName, email, uid }).then(() => setFormInput({ workspace: '' }))
  };

  return (
    <>
      <Typography component="h1" variant="h6" gutterBottom>
        Create a new workspace
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          id="workspace"
          label="Workspace name"
          required
          type="text"
          autoComplete="workspace"
          onChange={handleChange}
          fullWidth
          inputProps={{ maxLength: "50" }}
          variant="outlined"
          margin="dense"
          value={formInput.workspace}
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
    </>
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
