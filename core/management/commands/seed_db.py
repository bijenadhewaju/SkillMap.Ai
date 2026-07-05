from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from core.models import UserProfile, Skill, Career, UserSkill, CareerSkill, Course, ProjectRecommendation
import random

class Command(BaseCommand):
    help = 'Seeds the database with initial dummy data for SkillMap AI'

    def handle(self, *args, **kwargs):
        self.stdout.write("Clearing old data...")
        # Clear existing data to prevent duplicates if run multiple times
        User.objects.filter(is_superuser=False).delete()
        Skill.objects.all().delete()
        Career.objects.all().delete()
        Course.objects.all().delete()
        ProjectRecommendation.objects.all().delete()

        self.stdout.write("Creating Skills...")
        skills_data = [
            {'name': 'Python', 'category': 'Backend'},
            {'name': 'React', 'category': 'Frontend'},
            {'name': 'PostgreSQL', 'category': 'Database'},
            {'name': 'Docker', 'category': 'DevOps'},
            {'name': 'Machine Learning', 'category': 'AI/Data Science'},
            {'name': 'Figma', 'category': 'Design'},
            {'name': 'Django', 'category': 'Backend'},
            {'name': 'JavaScript', 'category': 'Frontend'},
        ]
        skills = {}
        for skill_data in skills_data:
            skill = Skill.objects.create(**skill_data)
            skills[skill.name] = skill

        self.stdout.write("Creating Careers & Required Skills...")
        careers_data = [
            {
                'title': 'Full Stack Developer',
                'description': 'Builds both the frontend and backend of web applications.',
                'req_skills': ['Python', 'Django', 'React', 'JavaScript', 'PostgreSQL']
            },
            {
                'title': 'Backend Engineer',
                'description': 'Focuses on server-side logic, databases, and APIs.',
                'req_skills': ['Python', 'Django', 'PostgreSQL', 'Docker']
            },
            {
                'title': 'Frontend Developer',
                'description': 'Creates user interfaces and interactive web experiences.',
                'req_skills': ['React', 'JavaScript', 'Figma']
            },
            {
                'title': 'Data Scientist',
                'description': 'Analyzes data to extract insights using AI and statistics.',
                'req_skills': ['Python', 'Machine Learning', 'PostgreSQL']
            },
            {
                'title': 'DevOps Engineer',
                'description': 'Manages deployment, scaling, and infrastructure.',
                'req_skills': ['Docker', 'Python', 'PostgreSQL']
            }
        ]

        for c_data in careers_data:
            career = Career.objects.create(title=c_data['title'], description=c_data['description'])
            # Link skills to this career
            for skill_name in c_data['req_skills']:
                CareerSkill.objects.create(career=career, skill=skills[skill_name], importance_level=random.randint(3, 5))

        self.stdout.write("Creating Dummy Users & Profiles...")
        for i in range(1, 6):
            user = User.objects.create_user(username=f'student{i}', email=f'student{i}@test.com', password='password123')
            UserProfile.objects.create(
                user=user,
                education='BSc Computer Science',
                experience_level='Beginner',
                bio=f'Aspiring tech professional looking to upskill.'
            )
            # Give each user 2 random skills
            random_skills = random.sample(list(skills.values()), 2)
            for skill in random_skills:
                UserSkill.objects.create(user=user, skill=skill, proficiency_level=random.randint(1, 3))

        self.stdout.write("Creating Courses & Projects...")
        for skill_name, skill_obj in skills.items():
            # 1 Course per skill
            Course.objects.create(
                title=f'Mastering {skill_name}',
                provider='Coursera',
                url='https://coursera.org',
                skill=skill_obj
            )
            # 1 Project per skill
            ProjectRecommendation.objects.create(
                title=f'Build a {skill_name} App',
                description=f'A hands-on project to validate your {skill_name} skills.',
                skill=skill_obj
            )

        self.stdout.write(self.style.SUCCESS("Successfully seeded the database! "))