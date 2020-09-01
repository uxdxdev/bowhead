import React, { useState } from "react";
import { connect } from "react-redux";
import {
  createProject,
  resetCreateProjectState,
} from "../../actions/projectActions";
import { Paper, Typography, TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ButtonLoadingSpinner } from "../button-loading-spinner";
import { ButtonBox } from '../button-box'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
}));

const CreateProject = ({
  createProject,
  isCreatingProject,
  createProjectError,
  activeWorkspaceId,
}) => {
  const classes = useStyles();

  const [formInput, setFormInput] = useState({ title: '', summary: '' });



  const handleChange = (e) => {
    const id = e?.target?.id;
    const value = e?.target?.value;
    setFormInput((prevState) => ({ ...prevState, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // reset error message if user resubmits
    createProjectError && resetCreateProjectState();

    const { title, summary } = formInput;
    const project = {
      workspaceId: activeWorkspaceId,
      title,
      summary,
    };
    if (!isCreatingProject) {
      createProject(project);
      setFormInput({ title: '', summary: '' })
    }
  };

  return (
    <Paper className={classes.paper} variant="outlined">
      <Typography component="h1" variant="h6" gutterBottom>
        Create a new project
      </Typography>
      <form onSubmit={handleSubmit} className={classes.root}>
        <TextField
          id="title"
          label="Title"
          required
          type="text"
          // fullWidth
          onChange={handleChange}
          inputProps={{ maxLength: "500", size: 50 }}
          variant="outlined"
          margin="dense"
          value={formInput.title}
        />

        <TextField
          id="summary"
          label="Summary"
          required
          multiline
          type="text"
          rows={5}
          fullWidth
          onChange={handleChange}
          inputProps={{ maxLength: "5000" }}
          variant="outlined"
          margin="dense"
          value={formInput.summary}
        />

        <ButtonBox>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={isCreatingProject}
          >
            Create
          </Button>
          {isCreatingProject && <ButtonLoadingSpinner />}
        </ButtonBox>

        {createProjectError ? (
          <Typography color="error">{createProjectError}</Typography>
        ) : null}
      </form>
    </Paper>
  );
};

const mapStateToProps = (state) => {
  const {
    firebase: {
      auth: { uid },
    },
    project: { isCreatingProject, createProjectError },
    workspace: { activeWorkspaceId },
  } = state;

  return {
    activeWorkspaceId,
    isCreatingProject,
    uid,
    createProjectError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createProject: (project) => dispatch(createProject(project)),
    resetCreateProjectState: () => dispatch(resetCreateProjectState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateProject);
