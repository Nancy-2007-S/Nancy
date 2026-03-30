import sys
import os
sys.path.append(os.getcwd())
from core_engine.knowledge_base import ROLES, SKILL_TIERS, DAG_DEPENDENCIES, SKILL_DESCRIPTIONS, SKILL_DETAILS, MILESTONES

missing_tiers = []
missing_deps = []
missing_desc = []
missing_details = []

for role, skills in ROLES.items():
    if role not in MILESTONES: print(f"Missing milestone for {role}")
    for skill in skills:
        if skill not in SKILL_TIERS: missing_tiers.append(skill)
        if skill not in DAG_DEPENDENCIES: missing_deps.append(skill)
        if skill not in SKILL_DESCRIPTIONS: missing_desc.append(skill)
        if skill not in SKILL_DETAILS: missing_details.append(skill)

print('Missing Tiers:', set(missing_tiers))
print('Missing Deps:', set(missing_deps))
print('Missing Desc:', set(missing_desc))
print('Missing Details:', set(missing_details))
