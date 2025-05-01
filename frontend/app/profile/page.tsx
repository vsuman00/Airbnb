"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Divider,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  ExitToApp as LogoutIcon,
} from "@mui/icons-material";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, isLoggedIn, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, loading, router]);

  if (loading) {
    return (
      <>
        <Header />
        <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <Typography>Loading profile...</Typography>
          </Box>
        </Container>
      </>
    );
  }

  // We shouldn't get here if user is null due to the redirect
  // But we'll include a check anyway
  if (!user) {
    return null;
  }

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "center", sm: "flex-start" },
              mb: 4,
            }}
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: "primary.main",
                fontSize: "3rem",
                mr: { xs: 0, sm: 4 },
                mb: { xs: 3, sm: 0 },
              }}
            >
              {user.first_name
                ? user.first_name.charAt(0).toUpperCase()
                : user.username.charAt(0).toUpperCase()}
            </Avatar>

            <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                {user.first_name && user.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user.username}
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", mt: 1 }}
                justifyContent={{ xs: "center", sm: "flex-start" }}
              >
                <EmailIcon
                  fontSize="small"
                  sx={{ mr: 1, color: "text.secondary" }}
                />
                <Typography variant="body1" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", alignItems: "center", mt: 1 }}
                justifyContent={{ xs: "center", sm: "flex-start" }}
              >
                <PersonIcon
                  fontSize="small"
                  sx={{ mr: 1, color: "text.secondary" }}
                />
                <Typography variant="body1" color="text.secondary">
                  Username: {user.username}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Account Information
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            <Box sx={{ flexBasis: { xs: "100%", md: "48%" } }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1">
                      <strong>Name:</strong>{" "}
                      {user.first_name && user.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : "Not provided"}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      <strong>Email:</strong> {user.email}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      <strong>Username:</strong> {user.username}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flexBasis: { xs: "100%", md: "48%" } }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Account Settings
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => router.push("/account-settings")}
                      fullWidth
                    >
                      Edit Profile
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<LogoutIcon />}
                      onClick={logout}
                      fullWidth
                    >
                      Logout
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
