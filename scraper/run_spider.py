import scrapy
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from airbnb_scraper.spiders.airbnb import AirbnbSpider
import argparse
from datetime import datetime, timedelta

def main():
    # Parse command-line arguments
    parser = argparse.ArgumentParser(description='Run Airbnb Spider')
    parser.add_argument('--location', type=str, default='New York', help='Location to search for listings')
    parser.add_argument('--checkin', type=str, help='Check-in date (YYYY-MM-DD)')
    parser.add_argument('--checkout', type=str, help='Check-out date (YYYY-MM-DD)')
    parser.add_argument('--guests', type=str, default='2', help='Number of guests')
    
    args = parser.parse_args()
    
    # Set default dates if not provided
    if not args.checkin:
        args.checkin = datetime.now().strftime('%Y-%m-%d')
    
    if not args.checkout:
        checkout_date = datetime.now() + timedelta(days=5)
        args.checkout = checkout_date.strftime('%Y-%m-%d')
    
    # Get the project settings
    settings = get_project_settings()
    
    # Initialize the crawler process with the settings
    process = CrawlerProcess(settings)
    
    # Start the spider with the provided arguments
    process.crawl(
        AirbnbSpider,
        location=args.location,
        checkin=args.checkin,
        checkout=args.checkout,
        guests=args.guests
    )
    
    # Start the crawling process
    process.start()

if __name__ == '__main__':
    main() 