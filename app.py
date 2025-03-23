from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json

# Temporary stub functions to replace the imported modules
# Replace these with your actual implementation when ready
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
def analyze_ics(file):
    # Simple stub to confirm file was received
    filename = file.filename if file else "No file"
    return {"status": "received", "filename": filename, "events": ["Event 1", "Event 2"]}

def generate_ics(event_details):
    # Simple stub
    return "/download/event123.ics"

def analyze_grades(grades):
    # Simple stub
    suggestions = []
    for course, grade in grades.items():
        suggestions.append(f"For {course} with grade {grade}: Keep up the good work!" if float(grade) >= 80 else f"For {course} with grade {grade}: Consider getting help")
    return {"recommendations": suggestions}

def suggest_balance(user_data):
    # Simple stub
    return {"tips": ["Balance study and rest", "Exercise regularly"]}

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/chat', methods=['GET', 'POST', 'OPTIONS'])
def chat():
    if request.method == 'GET':
        return jsonify({"status": "Backend is running"})
    elif request.method == 'POST':
        user_input = request.json.get('message', '')
        response = handle_message(user_input)
        return jsonify({'response': response})
    return jsonify({"status": "OK"})  # For OPTIONS

@app.route('/upload-calendar', methods=['POST', 'OPTIONS'])
def upload_calendar():
    if request.method == 'OPTIONS':
        return jsonify({"status": "OK"})
        
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
        
    analysis = analyze_ics(file)
    return jsonify(analysis)

@app.route('/download-event', methods=['POST', 'OPTIONS'])
def download_event():
    if request.method == 'OPTIONS':
        return jsonify({"status": "OK"})
        
    event_details = request.json
    ics_file = generate_ics(event_details)
    return jsonify({'ics_link': ics_file})

@app.route('/submit-grades', methods=['POST', 'OPTIONS'])
def submit_grades():
    if request.method == 'OPTIONS':
        return jsonify({"status": "OK"})
        
    grades = request.json.get('grades', {})
    suggestions = analyze_grades(grades)
    return jsonify(suggestions)

@app.route('/wellness-check', methods=['POST', 'OPTIONS'])
def wellness_check():
    if request.method == 'OPTIONS':
        return jsonify({"status": "OK"})
        
    user_data = request.json
    tips = suggest_balance(user_data)
    return jsonify(tips)

if __name__ == '__main__':
    app.run(debug=True, port=5000)