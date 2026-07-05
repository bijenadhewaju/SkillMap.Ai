from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import UserProfile, Education, Skill, Career, UserSkill, CareerSkill, Course, ProjectRecommendation
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
        # Note: UserProfile and Education are automatically deleted when User is deleted (CASCADE)

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

        careers_list = []
        for c_data in careers_data:
            career = Career.objects.create(title=c_data['title'], description=c_data['description'])
            careers_list.append(career)
            # Link skills to this career
            for skill_name in c_data['req_skills']:
                CareerSkill.objects.create(career=career, skill=skills[skill_name],
                                           importance_level=random.randint(3, 5))

        self.stdout.write("Creating Dummy Users, Profiles & Education...")
        for i in range(1, 6):
            # Create Core User
            user = User.objects.create_user(username=f'student{i}', email=f'student{i}@test.com',
                                            password='password123')

            # Create Profile using NEW Schema
            exp_years = random.choice([0, 1, 2])
            profile = UserProfile.objects.create(
                user=user,
                experience_years=exp_years,
                previous_role='Junior Developer' if exp_years > 0 else '',
                target_career=random.choice(careers_list),  # Assign a random target career
                bio=f'Aspiring tech professional looking to upskill.'
            )

            # Create Education record linked to profile
            Education.objects.create(
                user_profile=profile,
                degree_level='B.Tech',
                stream='Computer Science',
                status='Completed',
                timeline='2023'
            )

            # Give each user 2 random skills
            random_skills = random.sample(list(skills.values()), 2)
            for skill in random_skills:
                UserSkill.objects.create(user=user, skill=skill, proficiency_level=random.randint(1, 3))

        self.stdout.write("Creating Courses & Projects...")
        for skill_name, skill_obj in skills.items():
            Course.objects.create(
                title=f'Mastering {skill_name}',
                provider='Coursera',
                url='https://coursera.org',
                skill=skill_obj
            )
            ProjectRecommendation.objects.create(
                title=f'Build a {skill_name} App',
                description=f'A hands-on project to validate your {skill_name} skills.',
                skill=skill_obj
            )

        self.stdout.write(self.style.SUCCESS("Successfully seeded the database! "))