import requests # type: ignore

def send_sms_alert(to_number: str, message: str):
    url = "https://api.devedge.t-mobile.com/sms/v1/messages"
    headers = {
        "Authorization": f"Bearer {YOUR_ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "to": to_number,
        "message": message
    }
    res = requests.post(url, json=payload, headers=headers)
    return res.status_code, res.json()
