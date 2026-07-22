from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Skill, Career, UserProfile, Roadmap
from .serializers import SkillSerializer, CareerSerializer, UserProfileSerializer, RoadmapSerializer
from .ai_utils import get_career_roadmap

class SkillListView(generics.ListAPIView):
    """Returns a list of all available skills."""
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated] # Only logged-in users get this data

class CareerListView(generics.ListAPIView):
    """Returns a list of all available target careers."""
    queryset = Career.objects.all()
    serializer_class = CareerSerializer
    permission_classes = [IsAuthenticated]

class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Handles GET (fetch profile) and PATCH/PUT (update profile) 
    for the currently logged-in user.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Automatically fetch or create the profile for the logged-in user
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile


@api_view(['POST'])
@permission_classes([AllowAny])
def generate_roadmap_api(request):
    """
    Expects a JSON payload:
    {
        "target_role": "Software Developer",
        "experience_level": "Fresher",
        "user_skills": ["python", "django", "git"]
    }
    """
    data = request.data
    target_role = data.get('target_role')
    experience_level = data.get('experience_level')
    user_skills = data.get('user_skills', [])

    if not target_role or not experience_level:
        return Response({"error": "target_role and experience_level are required."}, status=400)

    # Call the AI engine from ai_utils.py
    roadmap_data = get_career_roadmap(target_role, experience_level, user_skills)

    if "error" in roadmap_data:
        return Response(roadmap_data, status=404)

    return Response(roadmap_data, status=200)

class RoadmapListCreateView(generics.ListCreateAPIView):
    serializer_class = RoadmapSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return roadmaps belonging to the logged-in user
        return Roadmap.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        # Automatically attach the logged-in user when saving
        serializer.save(user=self.request.user)