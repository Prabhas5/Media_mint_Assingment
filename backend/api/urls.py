from django.urls import path
from . import views

urlpatterns = [
    path("user/view/", views.user_view, name="view-user"),
    path("issues/create/", views.issue_create_view, name="create-issue"),
    path("issues/<int:pk>/", views.issue_detail_view, name="issue-detail"),
    path("comments/<int:pk>/", views.CommentDetailView.as_view(), name="comment-detail"),
    path("issues/<id>/add-comment/", views.add_comment_to_issue, name="add-comment-to-issue"),
    path("create_project/", views.create_project, name="create-project"),
    path("get_data/", views.get_data, name="get-data"),
    path("issues/<id>/update/", views.issue_update, name="issue-update"),
    path("get_users/", views.get_users, name="get-users"),
    path("assine_user/", views.assine_user, name="assine-user"),   
    
]
