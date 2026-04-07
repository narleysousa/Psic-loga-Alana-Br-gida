import urllib.request
import re
import json

url = "https://www.instagram.com/alanabrigidapsico/"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10._15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'})

try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    # look for display_url in html
    matches = re.findall(r'"display_url":"([^"]+)"', html)
    
    unique_urls = []
    for m in matches:
        # replace unicode escapes
        u = m.replace('\\u0026', '&')
        if u not in unique_urls and 's150x150' not in u: # avoid tiny thumbnails if possible
            unique_urls.append(u)
    
    print(f"Found {len(unique_urls)} display urls")
    for i, u in enumerate(unique_urls[:8]):
        print(f"Downloading {i}...")
        try:
            urllib.request.urlretrieve(u, f"assets/photos/insta-feed/real_{i}.jpg")
        except Exception as e:
            print("Failed to dl:", e)
except Exception as e:
    print("Error:", e)
