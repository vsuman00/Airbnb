from django.db import models
import json

class Host(models.Model):
    name = models.CharField(max_length=255)
    profile_pic = models.URLField(blank=True, null=True)
    host_since = models.DateField(null=True, blank=True)
    response_rate = models.IntegerField(null=True, blank=True)
    superhost = models.BooleanField(default=False)
    
    def __str__(self):
        return self.name

class Listing(models.Model):
    title = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    address = models.TextField(blank=True, null=True)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='USD')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    ratings = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    reviews_count = models.IntegerField(default=0)
    description = models.TextField(blank=True, null=True)
    property_type = models.CharField(max_length=100, blank=True, null=True)
    host = models.ForeignKey(Host, on_delete=models.CASCADE, related_name='listings')
    max_guests = models.IntegerField(default=1)
    bedrooms = models.IntegerField(default=1)
    beds = models.IntegerField(default=1)
    bathrooms = models.DecimalField(max_digits=3, decimal_places=1, default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title

class ListingImage(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='images')
    image_url = models.URLField()
    is_primary = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Image for {self.listing.title}"

class Amenity(models.Model):
    name = models.CharField(max_length=255)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Amenities"

class ListingAmenity(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='listing_amenities')
    amenity = models.ForeignKey(Amenity, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.amenity.name} for {self.listing.title}"
    
    class Meta:
        verbose_name_plural = "Listing Amenities"
