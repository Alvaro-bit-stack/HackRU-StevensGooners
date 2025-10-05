import random

COURSES = {
    1: {
        "name": "Math 101",
        "weights": { "homework": 0.20, "exam1": 0.25, "exam2": 0.25, "final": 0.30 },
        "scores":  { "homework": 85, "exam1": 78, "exam2": 0, "final": 0 },
        "past_tasks":  { "homework": random.randint(1,5), "exam1": 1, "exam2": 0, "final": 0 },
        "future_tasks":{ "homework": random.randint(1,5), "exam1": 0, "exam2": 1, "final": 1 }
    },
    2: {
        "name": "CS Programming",
        "weights": { "labs": 0.25, "projects": 0.30, "midterm": 0.20, "final": 0.25 },
        "scores":  { "labs": 90, "projects": 82, "midterm": 78, "final": 0 },
        "past_tasks":  { "labs": random.randint(1,5), "projects": random.randint(1,5), "midterm": 1, "final": 0 },
        "future_tasks":{ "labs": random.randint(1,5), "projects": random.randint(1,5), "midterm": 0, "final": 1 }
    },
    3: {
        "name": "Chemistry I",
        "weights": { "homework": 0.15, "labs": 0.25, "midterm": 0.20, "final": 0.25, "quizzes": 0.15 },
        "scores":  { "homework": 80, "labs": 75, "midterm": 72, "final": 0, "quizzes": 68 },
        "past_tasks":  { "homework": random.randint(1,5), "labs": random.randint(1,5), "midterm": 1, "final": 0, "quizzes": random.randint(1,5) },
        "future_tasks":{ "homework": random.randint(1,5), "labs": random.randint(1,5), "midterm": 0, "final": 1, "quizzes": random.randint(1,5) }
    },
    4: {
        "name": "Physics I",
        "weights": { "homework": 0.15, "quizzes": 0.15, "exam1": 0.20, "exam2": 0.20, "final": 0.30 },
        "scores":  { "homework": 82, "quizzes": 75, "exam1": 68, "exam2": 0, "final": 0 },
        "past_tasks":  { "homework": random.randint(1,5), "quizzes": random.randint(1,5), "exam1": 1, "exam2": 0, "final": 0 },
        "future_tasks":{ "homework": random.randint(1,5), "quizzes": random.randint(1,5), "exam1": 0, "exam2": 1, "final": 1 }
    },
    5: {
        "name": "English Composition",
        "weights": { "essays": 0.40, "midterm": 0.20, "final": 0.20, "participation": 0.10, "presentations": 0.10 },
        "scores":  { "essays": 85, "midterm": 80, "final": 0, "participation": 92, "presentations": 50 },
        "past_tasks":  { "essays": random.randint(1,5), "midterm": 1, "final": 0, "participation": random.randint(1,5), "presentations": random.randint(1,5) },
        "future_tasks":{ "essays": random.randint(1,5), "midterm": 0, "final": 1, "participation": 0, "presentations": random.randint(1,5) }
    },
    6: {
        "name": "History 201",
        "weights": { "quizzes": 0.15, "essays": 0.20, "midterm": 0.25, "final": 0.25, "projects": 0.15 },
        "scores":  { "quizzes": 78, "essays": 80, "midterm": 72, "final": 0, "projects": 85 },
        "past_tasks":  { "quizzes": random.randint(1,5), "essays": random.randint(1,5), "midterm": 1, "final": 0, "projects": random.randint(1,5) },
        "future_tasks":{ "quizzes": random.randint(1,5), "essays": random.randint(1,5), "midterm": 0, "final": 1, "projects": random.randint(1,5) }
    },
    7: {
        "name": "Psychology",
        "weights": { "homework": 0.15, "projects": 0.25, "midterm": 0.20, "final": 0.20, "labs": 0.20 },
        "scores":  { "homework": 88, "projects": 83, "midterm": 76, "final": 0, "labs": 74 },
        "past_tasks":  { "homework": random.randint(1,5), "projects": random.randint(1,5), "midterm": 1, "final": 0, "labs": random.randint(1,5) },
        "future_tasks":{ "homework": random.randint(1,5), "projects": random.randint(1,5), "midterm": 0, "final": 1, "labs": random.randint(1,5) }
    },
    8: {
        "name": "Sociology",
        "weights": { "quizzes": 0.15, "group_project": 0.20, "midterm": 0.20, "final": 0.25, "assignments": 0.20 },
        "scores":  { "quizzes": 82, "group_project": 85, "midterm": 77, "final": 0, "assignments": 80 },
        "past_tasks":  { "quizzes": random.randint(1,5), "group_project": random.randint(1,5), "midterm": 1, "final": 0, "assignments": random.randint(1,5) },
        "future_tasks":{ "quizzes": random.randint(1,5), "group_project": random.randint(1,5), "midterm": 0, "final": 1, "assignments": random.randint(1,5) }
    },
    9: {
        "name": "Biology",
        "weights": { "labs": 0.20, "quizzes": 0.15, "midterm": 0.20, "final": 0.25, "fieldwork": 0.20 },
        "scores":  { "labs": 79, "quizzes": 75, "midterm": 74, "final": 0, "fieldwork": 70 },
        "past_tasks":  { "labs": random.randint(1,5), "quizzes": random.randint(1,5), "midterm": 1, "final": 0, "fieldwork": random.randint(1,5) },
        "future_tasks":{ "labs": random.randint(1,5), "quizzes": random.randint(1,5), "midterm": 0, "final": 1, "fieldwork": random.randint(1,5) }
    },
    10: {
        "name": "Business Intro",
        "weights": { "assignments": 0.25, "midterm": 0.20, "final": 0.25, "projects": 0.20, "presentations": 0.10 },
        "scores":  { "assignments": 82, "midterm": 73, "final": 0, "projects": 75, "presentations": 85 },
        "past_tasks":  { "assignments": random.randint(1,5), "midterm": 1, "final": 0, "projects": random.randint(1,5), "presentations": random.randint(1,5) },
        "future_tasks":{ "assignments": random.randint(1,5), "midterm": 0, "final": 1, "projects": random.randint(1,5), "presentations": random.randint(1,5) }
    }
}

def fetch_course_info(course_id: int):
    return COURSES.get(course_id)