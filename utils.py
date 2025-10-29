import os
import requests
from math import radians, sin, cos, sqrt, atan2

# 🌍 Haversine formula to calculate distance between two lat/lon points (in km)
def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371.0  # Earth's radius in km
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c


# 🏥 Find nearby doctors using Google Places API
def find_nearby_doctors(lat, lon, radius=5000, limit=5):
    """
    Find real nearby doctors using Google Places API.
    - lat, lon: user's latitude & longitude
    - radius: search radius in meters (default 5000 = 5km)
    - limit: number of results to return
    """
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("⚠️ GOOGLE_API_KEY not found in environment.")
        return []

    # Google Places Nearby Search API endpoint
    url = (
        f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?"
        f"location={lat},{lon}&radius={radius}&keyword=doctor&key={api_key}"
    )

    try:
        response = requests.get(url)
        data = response.json()
        results = data.get("results", [])
        doctors = []

        for place in results[:limit]:
            location = place.get("geometry", {}).get("location", {})
            doctor = {
                "name": place.get("name"),
                "address": place.get("vicinity"),
                "lat": location.get("lat"),
                "lon": location.get("lng"),
                "rating": place.get("rating"),
                "user_ratings_total": place.get("user_ratings_total"),
                "place_id": place.get("place_id"),
                "maps_url": f"https://www.google.com/maps/place/?q=place_id:{place.get('place_id')}",
            }
            doctors.append(doctor)

        return doctors

    except Exception as e:
        print(f"❌ Google Places API error: {e}")
        return []
