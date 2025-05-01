"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Header from "../../components/Header";
import { fetchListingById } from "../../services/api";
import type { Listing } from "../../types";

// Add a helper function to generate stable keys for elements that don't have natural IDs
const generateStableKey = (
  prefix: string,
  item: unknown,
  index: number
): string => {
  // Try to use an intrinsic property if available
  const typedItem = item as {
    id?: string | number;
    image_url?: string;
  };

  if (typedItem.id) return `${prefix}-${typedItem.id}`;
  if (typedItem.image_url)
    return `${prefix}-${typedItem.image_url.split("/").pop()}`;

  // Fall back to a combination that's at least more meaningful than index alone
  return `${prefix}-${index}-${Date.now()}`;
};

export default function ListingPage() {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  useEffect(() => {
    const loadListing = async () => {
      try {
        setLoading(true);
        console.log("Loading listing for ID:", id);

        // Force a short delay to ensure hooks are properly set
        await new Promise((resolve) => setTimeout(resolve, 100));

        const data = await fetchListingById(id as string);

        if (!data) {
          console.error("No listing data returned from API");
          setLoading(false);
          return;
        }

        console.log("Successfully loaded listing data:", data);

        // Set state in separate operations to avoid race conditions
        setListing(data);

        // Short delay before setting the image
        await new Promise((resolve) => setTimeout(resolve, 50));

        // Set the first image as selected initially
        if (data.images && data.images.length > 0) {
          const primaryImage = data.images.find((img) => img.is_primary);
          const imageUrl = primaryImage?.image_url || data.images[0].image_url;
          console.log("Setting selected image:", imageUrl);
          setSelectedImage(imageUrl);
        } else {
          console.warn("No images found for this listing");
        }
      } catch (error) {
        console.error("Error in loadListing function:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadListing();
    }
  }, [id]);

  const formatPrice = (price: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="max-w-7xl mx-auto px-8 sm:px-16 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-96 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
              </div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div>
        <Header />
        <div className="max-w-7xl mx-auto px-8 sm:px-16 py-8 text-center">
          <h1 className="text-2xl font-semibold mb-4">Listing not found</h1>
          <p>
            The listing you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
        </div>
      </div>
    );
  }

  if (showAllPhotos) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="p-8">
          <button
            onClick={() => setShowAllPhotos(false)}
            className="flex items-center text-white mb-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M7.28 7.72a.75.75 0 010 1.06l-2.47 2.47H21a.75.75 0 010 1.5H4.81l2.47 2.47a.75.75 0 11-1.06 1.06l-3.75-3.75a.75.75 0 010-1.06l3.75-3.75a.75.75 0 011.06 0z"
                clipRule="evenodd"
              />
            </svg>
            Back to listing
          </button>

          <h2 className="text-2xl font-bold mb-6">Photos of {listing.title}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listing.images.map((image, index) => (
              <button
                key={generateStableKey("gallery-image", image, index)}
                className="relative h-[500px] w-full border-0 p-0"
                type="button"
                aria-label={`Photo ${index + 1} of ${listing.title}`}
              >
                <Image
                  src={image.image_url}
                  alt={`Photo ${index + 1} of ${listing.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />

      <main className="max-w-7xl mx-auto px-8 sm:px-16 py-8">
        <h1 className="text-3xl font-semibold mb-2">{listing.title}</h1>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            {listing.ratings && (
              <span className="flex items-center mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-red-500 mr-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                    clipRule="evenodd"
                  />
                </svg>
                {listing.ratings.toFixed(1)} ·{" "}
                <span className="ml-1">{listing.reviews_count} reviews</span>
              </span>
            )}
            <span className="font-medium">{listing.location}</span>
          </div>

          <div className="flex space-x-4">
            <button className="flex items-center text-gray-700 hover:text-gray-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 mr-1"
              >
                <path d="M11.47 1.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 01-1.06 1.06l-2.47-2.47v12.88a.75.75 0 01-1.5 0V4.06L8.78 6.53a.75.75 0 01-1.06-1.06l3.75-3.75zM8.625 13.5a.75.75 0 00-1.5 0v2.25a.75.75 0 00.75.75h10.5a.75.75 0 00.75-.75v-2.25a.75.75 0 00-1.5 0v1.5h-9v-1.5z" />
              </svg>
              Share
            </button>

            <button className="flex items-center text-gray-700 hover:text-gray-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 mr-1"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.218l-.022.012-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
              Save
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="relative mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-xl overflow-hidden h-[400px]">
            {/* Main image */}
            <div className="relative col-span-2 row-span-2 h-full">
              {selectedImage && (
                <Image
                  src={selectedImage}
                  alt={listing.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              )}
            </div>

            {/* Smaller images */}
            {listing.images.slice(0, 4).map((image, index) =>
              index === 0 ? null : (
                <button
                  key={generateStableKey("thumbnail", image, index)}
                  className="relative h-full w-full border-0 p-0 cursor-pointer"
                  onClick={() => setSelectedImage(image.image_url)}
                  aria-label={`View image ${index + 1} of ${listing.title}`}
                  type="button"
                >
                  <Image
                    src={image.image_url}
                    alt={`${listing.title} image ${index + 1}`}
                    fill
                    sizes="25vw"
                    className="object-cover hover:opacity-90 transition"
                  />
                </button>
              )
            )}
          </div>

          <button
            onClick={() => setShowAllPhotos(true)}
            className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md text-sm font-medium flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 mr-1"
            >
              <path
                fillRule="evenodd"
                d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                clipRule="evenodd"
              />
            </svg>
            Show all photos
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Left Column - Details */}
          <div className="md:col-span-2">
            <div className="border-b pb-6 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-semibold">
                    {listing.property_type && `${listing.property_type} in `}
                    {listing.location}
                  </h2>
                  <p className="text-gray-700">
                    {listing.max_guests} guests · {listing.bedrooms} bedroom
                    {listing.bedrooms !== 1 ? "s" : ""} · {listing.beds} bed
                    {listing.beds !== 1 ? "s" : ""} · {listing.bathrooms}{" "}
                    bathroom{listing.bathrooms !== 1 ? "s" : ""}
                  </p>
                </div>

                {listing.host && (
                  <div className="flex items-center">
                    {listing.host.profile_pic ? (
                      <div className="relative h-14 w-14 rounded-full overflow-hidden">
                        <Image
                          src={listing.host.profile_pic}
                          alt={listing.host.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xl font-semibold">
                          {listing.host.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="ml-3">
                      <p className="font-medium">Host: {listing.host.name}</p>
                      {listing.host.superhost && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                          Superhost
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="border-b pb-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">About this place</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {listing.description ?? "No description provided."}
              </p>
            </div>

            {/* Amenities */}
            <div className="border-b pb-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">
                What this place offers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listing.amenities && listing.amenities.length > 0 ? (
                  listing.amenities.map((amenity, index) => (
                    <div
                      key={
                        amenity.id ||
                        generateStableKey("amenity", amenity, index)
                      }
                      className="flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 mr-3 text-gray-700"
                      >
                        <path
                          fillRule="evenodd"
                          d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{amenity.name}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No amenities listed.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Booking */}
          <div>
            <div className="sticky top-28 border rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-2xl font-semibold">
                    {formatPrice(listing.price_per_night, listing.currency)}{" "}
                    <span className="text-base font-normal">night</span>
                  </p>
                  {listing.ratings && (
                    <div className="flex items-center mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4 text-red-500 mr-1"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm">
                        {listing.ratings.toFixed(1)} ·{" "}
                        <span className="ml-1">
                          {listing.reviews_count} reviews
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 border rounded-t-lg overflow-hidden">
                <div className="border-r border-b p-3">
                  <label
                    htmlFor="check-in"
                    className="block text-xs font-bold uppercase"
                  >
                    Check-in
                  </label>
                  <input
                    id="check-in"
                    type="date"
                    className="w-full mt-1 text-sm outline-none"
                  />
                </div>
                <div className="border-b p-3">
                  <label
                    htmlFor="check-out"
                    className="block text-xs font-bold uppercase"
                  >
                    Checkout
                  </label>
                  <input
                    id="check-out"
                    type="date"
                    className="w-full mt-1 text-sm outline-none"
                  />
                </div>
                <div className="col-span-2 p-3">
                  <label
                    htmlFor="guests"
                    className="block text-xs font-bold uppercase"
                  >
                    Guests
                  </label>
                  <select
                    id="guests"
                    className="w-full mt-1 text-sm outline-none"
                  >
                    {[...Array(listing.max_guests)].map((_, i) => (
                      <option key={`guest-option-${i + 1}`} value={i + 1}>
                        {i + 1} guest{i !== 0 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold mt-4 hover:bg-red-600 transition">
                Reserve
              </button>

              <p className="text-center text-gray-500 text-sm mt-2">
                You won&apos;t be charged yet
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <p className="underline">
                    {formatPrice(listing.price_per_night, listing.currency)} x 5
                    nights
                  </p>
                  <p>
                    {formatPrice(listing.price_per_night * 5, listing.currency)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="underline">Cleaning fee</p>
                  <p>
                    {formatPrice(
                      listing.price_per_night * 0.1,
                      listing.currency
                    )}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="underline">Service fee</p>
                  <p>
                    {formatPrice(
                      listing.price_per_night * 0.15,
                      listing.currency
                    )}
                  </p>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold">
                  <p>Total</p>
                  <p>
                    {formatPrice(
                      listing.price_per_night * 5 +
                        listing.price_per_night * 0.1 +
                        listing.price_per_night * 0.15,
                      listing.currency
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
