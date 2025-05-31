from handler import chat_with_claude

if __name__ == "__main__":
    user_input = "Explain hypertension in simple terms"
    result = chat_with_claude(user_input)
    print("Bot:", result)
