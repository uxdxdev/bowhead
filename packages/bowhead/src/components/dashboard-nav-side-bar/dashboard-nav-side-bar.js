import React, { useState } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Hidden, Drawer } from "@material-ui/core";
import {
  Dashboard as DashboardIcon,
  AccountTree as AccountTreeIcon,
  DoubleArrow as DoubleArrowIcon,
} from "@material-ui/icons";
import { SidebarMenuItem } from "../sidebar-menu-item";
import { setActiveWorkspace } from "../../actions/workspaceActions";

// sidebar
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.palette.background.default,
    borderRight: "none",
    '& .MuiCollapse-entered': {
      overflow: 'auto'
    },
  }
}));

const DashboardNavSidebar = ({
  workspaces,
  setActiveWorkspace,
  activeWorkspaceId,
  handleDrawerToggle,
  mobileOpen,
  sidebarMenuItems
}) => {
  const classes = useStyles();

  // currently selected menu item 
  const [activeMenuItem, setActiveMenuItem] = useState('initialState')

  // workspaces
  const workspacesArray = workspaces && Object.keys(workspaces);
  const workspacesCollection = workspacesArray?.filter((workspaceId) => workspaces[workspaceId]?.name && workspaceId)
    .map((workspaceId) => {
      const workspaceName = workspaces[workspaceId]?.name;
      return {
        menuIcon: activeWorkspaceId === workspaceId && DoubleArrowIcon,
        text: workspaceName,
        path: '/dashboard/project',
        onClick: () => {
          setActiveWorkspace(workspaceId);
        },
      };
    });

  // sidebar menu items
  const plugins = [
    {
      menuIcon: DashboardIcon,
      text: "Dashboard",
      path: "/dashboard",
    },
    ...sidebarMenuItems,
    {
      menuIcon: AccountTreeIcon,
      text: "Workspaces",
      items: workspacesCollection,
    },
  ];

  const drawer = () => {
    return plugins.map(
      (menuItem, index) =>
        menuItem && <SidebarMenuItem
          key={index}
          {...menuItem}
          activeMenuItem={activeMenuItem}
          setActiveMenuItem={setActiveMenuItem}
          handleDrawerToggle={handleDrawerToggle}
        />
    );
  };

  return (
    <>
      <Hidden mdUp>
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer()}
        </Drawer>
      </Hidden>
      <Hidden smDown>
        <Drawer
          classes={{
            paper: classes.drawerPaper
          }}
          variant="permanent"
          open
        >
          <div className={classes.toolbar} />
          {drawer()}
        </Drawer>
      </Hidden>
    </>
  );
};

const mapStateToProps = (state) => {
  const {
    firebase: {
      profile: { workspaces },
    },
    workspace: { activeWorkspaceId },
  } = state;

  return {
    workspaces,
    activeWorkspaceId
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveWorkspace: (workspaceId) =>
      dispatch(setActiveWorkspace(workspaceId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardNavSidebar);
