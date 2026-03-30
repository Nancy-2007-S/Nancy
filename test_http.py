import urllib.request
import json

url = 'http://localhost:8000/api/process'
data = {'skills': ['Python'], 'career_goal': 'Data Scientist', 'concise': False}
req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode())
        print("HTTP Response OK.")
        print("Keys:", result.keys())
        if 'roadmap' in result:
            print("Roadmap length:", len(result['roadmap']))
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code, e.read().decode())
except Exception as e:
    print("Error:", str(e))
