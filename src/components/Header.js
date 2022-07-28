import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import HeadphonesTwoToneIcon from "@mui/icons-material/HeadphonesTwoTone";
import { teal, purple, blue, red } from "@mui/material/colors";

const Header = () => {
  return (
    <AppBar
      color="primary"
      position="fixed"
      sx={{ backgroundColor: teal[500] }}
    >
      <Toolbar>
        <HeadphonesTwoToneIcon />
        <Typography sx={{ m: 2 }} variant="h6" component="h1">
          vladsh Music Share
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
