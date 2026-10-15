from pydantic import BaseModel
from typing import List

class Task(BaseModel):
    id: str
    title: str
    description: str
    time_estimate: str
    deliverable: str
    completed: bool = False

class Phase(BaseModel):
    phase_number: int
    title: str
    tasks: List[Task]

class PlanResponse(BaseModel):
    project_title: str
    total_time_estimate: str
    phases: List[Phase]

class PlanRequest(BaseModel):
    prompt: str