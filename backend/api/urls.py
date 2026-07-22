from django.urls import path
from .views import (
    SkillListView,
    CareerListView,
    UserProfileView,
    generate_roadmap_api,
    RoadmapListCreateView,
)

urlpatterns = [
    path('skills/', SkillListView.as_view(), name='skill-list'),
    path('careers/', CareerListView.as_view(), name='career-list'),
    path('accounts/profile/', UserProfileView.as_view(), name='user-profile'),

    # AI and Database routes
    path('generate-roadmap/', generate_roadmap_api, name='generate-roadmap'),
    path('roadmaps/', RoadmapListCreateView.as_view(), name='roadmap-list-create'),
]