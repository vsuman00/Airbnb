"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DateRange, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
import {
  AppBar,
  Toolbar,
  InputBase,
  Box,
  IconButton,
  Button,
  Typography,
  Avatar,
  MenuItem,
  Menu,
  Paper,
  Divider,
  Slider,
  Stack,
} from "@mui/material";
import {
  Search as SearchIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  placeholder?: string;
}

// Styled components
const SearchBar = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  border: "1px solid #ebebeb",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.primary.main,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const DateRangeWrapper = styled(Paper)(({ theme }) => ({
  position: "absolute",
  zIndex: 1,
  marginTop: theme.spacing(1),
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  width: "100%",
  [theme.breakpoints.up("md")]: {
    width: "auto",
  },
}));

const Header: React.FC<HeaderProps> = ({ placeholder }) => {
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuth();

  const [searchInput, setSearchInput] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [numGuests, setNumGuests] = useState(1);
  const [showSearch, setShowSearch] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleSelect = (ranges: RangeKeyDict) => {
    if (ranges.selection.startDate) {
      setStartDate(ranges.selection.startDate);
    }
    if (ranges.selection.endDate) {
      setEndDate(ranges.selection.endDate);
    }
  };

  const resetInput = () => {
    setSearchInput("");
    setShowSearch(false);
  };

  const search = () => {
    if (!searchInput) return;

    console.log("Performing search for:", searchInput);

    const params = new URLSearchParams();
    params.set("location", searchInput);
    params.set("checkin", format(startDate, "yyyy-MM-dd"));
    params.set("checkout", format(endDate, "yyyy-MM-dd"));
    params.set("guests", numGuests.toString());

    const searchUrl = `/search?${params.toString()}`;
    console.log("Navigating to:", searchUrl);

    router.push(searchUrl);
    resetInput();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const selectionRange = {
    startDate,
    endDate,
    key: "selection",
  };

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={1}
      sx={{ bgcolor: "white" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Link
          href="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box display="flex" alignItems="center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="102"
              height="32"
              style={{ display: "block", height: "32px" }}
              fill="#FF5A5F"
              viewBox="0 0 1000 1000"
            >
              <path d="M499.3 736.7c-51-64-81-120.1-91-168.1-10-39-6-70 11-93 18-27 45-40 80-40s62 13 80 40c17 23 21 54 11 93-11 49-41 105-91 168.1zm362.2 43c-7 47-39 86-83 105-85 37-169.1-22-241.1-78 51 64 81 120.1 91 168.1 10 39 6 70-11 93-18 27-45 40-80 40s-62-13-80-40c-17-23-21-54-11-93 11-49 41-105 91-168.1zm-53.9-411.4c0 31.4-16.1 72-42.4 92.6-8.4 6.5-17.9 11.1-28.1 11.1-34.2 0-57.9-29.5-57.9-65.8 0-18.7 8.3-40.4 19.2-55.7 32.5-45.5 72.3-60.5 82.1-71 14.4-15.7 21.2-32.7 21.2-50.8 0-62-61.6-117.3-130.2-117.3-87.1 0-150.8 72.1-150.8 152.7 0 39.7 14.2 77.1 42.3 108-9.5 11.1-28.2 28.7-51.3 46-39.6-38.9-94.4-53.9-131.2-53.9-62.4 0-118.9 34.4-149.8 90.9-17.5 32-21.4 71.8-11.7 105.8 16 56.9 71.1 87.4 133.3 87.4 29.9 0 65.9-8.1 95.7-22.5 29.2-14 51.7-33.7 66.9-49.2 22.6 16.7 47.5 29.9 74.2 39 13.7 4.7 27.6 8.1 41.5 10.2 31.1 4.3 64.1 0 96.1-11.8 69.3-25.4 125.4-90.1 125.4-183.9 0-34.9-11.1-76.1-28.6-103zm-349.9-47.2c0 37.9-28.3 74.3-70.1 74.3-41.9 0-70.1-36.5-70.1-74.3s28.3-74.3 70.1-74.3c41.9 0 70.1 36.5 70.1 74.3zm161.7 207.7c-69.4 0-186.7-40.2-186.7-147.1 0-107 117.3-147.2 186.7-147.2 69.4 0 186.7 40.2 186.7 147.2 0 106.9-117.3 147.1-186.7 147.1z" />
            </svg>
            <Typography
              variant="h6"
              color="primary"
              sx={{
                ml: 1,
                fontWeight: "bold",
                display: { xs: "none", sm: "block" },
              }}
            >
              airbnb
            </Typography>
          </Box>
        </Link>

        {/* Search Bar */}
        <SearchBar>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder={placeholder ?? "Start your search"}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            inputProps={{ "aria-label": "search" }}
            onFocus={() => setShowSearch(true)}
          />
          <IconButton
            color="primary"
            sx={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              display: { xs: "none", md: "flex" },
            }}
            onClick={search}
          >
            <SearchIcon />
          </IconButton>
        </SearchBar>

        {/* User Menu */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            color="inherit"
            sx={{
              display: { xs: "none", md: "block" },
              mr: 2,
            }}
          >
            Become a Host
          </Button>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #ddd",
              borderRadius: "2rem",
              padding: "5px 5px 5px 12px",
              cursor: "pointer",
            }}
            onClick={handleMenuOpen}
          >
            <MenuIcon sx={{ marginRight: 1 }} />
            <Avatar sx={{ width: 30, height: 30, backgroundColor: "#717171" }}>
              {isLoggedIn && user?.first_name ? (
                user.first_name.charAt(0).toUpperCase()
              ) : (
                <PersonIcon />
              )}
            </Avatar>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            slotProps={{
              paper: {
                elevation: 3,
                sx: { mt: 1.5, width: 220, borderRadius: 2 },
              },
            }}
          >
            {isLoggedIn
              ? // Logged-in user menu items
                [
                  <MenuItem
                    key="profile"
                    onClick={() => {
                      handleMenuClose();
                      router.push("/profile");
                    }}
                  >
                    Profile
                  </MenuItem>,
                  <MenuItem
                    key="account-settings"
                    onClick={() => {
                      handleMenuClose();
                      router.push("/account-settings");
                    }}
                  >
                    Account Settings
                  </MenuItem>,
                  <Divider key="divider-1" />,
                  <MenuItem
                    key="logout"
                    onClick={() => {
                      handleMenuClose();
                      logout();
                    }}
                  >
                    Log out
                  </MenuItem>,
                ]
              : // Non-logged-in user menu items
                [
                  <MenuItem
                    key="signup"
                    onClick={() => {
                      handleMenuClose();
                      router.push("/signup");
                    }}
                  >
                    Sign up
                  </MenuItem>,
                  <MenuItem
                    key="login"
                    onClick={() => {
                      handleMenuClose();
                      router.push("/login");
                    }}
                  >
                    Log in
                  </MenuItem>,
                  <Divider key="divider-2" />,
                ]}
            <MenuItem onClick={handleMenuClose}>Host your home</MenuItem>
            <MenuItem onClick={handleMenuClose}>Host an experience</MenuItem>
            <MenuItem onClick={handleMenuClose}>Help</MenuItem>
          </Menu>
        </Box>

        {/* Date Range Picker */}
        {showSearch && (
          <DateRangeWrapper
            elevation={3}
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              marginTop: "8px",
              zIndex: 10,
              width: { xs: "100%", md: "600px" },
              mx: "auto",
            }}
          >
            <Box display="flex" justifyContent="flex-end">
              <IconButton size="small" onClick={resetInput}>
                <CloseIcon />
              </IconButton>
            </Box>
            <DateRange
              ranges={[selectionRange]}
              minDate={new Date()}
              rangeColors={["#FF5A5F"]}
              onChange={handleSelect}
            />
            <Box sx={{ borderBottom: "1px solid #ebebeb", pb: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Number of Guests
              </Typography>
              <Box display="flex" alignItems="center">
                <GroupIcon sx={{ mr: 1 }} />
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ width: "100%" }}
                >
                  <Slider
                    value={numGuests}
                    min={1}
                    max={16}
                    step={1}
                    valueLabelDisplay="auto"
                    onChange={(_, value) => setNumGuests(value)}
                    sx={{ color: "#FF5A5F" }}
                  />
                  <Typography>
                    {numGuests} {numGuests === 1 ? "guest" : "guests"}
                  </Typography>
                </Stack>
              </Box>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Button onClick={resetInput} variant="outlined">
                Cancel
              </Button>
              <Button onClick={search} variant="contained" color="primary">
                Search
              </Button>
            </Box>
          </DateRangeWrapper>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
