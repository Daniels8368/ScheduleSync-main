def handle_message(user_input):
    if "study" in user_input.lower():
        return "Got it! When do you want to study?"
    elif "upload" in user_input.lower():
        return "Sure, upload your .ics file here!"
    elif "grade" in user_input.lower():
        return "Send me your grades and I’ll suggest a better study plan."
    elif "tired" in user_input.lower() or "break" in user_input.lower():
        return "Remember to take care of yourself! Want to block a self-care session?"
    else:
        return "I can help with schedules, study suggestions, or life balance!"