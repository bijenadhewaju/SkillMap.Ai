from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Skill, Career
from .serializers import SkillSerializer, CareerSerializer

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