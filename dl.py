import instaloader
import os

L = instaloader.Instaloader()
print("Starting download...")
try:
    profile = instaloader.Profile.from_username(L.context, "alanabrigidapsico")
    posts = profile.get_posts()
    count = 1
    os.makedirs("assets/photos/insta-feed", exist_ok=True)
    for post in posts:
        if count > 8: break
        if not post.is_video:
            target = f"assets/photos/insta-feed/insta_{count}.jpg"
            L.download_pic(target, post.url, post.date_utc)
            print(f"Saved {target}")
            count += 1
except Exception as e:
    print(f"Failed: {e}")
print("Done")
