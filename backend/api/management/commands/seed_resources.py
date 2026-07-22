from django.core.management.base import BaseCommand
from api.models import Skill, Course, ProjectRecommendation


class Command(BaseCommand):
    help = 'Seeds the database with sample courses and projects for common skills'

    def handle(self, *args, **kwargs):
        # A dictionary mapping exact skill names to their resources
        resource_data = {
            'python': {
                'courses': [
                    {'title': '100 Days of Code: The Complete Python Pro Bootcamp', 'provider': 'Udemy',
                     'url': 'https://www.udemy.com/course/100-days-of-code/'},
                    {'title': 'Python for Everybody Specialization', 'provider': 'Coursera',
                     'url': 'https://www.coursera.org/specializations/python'}
                ],
                'projects': [
                    {'title': 'Weather API Dashboard',
                     'description': 'Build a dashboard that fetches live weather data using the OpenWeather API and displays it using a simple GUI.'}
                ]
            },
            'git': {
                'courses': [
                    {'title': 'Version Control with Git', 'provider': 'Coursera',
                     'url': 'https://www.coursera.org/learn/version-control-with-git'}
                ],
                'projects': [
                    {'title': 'Open Source Contribution',
                     'description': 'Fork a popular open-source repository, create a feature branch, make a meaningful commit, and submit a pull request.'}
                ]
            },
            'sql': {
                'courses': [
                    {'title': 'SQL for Data Science', 'provider': 'Coursera',
                     'url': 'https://www.coursera.org/learn/sql-for-data-science'},
                    {'title': 'Complete SQL Mastery', 'provider': 'Code with Mosh',
                     'url': 'https://codewithmosh.com/p/complete-sql-mastery'}
                ],
                'projects': [
                    {'title': 'Library Management Database',
                     'description': 'Design a relational database schema for a library. Write complex JOIN queries to track overdue books and top borrowers.'}
                ]
            }
        }

        for skill_name, data in resource_data.items():
            # Find the skill we already imported from the CSV
            skill = Skill.objects.filter(name__iexact=skill_name).first()

            if not skill:
                self.stdout.write(self.style.WARNING(f"Skill '{skill_name}' not found. Skipping resources."))
                continue

            # Add Courses
            for course_info in data['courses']:
                course, created = Course.objects.get_or_create(
                    skill=skill,
                    title=course_info['title'],
                    defaults={'provider': course_info['provider'], 'url': course_info['url']}
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f"Added Course for {skill.name}: {course.title}"))

            # Add Projects
            for project_info in data['projects']:
                project, created = ProjectRecommendation.objects.get_or_create(
                    skill=skill,
                    title=project_info['title'],
                    defaults={'description': project_info['description']}
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f"Added Project for {skill.name}: {project.title}"))

        self.stdout.write(self.style.SUCCESS('Successfully seeded sample resources!'))