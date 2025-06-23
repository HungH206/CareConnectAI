import requests
import base64
import os
#from dotenv import load_dotenv

# Load environment variables from .env file if it exists
#load_dotenv()

# Get credentials from environment variables or use defaults
client_id = "9DweO_xySRGSUAAv21taDw"
client_secret = "Yhgjd2tRAmcKP3OQagN8KD9Pq7YFah40"
account_id =  "5yQIRie9Q8OPSHX99KeU6Q"  # You need to set this

def get_access_token():
    """Get OAuth access token using account_credentials grant type"""
    # Create the authorization header
    auth_header = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
    
    response = requests.post(
        "https://zoom.us/oauth/token",
        headers={
            "Authorization": f"Basic {auth_header}",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data={
            "grant_type": "account_credentials",
            "account_id": account_id,
        }
    )
    
    if response.status_code == 200:
        data = response.json()
        print("✅ Access Token obtained")
        return data["access_token"]
    else:
        print("❌ Failed to get access token")
        print(f"Status: {response.status_code}, Response: {response.text}")
        return None

def get_user_id(access_token):
    """Get the first active user's ID"""
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }
    
    response = requests.get(
        "https://api.zoom.us/v2/users?status=active&page_size=1",
        headers=headers
    )
    
    if response.status_code == 200:
        users = response.json().get("users", [])
        if users:
            return users[0]["id"]
        else:
            print("❌ No active users found")
            return None
    else:
        print(f"❌ Failed to get users: {response.status_code} {response.text}")
        return None

def create_meeting(access_token, user_id):
    """Create a Zoom meeting for the specified user"""
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }

    meeting_data = {
        "topic": "CareConnect Video Consultation",
        "type": 2,  # Scheduled Meeting
        "duration": 30,
        "timezone": "America/Chicago",
        "settings": {
            "host_video": True,
            "participant_video": True,
            "join_before_host": True,
            "waiting_room": False
        }
    }
    
    response = requests.post(
        f"https://api.zoom.us/v2/users/{user_id}/meetings",
        headers=headers,
        json=meeting_data,
    )

    if response.status_code == 201:
        meeting = response.json()
        print("✅ Meeting created successfully!")
        print("✅ Join URL:", meeting["join_url"])
        print("✅ Meeting ID:", meeting["id"])
        return meeting
    else:
        print(f"❌ Meeting Creation Failed: {response.text}")
        return None

# Run it
if __name__ == "__main__":
    # Get access token
    access_token = get_access_token()
    if not access_token:
        print("Exiting: No access token available")
        exit(1)
    
    # Get user ID
    user_id = get_user_id(access_token)
    if not user_id:
        print("Exiting: No user ID available")
        exit(1)
    
    # Create meeting
    meeting = create_meeting(access_token, user_id)
    if meeting:
        print("Meeting created successfully!")