import os
import json
import pandas as pd
import numpy as np

from django.core.exceptions import ObjectDoesNotExist
from django.conf import settings
from .models import Career, Skill

from google import genai
from google.genai import types

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Load embedding model
hf_token = os.getenv("HF_TOKEN")
print("Loading Hugging Face model (all-MiniLM-L6-v2)...")
embedding_model = SentenceTransformer("all-MiniLM-L6-v2", token=hf_token)

# Gemini client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def get_cleaned_data_path():
    return os.path.join(settings.BASE_DIR, 'data', 'cleaned_tech_skills2.csv')


def generate_study_plan_with_gemini(missing_skills, target_role, experience_tier):
    """
    Uses Gemini to generate skill-focused learning modules for detected skill gaps.
    """

    if not missing_skills:
        return {
            "message": "You already have all the required skills for this role!"
        }

    prompt = f"""
You are an expert software engineering career mentor for SkillMap AI.

Candidate Profile:
- Target Role: {target_role}
- Experience Level: {experience_tier}
- Missing Skills / Gaps: {", ".join(missing_skills)}

Create a targeted skill gap bridge. For EACH missing skill listed above, create a distinct learning module. Do NOT constrain this to a fixed time frame (e.g. 4 weeks). Instead, focus on actionable mastery for each skill gap.

Requirements:
1. Provide a clear core objective for mastering each skill.
2. Recommend 2 distinct learning options for each skill (e.g., structured course vs. hands-on tutorial/docs).
3. Include a practical hands-on project or action item to demonstrate competency.
4. Recommend only well-known resources (MDN, freeCodeCamp, Official Docs, Coursera, Udemy, CS50, YouTube, Microsoft Learn).

Return ONLY valid JSON matching this exact structure:

{{
  "roadmap": [
    {{
      "focus": "Skill Name",
      "objective": "Core learning objective and key concepts to master.",
      "resources": [
        {{
          "title": "Resource Name",
          "platform": "Platform Name (e.g., Coursera, Official Docs, YouTube)",
          "description": "Brief description of what this option covers."
        }},
        {{
          "title": "Alternative Resource Name",
          "platform": "Platform Name",
          "description": "Brief description of what this option covers."
        }}
      ],
      "action_items": [
        "Build a hands-on project demonstrating this skill"
      ]
    }}
  ]
}}
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.4,
            ),
        )

        return json.loads(response.text)

    except Exception as e:
        print("⚠️ Gemini Error / Rate Limit Hit:", e)
        print("🔄 Generating Dynamic Fallback Roadmap...")

        # DYNAMIC FALLBACK: If the API fails, we dynamically build a roadmap
        # using the actual missing skills detected by your local embedding model!
        fallback_roadmap = []
        for skill in missing_skills:
            formatted_skill = str(skill).title()
            fallback_roadmap.append({
                "focus": formatted_skill,
                "objective": f"Master the core concepts and practical application of {formatted_skill}.",
                "resources": [
                    {
                        "title": f"Official {formatted_skill} Documentation",
                        "platform": "Official Docs",
                        "description": "Read the official documentation to understand the fundamentals."
                    },
                    {
                        "title": f"{formatted_skill} Crash Course",
                        "platform": "YouTube",
                        "description": "Watch a comprehensive beginner tutorial to get hands-on quickly."
                    }
                ],
                "action_items": [
                    f"Build a small, self-contained project integrating {formatted_skill} to demonstrate competency."
                ]
            })

        # Return the exact structure React is expecting
        return {
            "roadmap": fallback_roadmap
        }


def get_career_roadmap(target_title, experience_level, user_skills):
    """
    Compares user skills against target career requirements using the Django Database,
    then leverages Gemini to generate a personalized learning roadmap.
    """
    try:
        career = Career.objects.get(
            title__iexact=target_title,
            experience_level__iexact=experience_level
        )
    except ObjectDoesNotExist:
        return {"error": f"Career '{target_title}' at '{experience_level}' level not found in the database."}

    # 2. Get all required skills linked to this career via the CareerSkill mapping table
    required_skills_query = career.required_skills.select_related('skill').all()
    required_skills = [cs.skill.name.lower().strip() for cs in required_skills_query]

    if not required_skills:
        return {"error": f"No skills have been assigned to '{target_title}' in the database yet."}

    # 3. Compare against User Skills
    if not user_skills:
        missing_skills = required_skills
        overall_match = 0
        already_known_or_similar = []
    else:
        user_embeddings = embedding_model.encode(user_skills)
        required_embeddings = embedding_model.encode(required_skills)
        similarity_matrix = cosine_similarity(required_embeddings, user_embeddings)

        missing_skills = []
        match_scores = []

        for i, req_skill in enumerate(required_skills):
            best_match_score = np.max(similarity_matrix[i])
            match_scores.append(best_match_score)

            if best_match_score < 0.65:
                missing_skills.append(req_skill)

        overall_match = round(np.mean(match_scores) * 100)
        already_known_or_similar = [s for s in required_skills if s not in missing_skills]

    # 4. Generate the Roadmap using Gemini (or the dynamic fallback if it fails)
    study_plan = generate_study_plan_with_gemini(missing_skills, target_title, experience_level)

    return {
        "target_role": career.title,
        "experience_tier": experience_level,
        "match_percentage": overall_match,
        "missing_skills": missing_skills,
        "already_known_or_similar": already_known_or_similar,
        "study_plan": study_plan
    }