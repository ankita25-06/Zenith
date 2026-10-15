import os
import json
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", "YOUR_API_KEY"))

SYSTEM_PROMPT = """
You are Zenith, an expert AI Student Co-Pilot & Master Planner.
Your goal is to break down any project, exam topic, or hackathon goal into a structured, sequential action plan.

Requirements:
1. Divide the project into 3 logical phases (e.g., Phase 1: Foundation, Phase 2: Core Logic, Phase 3: Polish).
2. Each phase must contain 2 to 4 concrete sub-tasks.
3. Every task MUST have a realistic time estimate (e.g., '45m', '1.5h') and an explicit deliverable (e.g., 'Deliverable: FastAPI main.py setup').
4. Return ONLY valid JSON matching the exact schema specified.
"""

def generate_master_plan(user_prompt: str) -> dict:
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Create a structured master plan for: {user_prompt}\n\n"
                                           "Respond with JSON containing keys: project_title, total_time_estimate, phases. "
                                           "Each phase should have phase_number, title, and tasks. "
                                           "Each task should have id, title, description, time_estimate, deliverable."}
            ],
            temperature=0.7,
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Error calling LLM: {e}")
        # Fallback response for testing offline
        return {
            "project_title": f"Plan: {user_prompt[:30]}...",
            "total_time_estimate": "3h 30m",
            "phases": [
                {
                    "phase_number": 1,
                    "title": "Foundation & Setup",
                    "tasks": [
                        {"id": "t1", "title": "Environment Setup", "description": "Configure dev environment and dependencies.", "time_estimate": "30m", "deliverable": "Deliverable: Working backend server", "completed": False}
                    ]
                },
                {
                    "phase_number": 2,
                    "title": "Core Implementation",
                    "tasks": [
                        {"id": "t2", "title": "Build Core Features", "description": "Develop main API endpoints and UI components.", "time_estimate": "1.5h", "deliverable": "Deliverable: Functional API routes", "completed": False}
                    ]
                },
                {
                    "phase_number": 3,
                    "title": "Testing & Polish",
                    "tasks": [
                        {"id": "t3", "title": "UI Refinement", "description": "Add dark mode, responsive styling, and loading states.", "time_estimate": "45m", "deliverable": "Deliverable: Final UI deployment", "completed": False}
                    ]
                }
            ]
        }