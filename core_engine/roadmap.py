from collections import deque
from typing import List, Dict, Any, Set
from core_engine.knowledge_base import DAG_DEPENDENCIES, SKILL_TIERS  # type: ignore

from core_engine.models import UserProfile  # type: ignore

def generate_roadmap(required_skills: List[str], completed_skills: List[str] = [], concise: bool = False) -> List[str]:
    """Generates a personalized topological sorted roadmap."""
    user_completed = set([s.lower() for s in completed_skills])
    if not required_skills:
        return []

    local_graph: Dict[str, List[str]] = {}
    in_degree: Dict[str, int] = {}
    nodes_to_include = set()

    def add_node_and_prereqs(node: str):
        if node in nodes_to_include: return
        
        # If concise mode is ON, we skip completed skills that are marked as 'Basic'
        # UNLESS they are explicitly part of the required_skills for the role
        is_basic = SKILL_TIERS.get(node) == "Basic"
        if concise and is_basic and node.lower() in user_completed and node not in required_skills:
            return

        nodes_to_include.add(node)
        
        if node not in local_graph: local_graph[node] = []
        if node not in in_degree: in_degree[node] = 0

        prereqs = DAG_DEPENDENCIES.get(node, [])
        for p in prereqs:
            # Recursively try to add prereqs
            add_node_and_prereqs(p)
            
            # Only add the edge if both nodes are in the included set
            if node in nodes_to_include and p in nodes_to_include:
                if node not in local_graph[p]: # Avoid duplicates
                    local_graph[p].append(node)
                    in_degree[node] += 1

    for skill in required_skills:
        add_node_and_prereqs(skill)

    for node in nodes_to_include:
        if node not in in_degree: in_degree[node] = 0

    queue = deque(sorted([node for node in nodes_to_include if in_degree.get(node, 0) == 0])) # type: ignore
    roadmap = []

    while queue:
        current = queue.popleft()
        roadmap.append(current)
        for neighbor in sorted(local_graph.get(current, [])): # type: ignore
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    if len(roadmap) != len(nodes_to_include):
        raise ValueError("Cycle detected in the skill prerequisites DAG.")
    
    return roadmap

def get_next_step(user_profile: UserProfile, roadmap: List[str]) -> str:
    user_skills = set([s.lower() for s in user_profile.skills])
    for skill in roadmap:
        if skill.lower() not in user_skills: return skill
    return "All steps completed!"

def smart_unlock_status(user_profile: UserProfile, roadmap: List[str]) -> Dict[str, str]:
    status: Dict[str, str] = {}
    user_skills = set([s.lower() for s in user_profile.skills])
    for skill in roadmap:
        if skill.lower() in user_skills:
            status[skill] = "Completed"
        else:
            prereqs = DAG_DEPENDENCIES.get(skill, [])
            is_unlocked = True
            for p in prereqs:
                if p.lower() not in user_skills:
                    is_unlocked = False
                    break
            status[skill] = "Unlocked" if is_unlocked else "Locked"
    return status

def generate_alternate_path(roadmap: List[str], skipped_skill: str) -> List[str]:
    return [skill for skill in roadmap if skill != skipped_skill]
