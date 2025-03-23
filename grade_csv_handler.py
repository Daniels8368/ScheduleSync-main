import csv
import io

def parse_csv_grades(file):
    grades = {}
    stream = io.StringIO(file.stream.read().decode("utf-8"))
    reader = csv.DictReader(stream)
    for row in reader:
        course = row.get("Course")
        grade = row.get("Grade")
        if course and grade:
            grades[course] = grade
    return grades