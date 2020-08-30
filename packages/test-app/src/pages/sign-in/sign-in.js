import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import {
  Button,
  Grid,
  Container,
  TextField,
  Typography,
} from "@material-ui/core";
import { ButtonLoadingSpinner, ButtonBox, CheckEmail } from "../../components";
import { useSignIn } from './hooks'
import { useStyles } from './sign-in-styles'

const SignIn = () => {
  const {
    sendEmailAuthError,
    handleAuthenticateWithEmailLink,
    isSendingEmailLink,
    isEmailLinkSent,
    uid,
  } = useSignIn();
  const [formInput, setFormInput] = useState({});

  const { section } = useStyles();

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
      handleAuthenticateWithEmailLink({ email });
    }
  };

  return (
    <Container component="main">
      <Grid container component="section" className={section}>
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


export default SignIn;
