"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../components/Header";
import ListingCard from "../components/ListingCard";
import SearchFilters from "../components/SearchFilters";
import { fetchListings } from "../services/api";
import type { Listing } from "../types";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );

  const location = searchParams.get("location") ?? "";
  const checkin = searchParams.get("checkin") ?? "";
  const checkout = searchParams.get("checkout") ?? "";
  const guests = searchParams.get("guests") ?? "";

  const loadListings = useCallback(async () => {
    setLoading(true);
    try {
      // Create params object from search params
      const params: Record<string, string> = {};

      // Add search parameters
      if (location) params.location = location;
      if (checkin) params.checkin = checkin;
      if (checkout) params.checkout = checkout;
      if (guests) params.guests = guests;

      // Add filter parameters from URL
      params.min_price = searchParams.get("min_price") ?? "";
      params.max_price = searchParams.get("max_price") ?? "";
      params.min_rating = searchParams.get("min_rating") ?? "";
      params.property_type = searchParams.get("property_type") ?? "";
      params.amenities = searchParams.get("amenities") ?? "";

      // Add pagination
      params.page = searchParams.get("page") ?? "1";

      // Fetch listings with params
      const response = await fetchListings(params);

      setListings(response.results);
      setTotalCount(response.count);
      setCurrentPage(parseInt(params.page) ?? 1);
      setTotalPages(Math.ceil(response.count / 10)); // Assuming 10 items per page

      // Update active filters
      const filters: Record<string, string> = {};
      if (params.min_price) filters.min_price = params.min_price;
      if (params.max_price) filters.max_price = params.max_price;
      if (params.min_rating) filters.min_rating = params.min_rating;
      if (params.property_type) filters.property_type = params.property_type;
      if (params.amenities) filters.amenities = params.amenities;
      setActiveFilters(filters);
    } catch (error) {
      console.error("Error loading listings:", error);
    } finally {
      setLoading(false);
    }
  }, [searchParams, location, checkin, checkout, guests]);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const handleFilterChange = (filters: Record<string, string>) => {
    setActiveFilters(filters);
  };

  return (
    <div>
      <Header placeholder={`${location} | ${guests} guests`} />

      <main className="max-w-7xl mx-auto px-8 sm:px-16 py-8">
        <section className="pt-6">
          <h1 className="text-3xl font-semibold mb-6">
            {location ? `Stays in ${location}` : "All Stays"}
            {checkin && checkout && (
              <span className="text-lg font-normal ml-2">
                {checkin} to {checkout}
              </span>
            )}
            {guests && (
              <span className="text-lg font-normal ml-2">
                • {guests} guests
              </span>
            )}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters */}
            <div className="lg:col-span-1">
              <SearchFilters
                onFilterChange={handleFilterChange}
                initialFilters={activeFilters}
              />
            </div>

            {/* Listings */}
            <div className="lg:col-span-3">
              {(() => {
                if (loading) {
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array.from({ length: 6 }).map(() => (
                        <div
                          key={`loading-skeleton-${Math.random()
                            .toString(36)
                            .substring(2, 11)}`}
                          className="rounded-xl bg-gray-200 h-72 animate-pulse"
                        />
                      ))}
                    </div>
                  );
                }

                if (listings.length > 0) {
                  return (
                    <>
                      <p className="text-sm text-gray-500 mb-6">
                        {totalCount} stays{" "}
                        {Object.keys(activeFilters).length > 0 &&
                          "• Filtered results"}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listings.map((listing) => (
                          <ListingCard key={listing.id} listing={listing} />
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex justify-center mt-10">
                          <div className="flex space-x-2">
                            {Array.from({ length: totalPages }).map((_, i) => {
                              const page = i + 1;
                              const isActive = page === currentPage;

                              return (
                                <a
                                  key={page}
                                  href={`/search?${new URLSearchParams({
                                    ...Object.fromEntries(
                                      searchParams.entries()
                                    ),
                                    page: page.toString(),
                                  })}`}
                                  className={`px-4 py-2 rounded-full ${
                                    isActive
                                      ? "bg-red-500 text-white"
                                      : "bg-white text-gray-700 hover:bg-gray-100 border"
                                  }`}
                                >
                                  {page}
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  );
                }

                return (
                  <div className="text-center py-10">
                    <h3 className="text-xl font-semibold mb-2">
                      No results found
                    </h3>
                    <p className="text-gray-500">
                      Try adjusting your search filters or searching for a
                      different location.
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
