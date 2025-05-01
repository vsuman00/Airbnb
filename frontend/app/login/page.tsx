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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { login } from "../services/auth";
import Header from "../components/Header";
import { AxiosError } from "../types";

interface ApiError {
  non_field_errors?: string[];
  [key: string]: string[] | string | undefined;
}

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
    if (!formData.password) newErrors.push("Password is required");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      await login(formData);
      router.push("/");
    } catch (error: unknown) {
      const responseErrors = (error as AxiosError).response?.data as ApiError;
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
        setErrors(["An error occurred during login. Please try again."]);
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
            Log in to Airbnb
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
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
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
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>or</Divider>

          <Typography variant="body1" sx={{ textAlign: "center", mb: 2 }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" style={{ color: "#FF5A5F", fontWeight: 500 }}>
              Sign up
            </Link>
          </Typography>
        </Paper>
      </Container>
    </>
  );
}
