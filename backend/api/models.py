from django.db import models
from django.contrib.auth.models import User


# ---------------------------------------------------------
# 1. USERS & PROFILES
# ---------------------------------------------------------

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')

    # Target Goal
    target_career = models.ForeignKey('Career', on_delete=models.SET_NULL, null=True, blank=True,
                                      related_name='aspiring_users')
    bio = models.TextField(blank=True, null=True)

    # UPDATED: We now route skills through your custom UserSkill model
    skills = models.ManyToManyField('Skill', through='UserSkill', blank=True)

    # ADDED: Cache the raw Gemini API response here so you don't burn API credits on reload
    saved_ai_roadmap = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"


class Education(models.Model):
    STATUS_CHOICES = (
        ('Completed', 'Completed'),
        ('Ongoing', 'Ongoing'),
    )
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='educations')
    degree_level = models.CharField(max_length=100)
    stream = models.CharField(max_length=150)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    timeline = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.degree_level} in {self.stream} ({self.user_profile.user.username})"


# ---------------------------------------------------------
# 2. SKILLS & CAREERS
# ---------------------------------------------------------

class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Career(models.Model):
    EXPERIENCE_CHOICES = (
        ('Fresher', 'Fresher'),
        ('Mid-Level', 'Mid-Level'),
        ('Senior', 'Senior'),
    )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    experience_level = models.CharField(max_length=50, choices=EXPERIENCE_CHOICES, default='Fresher')

    class Meta:
        unique_together = ('title', 'experience_level')

    def __str__(self):
        return f"{self.title} ({self.experience_level})"


# ---------------------------------------------------------
# 3. MAPPING TABLES (The "Through" Models)
# ---------------------------------------------------------

class UserSkill(models.Model):
    """
    This is your newly wired 'Through' model.
    It tracks EXACTLY how much experience a user has with a specific skill.
    """
    # Changed from User to UserProfile to cleanly link the ManyToMany field
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='user_skills')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)

    # ADDED: Track years of experience per skill
    experience_years = models.FloatField(default=0.0)
    proficiency_level = models.IntegerField(default=1)

    class Meta:
        unique_together = ('user_profile', 'skill')

    def __str__(self):
        return f"{self.user_profile.user.username} - {self.skill.name} ({self.experience_years} yrs)"


class CareerSkill(models.Model):
    career = models.ForeignKey(Career, on_delete=models.CASCADE, related_name='required_skills')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    importance_level = models.IntegerField(default=1)


# ---------------------------------------------------------
# 4. ROADMAP & PROGRESS
# ---------------------------------------------------------

class Roadmap(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='roadmaps')
    career = models.ForeignKey(Career, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


class RoadmapStep(models.Model):
    roadmap = models.ForeignKey(Roadmap, on_delete=models.CASCADE, related_name='steps')
    title = models.CharField(max_length=255)
    description = models.TextField()
    order_no = models.IntegerField()
    status = models.CharField(max_length=50, default='Pending')


# ---------------------------------------------------------
# 5. RESOURCES (Courses & Projects)
# ---------------------------------------------------------

class Course(models.Model):
    title = models.CharField(max_length=255)
    provider = models.CharField(max_length=100)
    url = models.URLField()
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='courses')


class ProjectRecommendation(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='projects')