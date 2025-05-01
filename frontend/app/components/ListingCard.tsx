"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Listing } from "../types";

interface ListingCardProps {
  listing: Listing;
  showPrice?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  showPrice = true,
}) => {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  // Use the first image as the main image or a placeholder if no images
  const mainImage =
    listing.images?.length > 0
      ? listing.images.find((img) => img.is_primary)?.image_url ??
        listing.images[0]?.image_url
      : "/placeholder.jpg";

  const handleClick = () => {
    router.push(`/listing/${listing.id}`);
  };

  const formatPrice = (price: number) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: listing.currency ?? "USD",
      minimumFractionDigits: 0,
    });
    return formatter.format(price);
  };

  return (
    <div
      className="cursor-pointer hover:shadow-lg transition duration-200 ease-out rounded-xl"
      onClick={handleClick}
    >
      <div className="relative h-64 w-full mb-2">
        {imageError ? (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center rounded-xl">
            <p className="text-gray-500">Image not available</p>
          </div>
        ) : (
          <Image
            src={mainImage}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded-xl object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      <div className="px-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold truncate">{listing.location}</h3>

          {listing.ratings && (
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5 text-red-500"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="ml-1">{listing.ratings.toFixed(1)}</p>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-500 truncate">{listing.title}</p>

        <div className="flex items-center mt-1 text-sm">
          <p>
            <span className="font-semibold">
              {listing.bedrooms} bedroom{listing.bedrooms !== 1 ? "s" : ""}
            </span>
            {" • "}
            <span>
              {listing.beds} bed{listing.beds !== 1 ? "s" : ""}
            </span>
            {" • "}
            <span>
              {listing.bathrooms} bathroom{listing.bathrooms !== 1 ? "s" : ""}
            </span>
          </p>
        </div>

        {listing.host && (
          <p className="text-sm text-gray-500 mt-1">
            Hosted by {listing.host.name}
            {listing.host.superhost && (
              <span className="ml-1 text-xs bg-red-100 text-red-800 px-1 rounded">
                Superhost
              </span>
            )}
          </p>
        )}

        {showPrice && (
          <p className="mt-2">
            <span className="font-semibold">
              {formatPrice(listing.price_per_night)}
            </span>{" "}
            night
          </p>
        )}
      </div>
    </div>
  );
};

export default ListingCard;
