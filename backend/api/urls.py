from django.urls import path
from .views import SkillListView, CareerListView

urlpatterns = [
    path('skills/', SkillListView.as_view(), name='skill-list'),
    path('careers/', CareerListView.as_view(), name='career-list'),
]