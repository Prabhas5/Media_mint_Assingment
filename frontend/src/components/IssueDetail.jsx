import { useParams, useLocation, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api";


function IssueDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const userRole = searchParams.get('role') || "";
  
  console.log("Role from URL:", userRole); // Debug
  const isMaintainer = userRole === "maintainer";

  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  // EDIT MODE STATES
  const [isEditing, setIsEditing] = useState(false);
  const [editStatus, setEditStatus] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // WITH THIS:

// console.log(isMaintainer);
console.log(location.state?.userRole);



  // Fetch issue + comments
  const fetchIssueData = () => {
    api
      .get(`/api/issues/${id}/`)
      .then((res) => {
        setIssue(res.data);
        setComments(res.data.comments || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchIssueData();
  }, [id]);

  // -----------------------
  // UPDATE ISSUE (SAVE EDIT)
  // -----------------------
  const handleSaveEdit = () => {
    const payload = {
      status: editStatus,
      priority: editPriority,
      description: editDescription,
    };

    api
      .post(`/api/issues/${id}/update/`, payload)
      .then((res) => {
        setIssue(res.data); // update UI with server response
        setIsEditing(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Update failed!");
      });
  };

  // -----------------------
  // ADD COMMENT
  // -----------------------
  const handleAddComment = () => {
    if (!newComment.trim()) return;

    setPosting(true);

    api
      .post(`/api/issues/${id}/add-comment/`, {
        body: newComment,
      })
      .then(() => {
        setNewComment("");
        fetchIssueData();
        setPosting(false);
      })
      .catch((err) => {
        console.error(err);
        setPosting(false);
      });
  };

  if (loading) return <p>Loading issue details...</p>;
  if (!issue) return <p>Issue not found.</p>;

  return (
    <div style={{ padding: "25px", maxWidth: "700px", margin: "auto" }}>
      <h1>{issue.title}</h1>

      {/* ------------------- */}
      {/*    VIEW MODE        */}
      {/* ------------------- */}
      {!isEditing && (
        <>
          <p><strong>Status:</strong> {issue.status}</p>
          <p><strong>Priority:</strong> {issue.priority}</p>
          <p><strong>Description:</strong> {issue.description}</p>

          {isMaintainer && (
            <button
              onClick={() => {
                setEditStatus(issue.status);
                setEditPriority(issue.priority);
                setEditDescription(issue.description);
                setIsEditing(true);
              }}
              style={{
                marginTop: "10px",
                padding: "8px 14px",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "6px",
              }}
            >
              Edit
            </button>
          )}
        </>
      )}

      {/* ------------------- */}
      {/*     EDIT MODE       */}
      {/* ------------------- */}
      {isEditing && (
        <div style={{ marginBottom: "20px" }}>
          <p><strong>Status:</strong></p>
          <select
            value={editStatus}
            onChange={(e) => setEditStatus(e.target.value)}
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <p><strong>Priority:</strong></p>
          <select
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <p><strong>Description:</strong></p>
          <textarea
            rows="4"
            style={{ width: "100%" }}
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          ></textarea>

          <div style={{ marginTop: "10px" }}>
            <button
              onClick={handleSaveEdit}
              style={{
                padding: "8px 14px",
                marginRight: "10px",
                background: "green",
                color: "white",
                border: "none",
                borderRadius: "6px",
              }}
            >
              Save
            </button>

            <button
              onClick={() => setIsEditing(false)}
              style={{
                padding: "8px 14px",
                background: "#aaa",
                color: "white",
                border: "none",
                borderRadius: "6px",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <hr style={{ margin: "25px 0" }} />

      {/* COMMENTS */}
      <h2>Comments ({comments.length})</h2>

      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {comments.map((comment) => (
            <li
              key={comment.id}
              style={{
                padding: "10px",
                marginBottom: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <p style={{ marginBottom: 5 }}>
                <strong>{comment.user}</strong> commented:
              </p>
              <p>{comment.body}</p>
              <p style={{ fontSize: "12px", color: "#888" }}>
                {new Date(comment.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* ADD COMMENT */}
      <div
        style={{
          marginTop: "25px",
          padding: "15px",
          border: "1px solid #ccc",
          borderRadius: "10px",
        }}
      >
        <h3>Add a Comment</h3>
        <textarea
          rows="3"
          placeholder="Write your comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #aaa",
          }}
        />

        <button
          onClick={handleAddComment}
          disabled={posting}
          style={{
            marginTop: "10px",
            padding: "10px 18px",
            backgroundColor: posting ? "#aaa" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {posting ? "Posting..." : "Add Comment"}
        </button>
      </div>
    </div>
  );
}

export default IssueDetail;
