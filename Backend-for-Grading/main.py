from fastapi import FastAPI, Query
from dummy_client import fetch_course_info

app = FastAPI()

@app.get("/needed_uniform")
def needed_uniform(
    course_id: int = Query(..., description="Course ID"),
    target: int = Query(..., le=100, ge=0, description="Desired final grade in %")
):
    course = fetch_course_info(course_id)

    result = needed_uniform_average(course, target)

    return result

def needed_uniform_average(course, target):
    # target final grade as a fraction (0–1)
    T = target / 100.0

    # contribution from all past work
    A = 0.0

    # effective combined weight of all future work
    B = 0.0

        # --- Loop through each category in the course ---
    for category, w_c in course["weights"].items():
        # current average for already-graded items in this category (0–100)
        P_c = course["scores"].get(category, 0)

        # number of past items already graded
        N_c = course["past_tasks"].get(category, 0)

        # number of future items still to come
        M_c = course["future_tasks"].get(category, 0)

        # skip if the category has no items at all
        if N_c + M_c == 0:
            continue

                # contribution from the already-graded part of this category
        # (convert P_c to fraction by dividing by 100)
        past_contrib = w_c * (P_c / 100.0) * (N_c / (N_c + M_c))
        A += past_contrib

        # how much of the course grade is still "unlocked" by future work
        future_weight = w_c * (M_c / (N_c + M_c))
        B += future_weight

    if B == 0:
        return {
            "note": "No future work left",
            "projected_final_grade": round(A * 100, 2)
        }

    x = (T - A) / B
    x_pct = round(x * 100, 2)

    # Needed future averages for each category
    needed = {cat: x_pct for cat, M in course["future_tasks"].items() if M > 0}

    # Original scores for each category
    original_scores = {
        cat: round(course["scores"].get(cat, 0), 2)
        for cat in course["weights"].keys()
    }

    # Task breakdown (past vs future)
    task_breakdown = {
        cat: {
            "completed": course["past_tasks"].get(cat, 0),
            "remaining": course["future_tasks"].get(cat, 0)
        }
        for cat in course["weights"].keys()
    }

    # Projected final scores if user hits x_pct on all remaining work
    final_scores = {}
    for cat, w in course["weights"].items():
        N = course["past_tasks"].get(cat, 0)
        M = course["future_tasks"].get(cat, 0)
        P = course["scores"].get(cat, 0)

        if N + M == 0:
            continue

        if M == 0:
            final_scores[cat] = round(P, 2)
        else:
            final_scores[cat] = round((P * N + x_pct * M) / (N + M), 2)

    # Compute projected final grade
    projected_final = round(
        sum(course["weights"][cat] * final_scores[cat] for cat in final_scores), 2
    )

    return {
        "original_category_scores": original_scores,
        "task_breakdown": task_breakdown,
        "needed_future_averages": needed,
        "projected_final_category_scores": final_scores,
        "projected_final_grade": projected_final
    }    
