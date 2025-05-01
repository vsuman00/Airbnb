from django.shortcuts import render
from rest_framework import viewsets, filters
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from decimal import Decimal

from .models import Listing, Host, ListingImage, Amenity, ListingAmenity
from .serializers import ListingSerializer, HostSerializer

# Create your views here.

class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['location', 'property_type', 'max_guests', 'bedrooms', 'beds', 'bathrooms']
    search_fields = ['title', 'location', 'description']
    ordering_fields = ['price_per_night', 'ratings', 'reviews_count']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by location
        location = self.request.query_params.get('location')
        if location:
            queryset = queryset.filter(location__icontains=location)
            
        # Filter by price range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price_per_night__gte=min_price)
        if max_price:
            queryset = queryset.filter(price_per_night__lte=max_price)
            
        # Filter by ratings
        min_rating = self.request.query_params.get('min_rating')
        if min_rating:
            queryset = queryset.filter(ratings__gte=min_rating)
            
        # Filter by number of guests
        guests = self.request.query_params.get('guests')
        if guests:
            queryset = queryset.filter(max_guests__gte=guests)
            
        # Filter by amenities
        amenities = self.request.query_params.get('amenities')
        if amenities:
            amenity_list = amenities.split(',')
            for amenity in amenity_list:
                queryset = queryset.filter(listing_amenities__amenity__name__icontains=amenity)
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            listing = serializer.save()
            return Response(
                ListingSerializer(listing).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
