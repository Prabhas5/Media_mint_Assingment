from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note, Project, ProjectMember, Issue, Comment
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password",]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"


class ProjectMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMember
        fields = "__all__"
class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
    reporter = UserSerializer(read_only=True)
    assignee = UserSerializer(read_only=True)
    comments = serializers.SerializerMethodField()

    class Meta:
        model = Issue
        fields = ['id', 'project', 'title', 'description', 'status', 'priority', 'reporter', 'assignee', 'created_at', 'updated_at', 'comments']

    def get_comments(self, obj):
        qs = Comment.objects.filter(issue=obj).order_by('created_at')
        return CommentSerializer(qs, many=True).data


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
    author = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'issue', 'author', 'body', 'created_at']

    def get_author(self, obj):
        return {"id": obj.author.id, "username": obj.author.username}
