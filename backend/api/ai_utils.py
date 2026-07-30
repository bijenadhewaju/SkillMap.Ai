import os
import json
import requests
import math

from django.core.exceptions import ObjectDoesNotExist
from django.conf import settings
from .models import Career, Skill

from google import genai
from google.genai import types

# HUGGING FACE API SETUP
HF_TOKEN = os.getenv("HF_TOKEN")
HF_API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"


def get_embeddings(text_list):
    """Fetches embeddings remotely to save server memory."""
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    response = requests.post(HF_API_URL, headers=headers, json={"inputs": text_list})

    if response.status_code != 200:
        print(f"Hugging Face API Error: {response.text}")
        return []

    return response.json()


def calculate_cosine_similarity(vec1, vec2):
    """Calculates cosine similarity between two lists of floats without numpy/scipy."""
    dot_product = sum(a * b for a, b in zip(vec1, vec2))
    mag1 = math.sqrt(sum(a * a for a in vec1))
    mag2 = math.sqrt(sum(b * b for b in vec2))
    if mag1 == 0 or mag2 == 0:
        return 0.0
    return dot_product / (mag1 * mag2)

# GEMINI CLIENT SETUP
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def get_cleaned_data_path():
    return os.path.join(settings.BASE_DIR, 'data', 'cleaned_tech_skills2.csv')


def generate_study_plan_with_gemini(missing_skills, target_role, experience_tier):
    if not missing_skills:
        return {"message": "You already have all the required skills for this role!"}

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
        return {"roadmap": fallback_roadmap}


def get_career_roadmap(target_title, experience_level, user_skills):
    try:
        career = Career.objects.get(
            title__iexact=target_title,
            experience_level__iexact=experience_level
        )
    except ObjectDoesNotExist:
        return {"error": f"Career '{target_title}' at '{experience_level}' level not found in the database."}

    required_skills_query = career.required_skills.select_related('skill').all()
    required_skills = [cs.skill.name.lower().strip() for cs in required_skills_query]

    if not required_skills:
        return {"error": f"No skills have been assigned to '{target_title}' in the database yet."}

    if not user_skills:
        missing_skills = required_skills
        overall_match = 0
        already_known_or_similar = []
    else:
        user_embeddings_data = get_embeddings(user_skills)
        required_embeddings_data = get_embeddings(required_skills)

        if not user_embeddings_data or not required_embeddings_data:
            return {"error": "Failed to fetch skill embeddings from Hugging Face API."}

        missing_skills = []
        match_scores = []

        for i, req_skill in enumerate(required_skills):
            req_vec = required_embeddings_data[i]

            best_match_score = 0
            for user_vec in user_embeddings_data:
                sim = calculate_cosine_similarity(req_vec, user_vec)
                if sim > best_match_score:
                    best_match_score = sim

            match_scores.append(best_match_score)

            if best_match_score < 0.65:
                missing_skills.append(req_skill)

        overall_match = round((sum(match_scores) / len(match_scores)) * 100) if match_scores else 0
        already_known_or_similar = [s for s in required_skills if s not in missing_skills]

    study_plan = generate_study_plan_with_gemini(missing_skills, target_title, experience_level)

    return {
        "target_role": career.title,
        "experience_tier": experience_level,
        "match_percentage": overall_match,
        "missing_skills": missing_skills,
        "already_known_or_similar": already_known_or_similar,
        "study_plan": study_plan
    }