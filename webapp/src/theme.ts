import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(",")
  },
  palette: {
    text: {
      primary: "#484848"
    },
    primary: {
      main: "#31cfda"
    },
    secondary: {
      main: "#317bda",
      contrastText: "#fff"
    }
  },
  overrides: {
    MuiList: {
      root: {
        background: "#fff"
      }
    }
  }
});
