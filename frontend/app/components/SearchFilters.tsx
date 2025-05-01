"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface FilterProps {
  onFilterChange: (filters: Record<string, string>) => void;
  initialFilters?: Record<string, string>;
}

const SearchFilters: React.FC<FilterProps> = ({
  onFilterChange,
  initialFilters = {},
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    min_price: initialFilters.min_price ?? "",
    max_price: initialFilters.max_price ?? "",
    min_rating: initialFilters.min_rating ?? "",
    property_type: initialFilters.property_type ?? "",
    amenities: initialFilters.amenities ?? "",
  });

  useEffect(() => {
    // Get filters from URL params on initial load
    const params = new URLSearchParams(searchParams.toString());
    const newFilters = {
      min_price: "",
      max_price: "",
      min_rating: "",
      property_type: "",
      amenities: "",
    };

    if (params.has("min_price"))
      newFilters.min_price = params.get("min_price") ?? "";
    if (params.has("max_price"))
      newFilters.max_price = params.get("max_price") ?? "";
    if (params.has("min_rating"))
      newFilters.min_rating = params.get("min_rating") ?? "";
    if (params.has("property_type"))
      newFilters.property_type = params.get("property_type") ?? "";
    if (params.has("amenities"))
      newFilters.amenities = params.get("amenities") ?? "";

    setFilters(newFilters);
  }, [searchParams]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Remove empty filters
    const activeFilters: Record<string, string> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) activeFilters[key] = value;
    });

    onFilterChange(activeFilters);

    // Update URL params
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Keep original search params
    if (searchParams.has("location"))
      params.set("location", searchParams.get("location") ?? "");
    if (searchParams.has("checkin"))
      params.set("checkin", searchParams.get("checkin") ?? "");
    if (searchParams.has("checkout"))
      params.set("checkout", searchParams.get("checkout") ?? "");
    if (searchParams.has("guests"))
      params.set("guests", searchParams.get("guests") ?? "");

    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    const clearedFilters = {
      min_price: "",
      max_price: "",
      min_rating: "",
      property_type: "",
      amenities: "",
    };

    setFilters(clearedFilters);

    // Keep only the essential search params
    const params = new URLSearchParams();
    if (searchParams.has("location"))
      params.set("location", searchParams.get("location") ?? "");
    if (searchParams.has("checkin"))
      params.set("checkin", searchParams.get("checkin") ?? "");
    if (searchParams.has("checkout"))
      params.set("checkout", searchParams.get("checkout") ?? "");
    if (searchParams.has("guests"))
      params.set("guests", searchParams.get("guests") ?? "");

    router.push(`/search?${params.toString()}`);
    onFilterChange({});
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h2 className="text-xl font-bold mb-4">Filters</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Price Range */}
          <div>
            <div className="font-medium mb-2">Price Range</div>
            <div className="flex items-center gap-2">
              <div className="w-full">
                <label htmlFor="min_price" className="sr-only">
                  Minimum Price
                </label>
                <input
                  id="min_price"
                  type="number"
                  name="min_price"
                  placeholder="Min Price"
                  value={filters.min_price}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2"
                  min="0"
                />
              </div>
              <span>-</span>
              <div className="w-full">
                <label htmlFor="max_price" className="sr-only">
                  Maximum Price
                </label>
                <input
                  id="max_price"
                  type="number"
                  name="max_price"
                  placeholder="Max Price"
                  value={filters.max_price}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Min Rating */}
          <div>
            <label htmlFor="min_rating" className="block mb-2 font-medium">
              Min Rating
            </label>
            <select
              id="min_rating"
              name="min_rating"
              value={filters.min_rating}
              onChange={handleInputChange}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5+</option>
              <option value="4.0">4.0+</option>
              <option value="3.5">3.5+</option>
              <option value="3.0">3.0+</option>
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label htmlFor="property_type" className="block mb-2 font-medium">
              Property Type
            </label>
            <select
              id="property_type"
              name="property_type"
              value={filters.property_type}
              onChange={handleInputChange}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Any Type</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Villa">Villa</option>
              <option value="Condo">Condo</option>
              <option value="Cabin">Cabin</option>
            </select>
          </div>

          {/* Amenities */}
          <div>
            <label htmlFor="amenities" className="block mb-2 font-medium">
              Amenities
            </label>
            <input
              id="amenities"
              type="text"
              name="amenities"
              placeholder="e.g. WiFi, Pool (comma separated)"
              value={filters.amenities}
              onChange={handleInputChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={clearFilters}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Clear All
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchFilters;
