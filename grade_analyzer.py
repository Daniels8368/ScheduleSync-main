def analyze_grades(grades):
    recommendations = []
    for course, grade in grades.items():
        if grade.startswith("A"):
            recommendations.append(f"✅ {course} is going great! Keep it up.")
        elif grade.startswith("B"):
            recommendations.append(f"📘 {course} could use moderate review.")
        else:
            recommendations.append(f"⚠️ {course} needs attention. Let’s schedule extra study.")
    return {"recommendations": recommendations}