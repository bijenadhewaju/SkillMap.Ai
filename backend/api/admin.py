from django.contrib import admin
from .models import (
    UserProfile, Education, Skill, Career,
    UserSkill, CareerSkill, Roadmap,
    RoadmapStep, Course, ProjectRecommendation
)

admin.site.register(UserProfile)
admin.site.register(Education)
admin.site.register(Skill)
admin.site.register(Career)
admin.site.register(UserSkill)
admin.site.register(CareerSkill)
admin.site.register(Roadmap)
admin.site.register(RoadmapStep)
admin.site.register(Course)
admin.site.register(ProjectRecommendation)