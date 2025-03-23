import openai
import os
from dotenv import load_dotenv

load_dotenv()  # Load from .env

openai.api_key = os.getenv("OPENAI_API_KEY")

def handle_message(user_input):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # or "gpt-4" if you have access
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a smart academic coach chatbot. "
                        "Help college students manage study time, plan schedules, "
                        "balance wellness, and stay motivated. Be casual, friendly, and clear."
                    ),
                },
                {"role": "user", "content": user_input},
            ],
            temperature=0.7,
            max_tokens=200
        )
        return response['choices'][0]['message']['content']
    except Exception as e:
        return f"⚠️ Error contacting OpenAI: {str(e)}"
