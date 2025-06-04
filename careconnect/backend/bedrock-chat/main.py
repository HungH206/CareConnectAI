# main.py
from handler import generate_conversation

if __name__ == "__main__":
    user_input = "Explain hypertension in simple terms"
    messages = [{
        "role": "user",
        "content": [{"text": user_input}]
    }]
    result = generate_conversation(messages)
    print(result)


    # Model Response and User Questions, Still work on Retieval and Training.