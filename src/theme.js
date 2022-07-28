import { createTheme } from "@mui/material/styles";
import { green, purple, teal } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: teal[500],
    },
    secondary: {
      main: purple[500],
    },
  },
});

export default theme;
