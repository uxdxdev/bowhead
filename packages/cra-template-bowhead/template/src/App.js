import React, { useMemo } from "react";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { useMediaQuery, CssBaseline } from "@material-ui/core";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { AuthenticatedRoute, AuthIsLoaded } from "./components";
import { LandingPage, SignIn, Verify, Dashboard, Terms } from "./pages";
import { StoreProvider } from './store'

const App = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createMuiTheme({
        typography: {
          fontFamily: ["Inter", "-apple-system"].join(","),
          h1: {
            fontWeight: 700,
            fontSize: "64px",
          },
          subtitle1: {
            fontWeight: 500,
            fontSize: "32px",
          },
          h2: {
            fontWeight: 600,
            fontSize: "40px",
          },
          subtitle2: {
            fontWeight: 400,
            fontSize: "24px",
          },
          h3: {
            fontWeight: 600,
            fontSize: "32px",
          },
          h4: {
            fontWeight: 600,
            fontSize: "28px",
          },
          h5: {
            fontWeight: 600,
            fontSize: "24px",
          },
          h6: {
            fontWeight: 600,
            fontSize: "20px",
          },
          body1: {
            fontWeight: 400,
            fontSize: "14px",
          },
          body2: {
            fontWeight: 400,
            fontSize: "18px",
          },
        },
        palette: {
          type: prefersDarkMode ? "dark" : "light",
          primary: { main: "#00B0FF" },
          secondary: { main: "#F50057" },
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <StoreProvider>
        <AuthIsLoaded>
          <CssBaseline />
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={LandingPage} />
              <Route path="/terms" component={Terms} />
              <Route path="/signin" component={SignIn} />
              <Route path="/verify" component={Verify} />
              <AuthenticatedRoute path="/dashboard" component={Dashboard} />
            </Switch>
          </BrowserRouter>
        </AuthIsLoaded>
      </StoreProvider>
    </ThemeProvider>
  );
};

export default App;
