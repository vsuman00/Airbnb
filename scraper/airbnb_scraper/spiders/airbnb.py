import scrapy
import json
import requests
from datetime import datetime
from urllib.parse import urlencode
import re


class AirbnbSpider(scrapy.Spider):
    name = "airbnb"
    allowed_domains = ["airbnb.com"]
    
    # Error messages
    JSON_PARSE_ERROR = "Failed to parse JSON data from script tag"
    
    # CSS Selectors
    LISTING_PRICE_SELECTOR = 'span[data-testid="listing-price"] span::text'
    
    # Custom settings for the spider
    custom_settings = {
        'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'DOWNLOAD_DELAY': 2,  # 2 second delay between requests
        'CONCURRENT_REQUESTS': 1
    }
    
    def __init__(self, location=None, checkin=None, checkout=None, guests=None, *args, **kwargs):
        super(AirbnbSpider, self).__init__(*args, **kwargs)
        
        # Default parameters if not provided
        self.location = location or "New York"
        self.checkin = checkin or (datetime.now().strftime("%Y-%m-%d"))
        self.checkout = checkout or (datetime.now().replace(day=datetime.now().day + 5).strftime("%Y-%m-%d"))
        self.guests = guests or "2"
        
        # Construct API URL with parameters
        params = {
            "query": self.location,
            "checkin": self.checkin,
            "checkout": self.checkout,
            "adults": self.guests,
            "children": "0",
            "infants": "0",
            "pets": "0"
        }
        
        # Build URL for API search
        self.start_urls = [f"https://www.airbnb.com/s/{self.location}/homes?{urlencode(params)}"]
        
        self.logger.info(f"Starting Airbnb scraper with URL: {self.start_urls[0]}")

    def parse(self, response):
        """
        Parse the search results page to extract listing cards and
        follow them to the individual listing pages.
        """
        # Process JSON data from page
        yield from self.process_json_data(response)
        
        # Process HTML listing cards as fallback
        yield from self.process_listing_cards(response)
        
        # Follow pagination links
        next_page = self.follow_pagination(response)
        if next_page:
            yield next_page
    
    def process_json_data(self, response):
        """Extract listings from JSON data in the page."""
        scripts = response.xpath('//script[@id="data-state"]/text()').get()
        if not scripts:
            return
            
        try:
            data = json.loads(scripts)
            explore_sections = data.get('niobeClientData', {}).get('__niobe_denormalized', {})
            
            if not explore_sections:
                return
                
            for section_key, section_value in explore_sections.items():
                yield from self.extract_listings_from_section(section_value)
                
        except ValueError:
            self.logger.error(self.JSON_PARSE_ERROR)
        except TypeError:
            self.logger.error(self.JSON_PARSE_ERROR)
        except Exception as e:
            self.logger.error(f"{self.JSON_PARSE_ERROR}: {str(e)}")
    
    def extract_listings_from_section(self, section_value):
        """Extract listings from a section and request each listing page."""
        if not isinstance(section_value, dict) or 'listings' not in section_value:
            return
            
        listings = section_value.get('listings', [])
        for listing in listings:
            listing_id = listing.get('id')
            if listing_id:
                yield self.request_listing_page(listing_id)
    
    def process_listing_cards(self, response):
        """Extract listings from HTML cards as fallback."""
        listing_cards = response.css('div[data-testid="card-container"]')
        
        for card in listing_cards:
            listing_link = card.css('a::attr(href)').get()
            if not (listing_link and '/rooms/' in listing_link):
                continue
                
            listing_id = re.search(r'/rooms/(\d+)', listing_link)
            if listing_id:
                yield self.request_listing_page(listing_id.group(1))
    
    def request_listing_page(self, listing_id):
        """Create and yield a request for a listing page."""
        listing_url = f"https://www.airbnb.com/rooms/{listing_id}"
        return scrapy.Request(
            url=listing_url,
            callback=self.parse_listing,
            meta={
                'listing_id': listing_id,
                'checkin': self.checkin,
                'checkout': self.checkout,
                'guests': self.guests
            }
        )
    
    def follow_pagination(self, response):
        """Follow pagination links if available."""
        next_page_url = response.css('a[aria-label="Next"]::attr(href)').get()
        if next_page_url:
            return response.follow(next_page_url, callback=self.parse)
    
    def parse_listing(self, response):
        """
        Parse individual listing page to extract detailed information.
        """
        # Try to extract JSON data from page
        listing_data = self._extract_json_data(response)
        
        # Fallback to HTML parsing if JSON data extraction fails
        if not listing_data:
            listing_data = self._extract_html_data(response)
            
        # Send data to API
        if listing_data:
            self.send_to_api(listing_data)
            yield listing_data
    
    def _extract_json_data(self, response):
        """Extract listing data from JSON in the page."""
        script_data = response.xpath('//script[@id="data-state"]/text()').get()
        if not script_data:
            return {}
            
        try:
            data = json.loads(script_data)
            metadata = self._find_listing_metadata(data)
            
            if not metadata:
                return {}
                
            # Extract basic information
            return {
                'listing_id': response.meta.get('listing_id'),
                'title': self.extract_title(response, metadata),
                'location': self.extract_location(response, metadata),
                'address': self.extract_address(response, metadata),
                'price_per_night': self.extract_price(response, metadata),
                'currency': self.extract_currency(response, metadata),
                'total_price': self.extract_total_price(response, metadata),
                'ratings': self.extract_ratings(response, metadata),
                'reviews_count': self.extract_reviews_count(response, metadata),
                'description': self.extract_description(response, metadata),
                'property_type': self.extract_property_type(response, metadata),
                'host': self.extract_host_info(response, metadata),
                'max_guests': self.extract_max_guests(response, metadata),
                'bedrooms': self.extract_bedrooms(response, metadata),
                'beds': self.extract_beds(response, metadata),
                'bathrooms': self.extract_bathrooms(response, metadata),
                'amenities': self.extract_amenities(response, metadata),
                'images': self.extract_images(response, metadata)
            }
        except ValueError:
            self.logger.error(self.JSON_PARSE_ERROR)
        except TypeError:
            self.logger.error(self.JSON_PARSE_ERROR)
        except Exception as e:
            self.logger.error(f"{self.JSON_PARSE_ERROR}: {str(e)}")
            
        return {}
        
    def _find_listing_metadata(self, data):
        """Find the listing metadata in the JSON data."""
        pdp_sections = data.get('niobeClientData', {}).get('__niobe_denormalized', {})
        
        for key, section in pdp_sections.items():
            if isinstance(section, dict) and 'pdpSections' in section:
                return section
                
        return None
        
    def _extract_html_data(self, response):
        """Extract listing data from HTML as fallback."""
        return {
            'listing_id': response.meta.get('listing_id'),
            'title': response.css('h1::text').get(),
            'location': response.css('span[data-testid="listing-title-address"]::text').get(),
            'price_per_night': self.extract_html_price(response),
            'currency': self.extract_html_currency(response),
            'ratings': response.css('span[data-testid="rating-value"]::text').get(),
            'reviews_count': response.css('span[data-testid="rating-count"]::text').get(),
            'images': response.css('img::attr(src)').getall(),
            'amenities': response.css('div[data-section-id="amenities"] div::text').getall(),
            'host': {
                'name': response.css('div[data-section-id="host-profile"] h2::text').get()
            }
        }
    
    # Helper methods to extract specific data from JSON
    def extract_title(self, response, metadata):
        # Try to extract from metadata
        try:
            return metadata.get('pdpSections', {}).get('title', {})
        except ValueError:
            # Fallback to HTML
            return response.css('h1::text').get()
    
    def extract_location(self, response, metadata):
        try:
            return metadata.get('pdpSections', {}).get('location', {}).get('title', '')
        except ValueError:
            return response.css('span[data-testid="listing-title-address"]::text').get() or ""
    
    def extract_address(self, response, metadata):
        try:
            location = metadata.get('pdpSections', {}).get('location', {})
            return location.get('address', '') or location.get('title', '')
        except ValueError:
            return ""
    
    def extract_price(self, response, metadata):
        try:
            pricing = metadata.get('pdpSections', {}).get('pricing', {})
            price = pricing.get('rate', {}).get('amount', 0)
            return price
        except ValueError:
            # Try to extract from HTML
            price_text = response.css(self.LISTING_PRICE_SELECTOR).get() or "0"
            price_text = re.search(r'\d+', price_text)
            return float(price_text.group()) if price_text else 0
    
    def extract_currency(self, response, metadata):
        try:
            pricing = metadata.get('pdpSections', {}).get('pricing', {})
            return pricing.get('rate', {}).get('currency', 'USD')
        except ValueError:
            # Default to USD if not found
            return "USD"
    
    def extract_total_price(self, response, metadata):
        try:
            pricing = metadata.get('pdpSections', {}).get('pricing', {})
            return pricing.get('total', {}).get('amount', 0)
        except ValueError:
            return 0
    
    def extract_ratings(self, response, metadata):
        try:
            reviews = metadata.get('pdpSections', {}).get('reviews', {})
            return reviews.get('rating', 0)
        except ValueError:
            rating_text = response.css('span[data-testid="rating-value"]::text').get() or "0"
            return float(rating_text) if rating_text else 0
    
    def extract_reviews_count(self, response, metadata):
        try:
            reviews = metadata.get('pdpSections', {}).get('reviews', {})
            return reviews.get('count', 0)
        except ValueError:
            count_text = response.css('span[data-testid="rating-count"]::text').get() or "0"
            count_text = re.search(r'\d+', count_text)
            return int(count_text.group()) if count_text else 0
    
    def extract_description(self, response, metadata):
        try:
            return metadata.get('pdpSections', {}).get('description', {}).get('content', '')
        except ValueError:
            return response.css('div[data-section-id="description"] div::text').get() or ""
    
    def extract_property_type(self, response, metadata):
        try:
            return metadata.get('pdpSections', {}).get('propertyType', '')
        except ValueError:
            return ""
    
    def extract_host_info(self, response, metadata):
        try:
            host = metadata.get('pdpSections', {}).get('host', {})
            host_info = {
                'name': host.get('name', ''),
                'profile_pic': host.get('avatar', {}).get('url', ''),
                'superhost': host.get('isSuperhost', False),
                'response_rate': host.get('responseRate', 0),
                'host_since': host.get('memberSince', '')
            }
            return host_info
        except ValueError:
            host_name = response.css('div[data-section-id="host-profile"] h2::text').get() or ""
            return {
                'name': host_name.strip(),
                'superhost': False
            }
    
    def extract_max_guests(self, response, metadata):
        try:
            details = metadata.get('pdpSections', {}).get('details', {})
            return details.get('guestLabel', {}).get('value', 1)
        except ValueError:
            return 1
    
    def extract_bedrooms(self, response, metadata):
        try:
            details = metadata.get('pdpSections', {}).get('details', {})
            return details.get('bedroomLabel', {}).get('value', 1)
        except ValueError:
            return 1
    
    def extract_beds(self, response, metadata):
        try:
            details = metadata.get('pdpSections', {}).get('details', {})
            return details.get('bedLabel', {}).get('value', 1)
        except ValueError:
            return 1
    
    def extract_bathrooms(self, response, metadata):
        try:
            details = metadata.get('pdpSections', {}).get('details', {})
            return details.get('bathroomLabel', {}).get('value', 1)
        except ValueError:
            return 1
    
    def extract_amenities(self, response, metadata):
        try:
            amenities_section = metadata.get('pdpSections', {}).get('amenities', {})
            amenities = []
            
            for group in amenities_section.get('groups', []):
                for amenity in group.get('amenities', []):
                    amenities.append(amenity.get('title', ''))
            
            return amenities
        except ValueError:
            return response.css('div[data-section-id="amenities"] div::text').getall() or []
    
    def extract_images(self, response, metadata):
        try:
            photos = metadata.get('pdpSections', {}).get('photos', [])
            return [photo.get('url', '') for photo in photos]
        except ValueError:
            return response.css('img::attr(src)').getall() or []
    
    # HTML extraction fallbacks
    def extract_html_price(self, response):
        price_text = response.css(self.LISTING_PRICE_SELECTOR).get() or "0"
        price_text = re.search(r'\d+', price_text)
        return float(price_text.group()) if price_text else 0
    
    def extract_html_currency(self, response):
        price_text = response.css(self.LISTING_PRICE_SELECTOR).get() or "$0"
        currency_symbol = price_text[0] if price_text else "$"
        
        # Map common currency symbols to currency codes
        currency_map = {
            "$": "USD",
            "€": "EUR",
            "£": "GBP",
            "¥": "JPY",
            "₹": "INR",
            "A$": "AUD",
            "CA$": "CAD"
        }
        
        return currency_map.get(currency_symbol, "USD")
    
    def send_to_api(self, listing_data):
        """Send the scraped listing data to the Django API."""
        try:
            api_url = "http://localhost:8000/api/add_listing/"
            headers = {"Content-Type": "application/json"}
            
            # Create a properly structured payload for the API
            payload = {
                "title": listing_data.get('title', ''),
                "location": listing_data.get('location', ''),
                "address": listing_data.get('address', ''),
                "price_per_night": listing_data.get('price_per_night', 0),
                "currency": listing_data.get('currency', 'USD'),
                "total_price": listing_data.get('total_price', 0),
                "ratings": listing_data.get('ratings', 0),
                "reviews_count": listing_data.get('reviews_count', 0),
                "description": listing_data.get('description', ''),
                "property_type": listing_data.get('property_type', ''),
                "host": listing_data.get('host', {'name': 'Unknown Host'}),
                "max_guests": listing_data.get('max_guests', 1),
                "bedrooms": listing_data.get('bedrooms', 1),
                "beds": listing_data.get('beds', 1),
                "bathrooms": listing_data.get('bathrooms', 1),
                "amenities": listing_data.get('amenities', []),
                "images": listing_data.get('images', [])
            }
            
            response = requests.post(api_url, json=payload, headers=headers)
            
            if response.status_code == 201:
                self.logger.info(f"Successfully sent listing data to API: {listing_data.get('title')}")
            else:
                self.logger.error(f"Failed to send data to API. Status code: {response.status_code}, Response: {response.text}")
        
        except ValueError:
            self.logger.error("Error sending data to API")
        except TypeError:
            self.logger.error("Error sending data to API")
        except Exception as e:
            self.logger.error(f"Error sending data to API: {str(e)}")
