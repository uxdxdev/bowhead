import React from "react";
import { NavLink } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
} from "@material-ui/core";

import {
  ExpandMore as IconExpandMore,
  ExpandLess as IconExpandLess,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  listItem: {
    color: theme.palette.text.primary,
  },
  listItemText: {
    fontWeight: theme.typography.h6.fontWeight,
  },
  listItemIcon: {
    minWidth: theme.spacing(4),
  },
}));

const SidebarMenuItem = (props) => {
  const {
    text,
    path,
    menuIcon,
    items = [],
    onClick,
    handleDrawerToggle,
    setActiveMenuItem,
    activeMenuItem,
    isDefaultOpen
  } = props;
  const classes = useStyles();
  const isExpandable = items && items.length > 0;
  const [open, setOpen] = React.useState(isDefaultOpen);

  function handleClick() {
    if (!isExpandable) {
      handleDrawerToggle();
      setActiveMenuItem(text);
      onClick && onClick()
    } else {
      setOpen(!open);
    }
  }

  const Icon = menuIcon && menuIcon;

  const MenuItemRoot = (
    <>
      <ListItem
        key={path}
        button
        component={path ? NavLink : null}
        to={path ? path : null}
        className={classes.listItem}
        style={{
          backgroundColor: activeMenuItem === text && "rgba(0, 0, 0, 0.04)",
        }}
        underline="none"
        onClick={handleClick}
      >
        <ListItemIcon className={classes.listItemIcon}>
          {Icon ? <Icon /> : null}
        </ListItemIcon>
        <ListItemText className={classes.listItemText}>{text}</ListItemText>
        {/* Display the expand menu if the item has children */}
        {isExpandable && !open && <IconExpandMore />}
        {isExpandable && open && <IconExpandLess />}
      </ListItem>
    </>
  );

  const MenuItemChildren = isExpandable ? (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        {items.map((item, index) => (
          <SidebarMenuItem {...item}
            key={index}
            activeMenuItem={activeMenuItem}
            setActiveMenuItem={setActiveMenuItem}
            handleDrawerToggle={handleDrawerToggle}
          />
        ))}
      </List>
    </Collapse>
  ) : null;

  return (
    <>
      {MenuItemRoot}
      {MenuItemChildren}
    </>
  );
};

export default SidebarMenuItem;
