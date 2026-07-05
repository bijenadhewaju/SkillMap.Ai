from django.db import models
from django.contrib.auth.models import User

# User Profile
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE,related_name='profile')
    education = models.CharField(max_length=255, blank=True, null=True)
    experience_level = models.CharField(max_length=50, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

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
