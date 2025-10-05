from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dummy_client import fetch_course_info
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"   # relax for local dev
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/needed_uniform")
def needed_uniform(
    course_id: int = Query(..., description="Course ID (1–10)"),
    target: float = Query(..., ge=0, le=100, description="Desired final grade in %")
):
    course = fetch_course_info(course_id)
    if not course:
        raise HTTPException(status_code=404, detail=f"Course {course_id} not found")

    result = needed_uniform_average(course, target)

    # If target not achievable, return only note + min & max possible
    if any(v < 0 or v > 100 for v in result["needed_future_averages"].values()):
        return {
            "note": "Not possible to achieve this target grade with remaining tasks",
            "min_possible_grade": result["min_possible_grade"],
            "max_possible_grade": result["max_possible_grade"]
        }

    return result


def needed_uniform_average(course, target):
    T = target / 100.0      # desired final grade as fraction
    A = 0.0                 # contribution from past work
    B = 0.0                 # remaining future work weight

    for cat, w in course["weights"].items():
        P = course["scores"].get(cat, 0)
        N = course["past_tasks"].get(cat, 0)
        M = course["future_tasks"].get(cat, 0)

        if N + M == 0:
            continue

        # Past contribution
        A += w * (P / 100.0) * (N / (N + M))
        # Future contribution
        B += w * (M / (N + M))

    # Compute min and max possible final grades
    max_possible = A + B * 1.0        # all future 100%
    min_possible = A + B * 0.0        # all future 0%
    max_possible_pct = round(max_possible * 100, 2)
    min_possible_pct = round(min_possible * 100, 2)

    if B == 0:
        return {
            "note": "No future work left",
            "original_category_scores": course["scores"],
            "task_breakdown": {
                cat: {
                    "completed": course["past_tasks"].get(cat, 0),
                    "remaining": course["future_tasks"].get(cat, 0)
                }
                for cat in course["weights"].keys()
            },
            "needed_future_averages": {},
            "projected_final_category_scores": course["scores"],
            "projected_final_grade": round(A * 100, 2),
            "min_possible_grade": min_possible_pct,
            "max_possible_grade": max_possible_pct
        }

    x = (T - A) / B
    x_pct = round(x * 100, 2)

    needed = {cat: x_pct for cat, M in course["future_tasks"].items() if M > 0}

    original_scores = {
        cat: round(course["scores"].get(cat, 0), 2)
        for cat in course["weights"].keys()
    }

    task_breakdown = {
        cat: {
            "completed": course["past_tasks"].get(cat, 0),
            "remaining": course["future_tasks"].get(cat, 0)
        }
        for cat in course["weights"].keys()
    }

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

    projected_final = round(
        sum(course["weights"][cat] * final_scores[cat] for cat in final_scores), 2
    )

    return {
        "original_category_scores": original_scores,
        "task_breakdown": task_breakdown,
        "needed_future_averages": needed,
        "projected_final_category_scores": final_scores,
        "projected_final_grade": projected_final,
        "max_possible_grade": max_possible_pct,
        "min_possible_grade": min_possible_pct
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)