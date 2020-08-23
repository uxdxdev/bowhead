import React, { useState } from "react";
import { connect } from "react-redux";
import { authenticateWithEmailLink } from "../../store/actions/authActions";
import { Redirect } from "react-router-dom";
import {
  Button,
  Grid,
  Container,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ButtonLoadingSpinner, ButtonBox, CheckEmail } from "../../components";
import { AUTH_TYPE } from "../../../utils/constants";

const useStyles = makeStyles((theme) => ({
  section: {
    margin: theme.spacing(10, 0, 10),
    justifyContent: "center",
  },
}));

const Signin = ({
  sendEmailAuthError,
  authenticateWithEmailLink,
  isSendingEmailLink,
  isEmailLinkSent,
  firebaseAuth: { uid },
}) => {
  const [formInput, setFormInput] = useState({});

  const classes = useStyles();

  if (uid) return <Redirect to="/dashboard" />;

  const handleChange = (id, value) => {
    setFormInput((currentState) =>
      Object.assign(currentState, {
        [id]: value,
      })
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = formInput?.email;
    if (!isSendingEmailLink && email) {
      authenticateWithEmailLink({ email });
    }
  };

  return (
    <Container component="main">
      <Grid container component="section" className={classes.section}>
        <Grid item xs={12} sm={6}>
          {isEmailLinkSent ? (
            <CheckEmail />
          ) : (
              <form onSubmit={handleSubmit} autoComplete="on">
                <Typography component="h1" variant="h1" gutterBottom>
                  Sign In
              </Typography>
                <Typography>
                  Enter the email associated with your account. Clicking the link
                  we send to your inbox will sign you in.
              </Typography>
                <TextField
                  id="email"
                  label="Email"
                  required
                  type="email"
                  autoComplete="email"
                  onChange={({ target: { id, value } }) =>
                    handleChange(id, value)
                  }
                  fullWidth
                  inputProps={{ maxLength: "50" }}
                  variant="outlined"
                  margin="dense"
                />

                <ButtonBox mb={2}>
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    disabled={isSendingEmailLink}
                  >
                    Sign In
                </Button>
                  {isSendingEmailLink && <ButtonLoadingSpinner />}
                </ButtonBox>

                {sendEmailAuthError ? (
                  <Typography color="error">
                    There was error signing you in. Please try again.
                  </Typography>
                ) : null}
              </form>
            )}
        </Grid>
      </Grid>
    </Container>
  );
};

const mapStateToProps = (state) => {
  const { auth, firebase: { auth: firebaseAuth } } = state;
  const { sendEmailAuthError, isSendingEmailLink, isEmailLinkSent } = auth;
  return {
    firebaseAuth,
    sendEmailAuthError,
    isSendingEmailLink,
    isEmailLinkSent,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    authenticateWithEmailLink: ({ email }) =>
      dispatch(authenticateWithEmailLink({ email, ref: AUTH_TYPE.SIGN_IN })),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Signin);
