import React, { useState } from "react";
import { Switch, Route, Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Breadcrumbs, Typography, Link, Container } from "@material-ui/core";
import { useDashboard } from './hooks'
import { DashboardNavSidebar, DashboardNavBar, DashboardRoot, Projects, ProjectDetails, Account, PageLoadingSpinner } from '../../components'

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  sidebar: {
    flex: 1,
    [theme.breakpoints.up("md")]: {
      flexShrink: 0,
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      maxWidth: "100%",
    },
  },
  toolbar: theme.mixins.toolbar,
  breadcrumbs: {
    margin: theme.spacing(2, 0, 2, 0),
  },
}));

const LinkRouter = (props) => <Link {...props} component={RouterLink} />;
const breadcrumbNameMap = (to) => {
  const map = {
    "/dashboard": "Dashboard",
    "/dashboard/account": "Account",
    "/dashboard/project": "Projects"
  };
  //
  const value = to?.split("/").filter((x) => x)[2];
  // add the project id to the end of the breachcrumb
  // map[`/dashboard/project/${value}`] = value;
  // add "Details" to the end of the breadcrumb for all projects
  map[`/dashboard/project/${value}`] = "Details";
  return map[to];
};

const Dashboard = (props) => {
  const { match } = props;
  const {
    workspaces,
    isSubscribed,
    isLoading,
  } = useDashboard();

  const classes = useStyles();

  // sidebar
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const workspacesExist = workspaces && Object.keys(workspaces)?.length > 0

  if (isLoading) {
    return <PageLoadingSpinner />
  }

  return (
    <>
      <DashboardNavBar handleDrawerToggle={handleDrawerToggle} />
      {isSubscribed &&
        <DashboardNavSidebar
          handleDrawerToggle={handleDrawerToggle}
          mobileOpen={mobileOpen}
        />}
      <div className={classes.toolbar} />

      <Container component="main"
        // only add sidebar styling if user is subscribed
        {...(isSubscribed && { className: classes.sidebar })}
      >
        {/* breadcrumbs */}
        <Route>
          {({ location }) => {
            const pathnames = location.pathname.split("/").filter((x) => x);

            return (
              <Breadcrumbs
                aria-label="breadcrumb"
                className={classes.breadcrumbs}
              >
                {pathnames.map((value, index) => {
                  const last = index === pathnames.length - 1;
                  const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                  const linkText = breadcrumbNameMap(to);

                  return last ? (
                    <Typography color="textPrimary" key={to}>
                      {linkText}
                    </Typography>
                  ) : (
                      <LinkRouter color="inherit" to={to} key={to}>
                        {linkText}
                      </LinkRouter>
                    );
                })}
              </Breadcrumbs>
            );
          }}
        </Route>

        <Switch>
          <>
            <Route exact path={`${match.path}/`} component={DashboardRoot} />
            <Route exact path={`${match.path}/account`} component={Account} />
            {workspacesExist && <>
              <Route
                exact
                path={`${match.path}/project`}
                component={Projects}
              />
              <Route
                exact
                path={`${match.path}/project/:id`}
                component={ProjectDetails}
              />
            </>}
          </>
        </Switch>
      </Container>

    </>
  );
};

export default Dashboard;
