import { useState, useEffect } from "react";
import api from "../api";
import { Link, useLocation } from "react-router-dom";
import IssueForm from "./IssueForm";

function UserInfo() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
//   const [role, setRole] = useState("");
  // NEW STATES
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [assignMsg, setAssignMsg] = useState("");

  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  // FUNCTION TO FETCH DASHBOARD DATA
  const fetchUserData = () => {
    api
      .get("/api/user/view/?id=" + lastSegment)
      .then((res) => {
        setData(res.data);
        if (res.data.role == "maintainer") {
        console.log(role);
        role = "maintainer";
        console.log(role);
        
        }
        // console.log(res);
        
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };
let role = "member";
  useEffect(() => {
    fetchUserData();
  }, []);

  // 🟢 Fetch assignable users only if maintainer
  useEffect(() => {
    if (data?.role === "maintainer") {
      api
        .get("/api/get_users/")
        .then((res) => setUsers(res.data))
        .catch((err) => console.error(err));
    }
  }, [data]);

  // 🟢 Assign user function
  const handleAssignUser = () => {
    if (!selectedUser) {
      setAssignMsg("Please select a user.");
      return;
    }

    api
      .post(`/api/assine_user/?id=${data.project_key}`, { username: selectedUser })
      .then((res) => {
        setAssignMsg("User assigned successfully!");
        setSelectedUser("");

        // Refresh dashboard
        fetchUserData();
      })
      .catch((err) => {
        console.error(err);
        setAssignMsg("Failed to assign user.");
      });
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (!data) return <p>No data received.</p>;

  return (
  <div className="flex gap-8 p-6 items-start bg-gray-50 min-h-screen">
    {/* LEFT SIDE - USER DETAILS */}
    <div className="flex-1">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {data.username}</h1>
        <div className="inline-block bg-indigo-100 text-indigo-800 px-4 py-1 rounded-full text-sm font-medium">
          {data.role}
        </div>
      </div>

      {data.project_name && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Project</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="text-gray-600 font-medium w-24">Name:</span>
              <span className="text-gray-900 font-semibold">{data.project_name}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 font-medium w-24">Key:</span>
              <span className="bg-gray-100 text-gray-800 font-mono px-3 py-1 rounded-md text-sm">
                {data.project_key}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Issues reported */}
      {data.issues_reported && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Issues You Reported</h2>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {data.issues_reported_count}
            </span>
          </div>
          {data.issues_reported.length === 0 ? (
            <p className="text-gray-500 italic">No issues reported.</p>
          ) : (
            <div className="space-y-3">
              {data.issues_reported.map((issue) => (
                <Link
  key={issue.id}
  to={`/issues/${issue.id}?role=${data.role}`}
  className="block border-l-4 border-blue-500 bg-blue-50 hover:bg-blue-100 p-4 rounded-r-lg transition-colors duration-200"
>
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900">{issue.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      issue.priority === 'high' ? 'bg-red-100 text-red-800' :
                      issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {issue.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      issue.status === 'open' ? 'bg-green-100 text-green-800' :
                      issue.status === 'in progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {issue.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Issues assigned */}
      {data.issues_assigned && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Issues Assigned to You</h2>
            <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
              {data.issues_assigned_count}
            </span>
          </div>
          {data.issues_assigned.length === 0 ? (
            <p className="text-gray-500 italic">No assigned issues.</p>
          ) : (
            <div className="space-y-3">
              {data.issues_assigned.map((issue) => (
                <Link
                  key={issue.id}
                  to={`/issues/${issue.id}`}
                  className="block border-l-4 border-purple-500 bg-purple-50 hover:bg-purple-100 p-4 rounded-r-lg transition-colors duration-200"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900">{issue.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      issue.priority === 'high' ? 'bg-red-100 text-red-800' :
                      issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {issue.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      issue.status === 'open' ? 'bg-green-100 text-green-800' :
                      issue.status === 'in progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {issue.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Comments */}
      {data.comments_made && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Your Comments</h2>
            <span className="bg-emerald-100 text-emerald-800 text-sm font-medium px-3 py-1 rounded-full">
              {data.comments_made_count}
            </span>
          </div>
          {data.comments_made.length === 0 ? (
            <p className="text-gray-500 italic">No comments added.</p>
          ) : (
            <div className="space-y-4">
              {data.comments_made.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-600 text-sm">On Issue</span>
                    <Link
                      to={`/issues/${comment.issue}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      #{comment.issue}
                    </Link>
                  </div>
                  <p className="text-gray-800">{comment.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>

    {/* RIGHT SIDE - ISSUE FORM */}
    <div className="w-[450px] sticky top-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Issue</h2>
        <IssueForm projectId={data.project_key} reporterId={data.id} />
      </div>
    </div>
  </div>
);
}

export default UserInfo;
