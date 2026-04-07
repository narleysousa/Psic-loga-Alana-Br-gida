import urllib.request
import re
import json

url = "https://www.picuki.com/profile/alanabrigidapsico"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    matches = re.findall(r'<div class="photo">\s*<a href="([^"]+)".*?><img src="([^"]+)"', html)
    print(f"Found {len(matches)} photos")
    # Actually picuki layout: <img src="URL" class="post-image" alt="...">
    # Let's try a simpler regex
    matches2 = re.findall(r'<img src="([^"]+)"[^>]*class="post-image"', html)
    print(matches2)
except Exception as e:
    print(e)
