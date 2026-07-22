from rest_framework import serializers
from .models import Skill, Career, UserProfile, Education, Roadmap, RoadmapStep

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'category']


class CareerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Career
        fields = ['id', 'title', 'description']


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['degree_level', 'stream', 'status', 'timeline']


class UserProfileSerializer(serializers.ModelSerializer):
    educations = EducationSerializer(many=True, required=False)
    skills = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Skill.objects.all(),
        required=False
    )

    class Meta:
        model = UserProfile
        fields = ['experience_years', 'previous_role', 'target_career', 'bio', 'skills', 'educations']

    def update(self, instance, validated_data):
        educations_data = validated_data.pop('educations', None)
        skills_data = validated_data.pop('skills', None)

        # 1. Update basic scalar profile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # 2. Update Many-to-Many Skills
        if skills_data is not None:
            instance.skills.set(skills_data)

        # 3. Replace/Sync nested Education items
        if educations_data is not None:
            instance.educations.all().delete()
            for ed_data in educations_data:
                Education.objects.create(user_profile=instance, **ed_data)

        return instance


class RoadmapStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoadmapStep
        fields = ['id', 'title', 'description', 'order_no', 'status']


class RoadmapSerializer(serializers.ModelSerializer):
    steps = RoadmapStepSerializer(many=True)  # Enables saving steps in the same request

    class Meta:
        model = Roadmap
        fields = ['id', 'career', 'created_at', 'steps']

    def create(self, validated_data):
        # Extract the steps from the payload
        steps_data = validated_data.pop('steps', [])

        # Create the parent Roadmap (user is passed automatically from the view)
        roadmap = Roadmap.objects.create(**validated_data)

        # Create all the nested steps tied to this roadmap
        for step_data in steps_data:
            RoadmapStep.objects.create(roadmap=roadmap, **step_data)

        return roadmap