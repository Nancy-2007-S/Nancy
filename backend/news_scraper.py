import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
import random
from typing import List, Dict, Any

# Curated high-quality, generic YouTube "tech trailers" or long play tech videos
# To be used as the majestic background playing videos in the Prime Video-style slider.
CINEMATIC_TECH_VIDEOS = [
    "LXb3EKWsInQ", # Costa Rica 4K (generic beautiful background)
    "IUn6I68maDo", # Marques Brownlee (generic tech review vibe)
    "9l1nZ7qK16Q", # MKBHD Auto focus
    "Rj1uGZ1X_Vw", # TechLinked quick news format
    "D_uulZNNFO4"  # Generic tech data viz b-roll
]

def scrape_google_news(query: str = "technology", limit: int = 5) -> List[Dict[str, Any]]:
    """Scrapes Google News RSS feeds for tech news."""
    safe_query = urllib.parse.quote(query)
    url = f"https://news.google.com/rss/search?q={safe_query}&hl=en-IN&gl=IN&ceid=IN:en"

    results = []
    try:
        # Fetch the RSS feed XML data
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            xml_data = response.read()

        root = ET.fromstring(xml_data)
        items = root.findall('./channel/item')

        if not items:
            return results

        video_pool = CINEMATIC_TECH_VIDEOS.copy()
        random.shuffle(video_pool)

        for i, item in enumerate(items[:limit]):
            # Use random curated tech background loop or specific tech video ID for the carousel
            vid_id = video_pool[i % len(video_pool)]
            
            # Create a "pseudo AI" trivial true/false question based on this article
            title = item.find('title').text
            
            results.append({
                "id": str(i),
                "title": title,
                "link": item.find('link').text,
                "pub_date": item.find('pubDate').text,
                "video_id": vid_id,  # Prime-style trailer ID
            })
            
    except Exception as e:
        print(f"An error occurred while fetching news: {e}")
        
    return results

def generate_trivia_from_news(news_list: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Takes the top news item and generates a True/False trivia question for the streak checkin."""
    if not news_list:
        return {
            "question": "Is Artificial Intelligence considered a branch of computer science?",
            "is_true": True,
            "explanation": "Yes, AI is fundamentally a computer science discipline."
            }
        
    top_story = news_list[0]["title"]
    
    # Simple pseudo-logic: 70% chance it's literally the true headline
    # 30% chance we negate it or say "Did Google declare bankruptcy today?" (obvious false)
    if random.random() > 0.3:
        return {
            "question": f"According to today's news: '{top_story}'. Is this true?",
            "is_true": True,
            "explanation": f"Yes, this is an actual headline from today's tech news feed."
        }
    else:
        fake_headline = top_story.replace("Apple", "Microsoft").replace("Google", "Yahoo!").replace("Samsung", "Nokia")
        return {
            "question": f"According to today's news: '{fake_headline}'. Is this true?",
            "is_true": False,
            "explanation": f"False! The actual real headline was: '{top_story}'."
        }
