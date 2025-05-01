"use client";

import { createTheme } from "@mui/material/styles";

// Airbnb-inspired colors
const theme = createTheme({
  palette: {
    primary: {
      main: "#FF5A5F", // Airbnb red
      light: "#FF7B82",
      dark: "#E74A50",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#00A699", // Airbnb teal
      light: "#00C2B2",
      dark: "#008C82",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F7F7F7",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#222222",
      secondary: "#717171",
    },
    error: {
      main: "#D93900",
    },
    warning: {
      main: "#FFBD38",
    },
    info: {
      main: "#428BFF",
    },
    success: {
      main: "#00A699",
    },
  },
  typography: {
    fontFamily: [
      "Circular",
      "-apple-system",
      "BlinkMacSystemFont",
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    h4: {
      fontWeight: 500,
      fontSize: "1.25rem",
    },
    h5: {
      fontWeight: 500,
      fontSize: "1rem",
    },
    h6: {
      fontWeight: 500,
      fontSize: "0.875rem",
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        containedPrimary: {
          "&:hover": {
            backgroundColor: "#E74A50",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.08)",
          overflow: "hidden",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export default theme;
