import urllib.parse
from functools import lru_cache
from typing import List, Dict, Any, Optional
from apify_client import ApifyClient
import concurrent.futures
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

APIFY_TOKEN = os.getenv("APIFY_TOKEN", "")

def _fetch_from_apify(career_goal: str, location: str) -> List[Dict[str, Any]]:
    client = ApifyClient(APIFY_TOKEN)
    actor_id = "worldunboxer/rapid-linkedin-scraper"
    run_input = {
        "job_title": career_goal,
        "location": location,
        "jobs_entries": 5,
        "experience_level": "1",  # Internship
        "job_type": "I"           # Internship
    }
    run = client.actor(actor_id).call(run_input=run_input)
    items = list(client.dataset(run['defaultDatasetId']).iterate_items())
    
    dynamic_offers = []
    for item in items:
        title = item.get('title') or item.get('job_title') or "Internship Role"
        company = item.get('company_name') or item.get('companyName') or "Private"
        url = item.get('job_url') or item.get('url') or ""
        
        dynamic_offers.append({
            "type": "Internship",
            "name": title[:40] + "..." if len(title) > 40 else title,
            "company": company,
            "location": item.get('location') or location,
            "url": url
        })
        if len(dynamic_offers) >= 5:
            break
    return dynamic_offers

@lru_cache(maxsize=16)
def get_dynamic_internships(career_goal: str, location: str = "United States") -> List[Dict[str, Any]]:
    print(f"--- FETCHING DYNAMIC LINKEDIN INTERNSHIPS FOR {career_goal} via APIFY ---")
    try:
        with concurrent.futures.ThreadPoolExecutor() as executor:
            future = executor.submit(_fetch_from_apify, career_goal, location)
            # Give Apify maximum 12 seconds to respond, otherwise fail gracefully
            return future.result(timeout=12)
    except concurrent.futures.TimeoutError:
        print(f"Apify Timeout! Scraping {career_goal} took too long. Falling back to hardcoded.")
        return []
    except Exception as e:
        print(f"Apify Error: {e}")
        return []

UDEMY_APIFY_TOKEN = os.getenv("UDEMY_APIFY_TOKEN", "")

def fetch_top_udemy_course(topic: str) -> Optional[str]:
    """Uses Apify to find the specific top course URL for a given topic."""
    try:
        client = ApifyClient(UDEMY_APIFY_TOKEN)
        actor_id = "fatihtahta/udemy-scraper"
        
        encoded_topic = urllib.parse.quote(topic)
        udemy_url = f"https://www.udemy.com/courses/search/?q={encoded_topic}&price=price-free"
        
        run_input = {
            "startUrls": [{"url": udemy_url}],
            "queries": [topic],
            "maxItems": 1,
            "maxPages": 1
        }
        
        run = client.actor(actor_id).call(run_input=run_input, timeout_secs=10)
        items = list(client.dataset(run['defaultDatasetId']).iterate_items())
        
        if items:
            item = items[0]
            raw_url = item.get('url') or item.get('course_url') or item.get('Published_Url')
            if raw_url and not str(raw_url).startswith("http"):
                raw_url = f"https://www.udemy.com{raw_url}"
            return raw_url
    except Exception as e:
        print(f"Udemy Scraper Error for {topic}: {e}")
    return None

def enhance_certifications_with_udemy(certifications: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Fetches real Udemy course URLs for certifications using parallel execution."""
    print(f"--- ENHANCING {len(certifications)} CERTIFICATIONS WITH DYNAMIC UDEMY LINKS ---")
    
    def get_url(cert):
        topic = cert["name"]
        dynamic_url = fetch_top_udemy_course(topic)
        if dynamic_url:
            return topic, dynamic_url
        # Fallback to generic search
        query = urllib.parse.quote(topic)
        return topic, f"https://www.udemy.com/courses/search/?q={query}"

    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
        results = list(executor.map(get_url, certifications))
        
    url_map = dict(results)
    for cert in certifications:
        cert["url"] = url_map.get(cert["name"], cert.get("url"))
        
    return certifications
