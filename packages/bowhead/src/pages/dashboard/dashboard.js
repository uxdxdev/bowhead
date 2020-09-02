import React, { useState } from "react";
import { Switch, Route, Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Breadcrumbs, Typography, Link, Container } from "@material-ui/core";
import { useDashboard } from './hooks'
import { DashboardNavSidebar, DashboardNavBar, Pricing, Account, PageLoadingSpinner } from '../../components'
import { PLUGIN_TYPES } from '../../utils/pluginTypes'
import { pluginRegistry } from "../../registry/plugin-registry";

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
const createLinkText = (to) => {
  const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  const paths = to?.split("/").filter((x) => x);
  const end = paths[paths.length - 1];
  return capitalize(end)
};

const Dashboard = (props) => {
  const { match, children } = props;
  const {
    isSubscribed,
    isLoading,
  } = useDashboard();

  const classes = useStyles();

  // sidebar
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (isLoading) {
    return <PageLoadingSpinner />
  }

  const popoverMenuItems = pluginRegistry.getPluginsByType(PLUGIN_TYPES.MENU_ITEM.POP_OVER)
  const sidebarMenuItems = pluginRegistry.getPluginsByType(PLUGIN_TYPES.MENU_ITEM.SIDEBAR)

  return (
    <>
      <DashboardNavBar
        handleDrawerToggle={handleDrawerToggle}
        popoverMenuItems={popoverMenuItems}
      />
      {isSubscribed &&
        <DashboardNavSidebar
          sidebarMenuItems={sidebarMenuItems}
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
                  const linkText = createLinkText(to)

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
            {isSubscribed ?
              children :
              <Route exact path={`${match.path}/`} component={Pricing} />
            }
            <Route exact path={`${match.path}/account`} component={Account} />
          </>
        </Switch>
      </Container>

    </>
  );
};

export default Dashboard;
