from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot_logic import handle_message
from calendar_handler import generate_ics, analyze_ics
from grade_analyzer import analyze_grades
from wellness_engine import suggest_balance

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json['message']
    response = handle_message(user_input)
    return jsonify({'response': response})

@app.route('/upload-calendar', methods=['POST'])
def upload_calendar():
    file = request.files['file']
    analysis = analyze_ics(file)
    return jsonify(analysis)

@app.route('/download-event', methods=['POST'])
def download_event():
    event_details = request.json
    ics_file = generate_ics(event_details)
    return jsonify({'ics_link': ics_file})

@app.route('/submit-grades', methods=['POST'])
def submit_grades():
    grades = request.json['grades']
    suggestions = analyze_grades(grades)
    return jsonify(suggestions)

@app.route('/wellness-check', methods=['POST'])
def wellness_check():
    user_data = request.json
    tips = suggest_balance(user_data)
    return jsonify(tips)

if __name__ == '__main__':
    app.run(debug=True)