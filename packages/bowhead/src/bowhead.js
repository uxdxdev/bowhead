import React, { useMemo } from "react";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { useMediaQuery, CssBaseline } from "@material-ui/core";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { AuthenticatedRoute, AuthIsLoaded } from "./components";
import { SignIn, Verify, Dashboard, LandingPage } from "./pages";
import { StoreProvider } from './store'

const Bowhead = ({ theme, config }) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const defaultTheme = useMemo(
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

  const routes = ({ config, authConfig }) => {
    return config && config.map((route, index) => {
      const path = route?.path;
      const exactPath = route?.exact || authConfig;
      const component = route?.component;

      const isValid = path && component;
      if (!isValid) {
        console.warn('Please provide path and component in routes configuration.')
        return null
      }

      const updatedPath = authConfig ? `/dashboard${path}` : path;

      return (
        <Route
          key={index}
          {...(exactPath && { exact: exactPath })}
          path={updatedPath}
          component={component} />
      )
    })
  }

  const AuthedDashboard = (props) => {
    return (
      <Dashboard {...props}>
        {routes({ config: config?.dashboardRoutesConfig, authConfig: true }) || null}
      </Dashboard>)
  }

  const UpdatedLandingPage = () => {
    const Component = config?.landingPage
    return (
      <LandingPage>
        {Component && <Component /> || null}
      </LandingPage>
    )
  }

  return (
    <ThemeProvider theme={theme || defaultTheme}>
      <StoreProvider reducers={config?.reducers}>
        <AuthIsLoaded>
          <CssBaseline />
          <BrowserRouter>
            <Switch>
              <Route exact path='/' component={UpdatedLandingPage} />
              {routes({ config: config?.unauthRoutesConfig })}
              <Route path="/signin" component={SignIn} />
              <Route path="/verify" component={Verify} />
              <AuthenticatedRoute path="/dashboard" component={AuthedDashboard} />
            </Switch>
          </BrowserRouter>
        </AuthIsLoaded>
      </StoreProvider>
    </ThemeProvider>
  );
};

export default Bowhead;
