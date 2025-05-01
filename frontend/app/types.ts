export interface Host {
  id?: number;
  name: string;
  profile_pic?: string | null;
  host_since?: string | null;
  response_rate?: number | null;
  superhost: boolean;
}

export interface Amenity {
  id?: number;
  name: string;
}

export interface ListingImage {
  id?: number;
  image_url: string;
  is_primary: boolean;
}

export interface Listing {
  id?: number;
  title: string;
  location: string;
  address?: string | null;
  price_per_night: number;
  currency: string;
  total_price?: number | null;
  ratings?: number | null;
  reviews_count: number;
  description?: string | null;
  property_type?: string | null;
  host: Host;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  images: ListingImage[];
  amenities: Amenity[];
  created_at?: string;
  updated_at?: string;
}

export interface ListingsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Listing[];
}

export interface SearchParams {
  location?: string;
  checkin?: string;
  checkout?: string;
  guests?: string;
  min_price?: string;
  max_price?: string;
  min_rating?: string;
  property_type?: string;
  amenities?: string;
  page?: string;
}

// Auth types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// API error type
export interface AxiosError extends Error {
  response?: {
    data: unknown;
    status: number;
    headers: Record<string, string>;
  };
  request?: unknown;
  config?: Record<string, unknown>;
}
