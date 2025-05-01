from rest_framework import serializers
from .models import Host, Listing, ListingImage, Amenity, ListingAmenity

class HostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Host
        fields = ['id', 'name', 'profile_pic', 'host_since', 'response_rate', 'superhost']

class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ['id', 'name']

class ListingImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImage
        fields = ['id', 'image_url', 'is_primary']

class ListingSerializer(serializers.ModelSerializer):
    host = HostSerializer()
    images = ListingImageSerializer(many=True, read_only=True)
    amenities = serializers.SerializerMethodField()
    
    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'location', 'address', 'price_per_night', 
            'currency', 'total_price', 'ratings', 'reviews_count',
            'description', 'property_type', 'host', 'max_guests',
            'bedrooms', 'beds', 'bathrooms', 'images', 'amenities',
            'created_at', 'updated_at'
        ]
    
    def get_amenities(self, obj):
        amenity_objects = [la.amenity for la in obj.listing_amenities.all()]
        return AmenitySerializer(amenity_objects, many=True).data
    
    def create(self, validated_data):
        host_data = validated_data.pop('host')
        
        # Create or get host
        host, _ = Host.objects.get_or_create(
            name=host_data['name'],
            defaults=host_data
        )
        
        # Create listing
        listing = Listing.objects.create(host=host, **validated_data)
        
        # Process amenities if they exist in the initial data
        if 'amenities' in self.initial_data:
            amenities_data = self.initial_data.get('amenities', [])
            for amenity_name in amenities_data:
                amenity, _ = Amenity.objects.get_or_create(name=amenity_name)
                ListingAmenity.objects.create(listing=listing, amenity=amenity)
        
        # Process images if they exist in the initial data
        if 'images' in self.initial_data:
            images_data = self.initial_data.get('images', [])
            for index, image_url in enumerate(images_data):
                ListingImage.objects.create(
                    listing=listing,
                    image_url=image_url,
                    is_primary=(index == 0)  # First image is primary
                )
        
        return listing 