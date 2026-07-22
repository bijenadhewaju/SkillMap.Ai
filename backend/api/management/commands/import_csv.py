import os
import pandas as pd
from django.core.management.base import BaseCommand
from django.conf import settings
from api.models import Career, Skill, CareerSkill


class Command(BaseCommand):
    help = 'Imports skills and careers from cleaned_tech_skills2.csv'

    def handle(self, *args, **kwargs):
        csv_path = os.path.join(settings.BASE_DIR, 'data', 'cleaned_tech_skills2.csv')

        if not os.path.exists(csv_path):
            self.stdout.write(self.style.ERROR(f"CSV not found at {csv_path}"))
            return

        df = pd.read_csv(csv_path)

        for index, row in df.iterrows():
            title = row['Title'].strip()
            experience_level = row['ExperienceLevel'].strip()
            skills_str = row['Target_Skills']

            # 1. Create or get the Career
            career, created = Career.objects.get_or_create(
                title=title,
                experience_level=experience_level,
                defaults={'description': f"{experience_level} level {title}"}
            )

            if created:
                self.stdout.write(self.style.SUCCESS(f"Created Career: {career.title} ({career.experience_level})"))

            # 2. Process the skills
            skill_names = [s.strip().lower() for s in skills_str.split(',') if s.strip()]

            for skill_name in skill_names:
                # Create or get the Skill
                skill, skill_created = Skill.objects.get_or_create(
                    name=skill_name,
                    defaults={'category': 'Technical'}
                )

                # Link the Skill to the Career
                CareerSkill.objects.get_or_create(
                    career=career,
                    skill=skill,
                    defaults={'importance_level': 5}
                )

        self.stdout.write(self.style.SUCCESS('Successfully imported all data from CSV!'))