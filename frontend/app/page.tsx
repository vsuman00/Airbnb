"use client";

import { useState, useEffect } from "react";
import Header from "./components/Header";
import ListingCard from "./components/ListingCard";
import { fetchListings } from "./services/api";
import type { Listing } from "./types";

// Material UI imports
import {
  Box,
  Container,
  Typography,
  Grid as MuiGrid,
  Button,
  Paper,
  Skeleton,
  Card,
  CardContent,
  Divider,
  GridProps,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

interface CustomGridProps extends GridProps {
  item?: boolean;
  xs?: number | boolean;
  sm?: number | boolean;
  md?: number | boolean;
  lg?: number | boolean;
  xl?: number | boolean;
}

const Grid = (props: CustomGridProps) => <MuiGrid {...props} />;

// Extend Listing type for our mock data
interface MockListing extends Partial<Listing> {
  id: number;
  title: string;
  location: string;
  price_per_night: number;
  currency: string;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  ratings: number;
  reviews_count: number;
  images: Array<{
    is_primary: boolean;
    image_url: string;
  }>;
}

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadListings = async () => {
      setLoading(true);
      try {
        const response = await fetchListings({ page: "1" });
        setListings(response.results);
      } catch (error) {
        console.error("Error loading listings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, []);

  // Sample featured listings with good images as fallback for development
  const featuredListings: MockListing[] = [
    {
      id: 1,
      title: "Luxurious Beachfront Villa",
      location: "Bali, Indonesia",
      price_per_night: 250,
      currency: "USD",
      bedrooms: 3,
      beds: 4,
      bathrooms: 2,
      ratings: 4.97,
      reviews_count: 124,
      images: [
        {
          is_primary: true,
          image_url:
            "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1080",
        },
      ],
    },
    {
      id: 2,
      title: "Modern Loft in Downtown",
      location: "New York, United States",
      price_per_night: 185,
      currency: "USD",
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      ratings: 4.85,
      reviews_count: 98,
      images: [
        {
          is_primary: true,
          image_url:
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1080",
        },
      ],
    },
    {
      id: 3,
      title: "Charming Cottage with Garden",
      location: "Cotswolds, UK",
      price_per_night: 140,
      currency: "USD",
      bedrooms: 2,
      beds: 3,
      bathrooms: 1,
      ratings: 4.92,
      reviews_count: 76,
      images: [
        {
          is_primary: true,
          image_url:
            "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1080",
        },
      ],
    },
    {
      id: 4,
      title: "Stunning Mountain Cabin",
      location: "Aspen, Colorado",
      price_per_night: 310,
      currency: "USD",
      bedrooms: 3,
      beds: 5,
      bathrooms: 2,
      ratings: 4.99,
      reviews_count: 145,
      images: [
        {
          is_primary: true,
          image_url:
            "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1080",
        },
      ],
    },
  ];

  // Use our featuredListings if no API listings available
  const displayListings =
    listings.length > 0 ? listings : (featuredListings as unknown as Listing[]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      {/* Hero Section with backup inline style */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "500px", sm: "600px", lg: "700px", xl: "800px" },
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1920')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            color: "white",
            zIndex: 1,
            px: 3,
            maxWidth: "800px",
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 3,
              fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
            }}
          >
            Find your next stay
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Search low prices on homes, apartments, and much more...
          </Typography>
          <Button
            variant="contained"
            size="large"
            color="primary"
            startIcon={<SearchIcon />}
            sx={{
              py: 1.5,
              px: 4,
              fontSize: "1.1rem",
              boxShadow: 3,
            }}
          >
            Explore Nearby
          </Button>
        </Box>
      </Box>

      {/* Featured Listings */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" sx={{ fontWeight: 600, mb: 4 }}>
          Featured Listings
        </Typography>

        {loading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 8 }).map((_, index) => (
              <Grid
                key={`loading-skeleton-${index}`}
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
              >
                <Card sx={{ height: "100%" }}>
                  <Skeleton
                    variant="rectangular"
                    height={220}
                    animation="wave"
                  />
                  <CardContent>
                    <Skeleton variant="text" width="80%" height={28} />
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={3}>
            {displayListings.map((listing) => (
              <Grid key={listing.id} item xs={12} sm={6} md={4} lg={3}>
                <ListingCard listing={listing} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Experience Section */}
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Typography variant="h3" component="h2" sx={{ fontWeight: 600, mb: 4 }}>
          Discover Experiences
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                position: "relative",
                height: 320,
                borderRadius: 4,
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                },
                backgroundImage:
                  "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1080')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "flex-end",
              }}
              elevation={4}
            >
              <Box sx={{ p: 3, color: "white" }}>
                <Typography
                  variant="h4"
                  component="h3"
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  Nature Getaways
                </Typography>
                <Typography variant="subtitle1">
                  Explore the outdoors
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                position: "relative",
                height: 320,
                borderRadius: 4,
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                },
                backgroundImage:
                  "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1516402707257-787c50fc3898?q=80&w=1080')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "flex-end",
              }}
              elevation={4}
            >
              <Box sx={{ p: 3, color: "white" }}>
                <Typography
                  variant="h4"
                  component="h3"
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  Unique Stays
                </Typography>
                <Typography variant="subtitle1">
                  Spaces that are more than just a place to sleep
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                position: "relative",
                height: 320,
                borderRadius: 4,
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                },
                backgroundImage:
                  "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1080')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "flex-end",
              }}
              elevation={4}
            >
              <Box sx={{ p: 3, color: "white" }}>
                <Typography
                  variant="h4"
                  component="h3"
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  Luxe
                </Typography>
                <Typography variant="subtitle1">
                  Extraordinary homes with five-star everything
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: "background.paper",
          py: 6,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                ABOUT
              </Typography>
              <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  How Airbnb works
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  Newsroom
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  Investors
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  Careers
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                COMMUNITY
              </Typography>
              <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  Diversity & Belonging
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  Accessibility
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  Frontline Stays
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  Referrals
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                HOST
              </Typography>
              <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  Host your home
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  Host an experience
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  Responsible hosting
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  Resource center
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                SUPPORT
              </Typography>
              <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  Help center
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  Cancellation options
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  Neighborhood support
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  Trust & Safety
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ mt: 4, mb: 2 }} />
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Airbnb Clone. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
