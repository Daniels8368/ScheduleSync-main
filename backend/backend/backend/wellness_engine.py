def suggest_balance(user_data):
    tips = []
    if user_data.get("likes_gym"):
        tips.append("💪 Gym is free Thursday afternoon!")
    if user_data.get("overworked"):
        tips.append("🧘 Schedule a short break and some deep breathing time.")
    if user_data.get("clubs"):
        tips.append("🎓 ACM has an event Friday 6PM. Interested?")
    return {"tips": tips}