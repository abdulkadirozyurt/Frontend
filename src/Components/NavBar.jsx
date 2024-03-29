import { NavLink } from "react-router-dom";
import React from "react";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

function NavList() {
  return (
    <List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1">
      <Typography
        as="a"
        href="#"
        variant="small"
        color="blue-gray"
        className="font-medium"
      >
        <NavLink to="/home">
          <ListItem className="flex items-center gap-2 py-2 pr-4">
            Home
          </ListItem>
        </NavLink>
      </Typography>

      <Typography
        as="a"
        href="#"
        variant="small"
        color="blue-gray"
        className="font-medium"
      >
        <NavLink to="/home">
          <ListItem className="flex items-center gap-2 py-2 pr-4">
            Contact Us
          </ListItem>
        </NavLink>
      </Typography>
    </List>
  );
}

export function NavBar() {
  const [openNav, setOpenNav] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  return (
    <Navbar className="mx-auto max-w-screen-xl px-4 py-2">
      <div className="flex items-center justify-between text-blue-gray-900">
        <Typography
          as="a"
          href="#"
          variant="h6"
          className="mr-4 cursor-pointer py-1.5 lg:ml-2"
        >
          ATS
        </Typography>
        <div className="hidden lg:block">
          <NavList />
        </div>
        <div className="hidden gap-2 lg:flex">
          <NavLink to="/login">
            <Button variant="text" size="sm" color="blue-gray">
              Log In
            </Button>
          </NavLink>
          <NavLink to="/register">
            <Button variant="gradient" size="sm">
              Sign Up
            </Button>
          </NavLink>
        </div>
        <IconButton
          variant="text"
          color="blue-gray"
          className="lg:hidden"
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon className="h-6 w-6" strokeWidth={2} />
          ) : (
            <Bars3Icon className="h-6 w-6" strokeWidth={2} />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <NavList />
        <div className="flex w-full flex-nowrap items-center gap-2 lg:hidden">
          <NavLink to="/login">
            <Button variant="outlined" size="sm" color="blue-gray" fullWidth>
              Log In
            </Button>
          </NavLink>
          <NavLink to="/register">
            <Button variant="gradient" size="sm" fullWidth>
              Sign Up
            </Button>
          </NavLink>
        </div>
      </Collapse>
    </Navbar>
  );
}
export default NavBar;
