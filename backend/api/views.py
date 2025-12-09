from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer,ProjectSerializer, ProjectMemberSerializer, IssueSerializer, CommentSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note
from rest_framework.decorators import api_view
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.models import Note, ProjectMember, Project, Issue, Comment


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):
    users = User.objects.filter().exclude(id=request.user.id)
    users_data = [user.username for user in users]
    return Response(users_data)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assine_user(request):
    user=request.user
    assine_to=User.objects.get(username=request.data.get('assignee'))
    param=request.query_params.get('id')
    project=Project.objects.get(key=param)
    pm=ProjectMember.objects.get(project=project,user=user)
    if pm.role!='maintainer':   
        return Response({"error":"Only maintainers can assign users."}, status=403)
    assine,cerated=ProjectMember.objects.get_or_create(
        project=project,
        user=assine_to,
        role='member'
    )
    create_issue=Issue.objects.create(
        project=project,
        title=request.data.get('title'),
        description=request.data.get('description'),
        reporter=user,
        assignee=assine_to,
        status=request.data.get('status'),
        priority=request.data.get('priority')
    )

    return Response({"message":"User assigned successfully."}, status=201)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_project(request):
    project_data = request.data.get("project")

    project = Project.objects.create(
        name=project_data["name"],
        key=project_data["key"],
        description=project_data["description"]
    )

    # auto-assign role
    role = "maintainer"   # or "member"

    ProjectMember.objects.create(
        project=project,
        user=request.user,
        role=role,
    
    )

    return Response({"message": "Project created"}, status=201)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_data(request):
    user=request.user
    
    return Response([
    {
        "id": p.project.key,
        "role": p.role,
        "name": p.project.name
    }
    for p in ProjectMember.objects.filter(user=user)
])
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def issue_create_view(request):
    user=request.user
    param=request.query_params.get('id')
    project=Project.objects.get(key=param)
    pm=ProjectMember.objects.get(project=project,user=user)
    project=pm.project
    data=request.data.copy()
    if pm.role=='member':
        return Response({"error":"Only maintainers can create issues."}, status=403)
    data['project']=project
    data['reporter']=user
    try:
        issue=Issue.objects.create(**data)
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    data['project']=project.id
    data['reporter']=user.id

    return Response(data=data,status=201)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def issue_detail_view(request, pk):
    try:
        issue = Issue.objects.get(id=pk)
    except Issue.DoesNotExist:
        return Response({"error": "Issue not found"}, status=404)

    comments = Comment.objects.filter(issue=issue).select_related("author")

    comments_data = [
        {
            "id": c.id,
            "body": c.body,
            "user": c.author.username,
            "created_at": c.created_at.strftime("%Y-%m-%dT%H:%M:%S"),
        }
        for c in comments
    ]

    issue_data = {
        "id": issue.id,
        "title": issue.title,
        "description": issue.description,
        "status": issue.status,
        "priority": issue.priority,
        "reporter": issue.reporter.username,
        "assignee": issue.assignee.username if issue.assignee else None,
        "created_at": issue.created_at.strftime("%Y-%m-%dT%H:%M:%S"),
        "updated_at": issue.updated_at.strftime("%Y-%m-%dT%H:%M:%S"),
        "comments": comments_data,
    }

    return Response(issue_data)


@api_view(['GET','POST'])
def add_comment_to_issue(request,id):
    user=request.user

    data=request.data.copy()
    data['issue']=int(id)
    data['author']=user.id
    I=Issue.objects.get(id=data['issue'])
    body=data['body']
    try:
        comment=Comment.objects.create(issue=I,author=user,body=body )
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    serializer=CommentSerializer(comment)
    return Response(serializer.data, status=201)
@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def issue_update(request,id):
    user=request.user
    data=request.data.copy()
    I=Issue.objects.filter(id=id).update(**data)
    data=IssueSerializer(I, many=True).data,
    return Response({"message":"Issue updated successfully.","data":data}, status=200)


class IssueDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated]

class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_view(request):
    user = request.user
    param=request.query_params.get('id')
    p=Project.objects.get(key=param)
    try:
        project_member = ProjectMember.objects.get(project=p,user=user)
        project = project_member.project
        project_name = project.name
        key=project.key
        role = project_member.role
    except ProjectMember.DoesNotExist:
        project = None
        role = None
    if role is None:
        role = "No role assigned"
    if role == 'maintainer':
        issues_reported_count= Issue.objects.filter(project=project,reporter=user).count()
        issues_reported = Issue.objects.filter(project=project,reporter=user)
        issues_assigned_count = Issue.objects.filter(project=project,assignee=user).count()
        issues_assigned = Issue.objects.filter(project=project,assignee=user)
        comments_made_count = Comment.objects.filter(issue__project=project,author=user).count()
        comments_made = Comment.objects.filter(issue__project=project,author=user)
        data={
            "username": user.username,
            "role": role,
            "project_name": project_name,
            "project_key": key,
            "issues_reported_count": issues_reported_count,
            "issues_reported": IssueSerializer(issues_reported, many=True).data,
            "issues_assigned_count": issues_assigned_count,
            "issues_assigned": IssueSerializer(issues_assigned, many=True).data,
            "comments_made_count": comments_made_count,
            "comments_made": CommentSerializer(comments_made, many=True).data,
        }
    elif role == 'member':
        issues_assigned_count = Issue.objects.filter(assignee=user).count()
        issues_assigned = Issue.objects.filter(assignee=user)
        comments_made_count = Comment.objects.filter(author=user).count()
        comments_made = Comment.objects.filter(author=user)
        data={
            "username": user.username,
            "role": role,
            "project_name": project_name,
            "project_key": key,
            "issues_assigned_count": issues_assigned_count,
            "issues_assigned": IssueSerializer(issues_assigned, many=True).data,
            "comments_made_count": comments_made_count,
            "comments_made": CommentSerializer(comments_made, many=True).data,
        }   
    else:
        data={
            "username": user.username,
            "role": role,
        }
    return Response(data)
        
