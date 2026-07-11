from django.db import models
from django.contrib.auth.models import User

# User Profile and Education
class UserProfile(models.Model):
    objects = None
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')

    # Experience Tracking
    experience_years = models.IntegerField(default=0)
    previous_role = models.CharField(max_length=150, blank=True, null=True)

    # Target Goal
    target_career = models.ForeignKey('Career', on_delete=models.SET_NULL, null=True, blank=True,
                                      related_name='aspiring_users')

    bio = models.TextField(blank=True, null=True)

    skills = models.ManyToManyField('Skill', blank=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"


class Education(models.Model):
    STATUS_CHOICES = (
        ('Completed', 'Completed'),
        ('Ongoing', 'Ongoing'),
    )
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='educations')
    degree_level = models.CharField(max_length=100)  # e.g., B.Tech, Masters, Self-Taught
    stream = models.CharField(max_length=150)        # e.g., Computer Science
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    timeline = models.CharField(max_length=50)       # e.g., "2023" or "6th Semester"

    def __str__(self):
        return f"{self.degree_level} in {self.stream} ({self.user_profile.user.username})"

# Skills and Careers

class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Career(models.Model):
    title = models.CharField(max_length=255, unique=True)
    description = models.TextField()

    def __str__(self):
        return self.title

# Mapping Tables (Many-to-Many relationships)
class UserSkill(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='skills')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    proficiency_level = models.IntegerField(default=1)

    class Meta:
        unique_together = ('user', 'skill') # A user can not have same sill twice

class CareerSkill(models.Model):
    career = models.ForeignKey(Career, on_delete=models.CASCADE, related_name='required_skills')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    importance_level = models.IntegerField(default=1)

# 4. Roadmap & Progress
class Roadmap(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='roadmaps')
    career = models.ForeignKey(Career, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class RoadmapStep(models.Model):
    roadmap = models.ForeignKey(Roadmap, on_delete=models.CASCADE, related_name='steps')
    title = models.CharField(max_length=255)
    description = models.TextField()
    order_no = models.IntegerField()
    status = models.CharField(max_length=50, default='Pending') # Pending, In Progress, Completed

# 5. Resources (Courses & Projects)
class Course(models.Model):
    title = models.CharField(max_length=255)
    provider = models.CharField(max_length=100) # e.g., Coursera, Udemy
    url = models.URLField()
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='courses')

class ProjectRecommendation(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='projects')
