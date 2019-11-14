import { createMuiTheme } from "@material-ui/core";

// NOTE: https://material.io/resources/color
// NOTE: https://material-ui.com/customization/default-theme/?expend-path=$.palette
// NOTE: https://blog.bitsrc.io/how-to-customize-material-ui-theme-v3-2-0-part-3-750db6981a33

export const theme = createMuiTheme({
  typography: {
    fontFamily: ['"Coda"'].join(",")
  },
  shape: {
    borderRadius: 8
  },
  palette: {
    // type: "dark",
    primary: {
      main: "#ea445c",
      light: "#ff7989",
      dark: "#b20033",
      contrastText: "#fff"
    }
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        body: {
          backgroundImage: "unset",
          backgroundColor: "#eedddd"
        }
      }
    },
    MuiList: {
      root: {
        background: "#fff"
      }
    }
  }
});
