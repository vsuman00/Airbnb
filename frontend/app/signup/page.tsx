"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Alert,
  InputAdornment,
  IconButton,
  Grid,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { signup } from "../services/auth";
import Header from "../components/Header";
import type { SignupData, AxiosError } from "../types";

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<SignupData>({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);

    // Basic validation
    const newErrors: string[] = [];
    if (!formData.username) newErrors.push("Username is required");
    if (!formData.email) newErrors.push("Email is required");
    if (!formData.password) newErrors.push("Password is required");
    if (formData.password.length < 8)
      newErrors.push("Password must be at least 8 characters");
    if (formData.password !== formData.password_confirm)
      newErrors.push("Passwords do not match");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      await signup(formData);
      router.push("/");
    } catch (error: unknown) {
      const responseErrors =
        error instanceof Error && (error as AxiosError).response?.data
          ? (error as AxiosError).response.data
          : null;
      if (responseErrors) {
        // Handle different error formats from the server
        if (typeof responseErrors === "string") {
          setErrors([responseErrors]);
        } else if (responseErrors.non_field_errors) {
          setErrors(responseErrors.non_field_errors);
        } else if (typeof responseErrors === "object") {
          const errMsgs = Object.entries(responseErrors).map(
            ([key, value]) => `${key}: ${value}`
          );
          setErrors(errMsgs);
        }
      } else {
        setErrors(["An error occurred during signup. Please try again."]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ mb: 3, fontWeight: 600 }}
          >
            Sign up for Airbnb
          </Typography>

          {errors.length > 0 && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="first_name"
                  label="First Name"
                  name="first_name"
                  autoComplete="given-name"
                  value={formData.first_name}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="last_name"
                  label="Last Name"
                  name="last_name"
                  autoComplete="family-name"
                  value={formData.last_name}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
              helperText="Password must be at least 8 characters"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password_confirm"
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              id="password_confirm"
              autoComplete="new-password"
              value={formData.password_confirm}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{
                py: 1.5,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 500,
              }}
            >
              {isLoading ? "Creating account..." : "Sign up"}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>or</Divider>

          <Typography variant="body1" sx={{ textAlign: "center", mb: 2 }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#FF5A5F", fontWeight: 500 }}>
              Log in
            </Link>
          </Typography>
        </Paper>
      </Container>
    </>
  );
}
