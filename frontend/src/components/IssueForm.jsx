import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

function IssueForm({ projectId }) {
  const { id } = useParams(); // reporter ID
  const reporterId = id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("open");
  const [assigneeList, setAssigneeList] = useState([]);
  const [assignee, setAssignee] = useState("");
  const [message, setMessage] = useState("");

  // GET USERS
  useEffect(() => {
    api.get("/api/get_users/")
      .then(res => setAssigneeList(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      priority,
      status,
      reporter: reporterId,
      assignee: assignee
    };

    api
      .post(`/api/assine_user/?id=${projectId}`, payload)
      .then((res) => {
        setMessage("Issue created and assigned!");
      })
      .catch(() => setMessage("Error assigning issue"));
  };

  return (
  <form onSubmit={handleSubmit} className="space-y-6">
    {message && (
      <div className={`p-4 rounded-lg ${message.includes("Error") ? "bg-red-50 text-red-800 border border-red-200" : "bg-green-50 text-green-800 border border-green-200"}`}>
        {message}
      </div>
    )}

    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Title <span className="text-red-500">*</span>
      </label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
        placeholder="Enter issue title"
      />
    </div>

    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Description <span className="text-red-500">*</span>
      </label>
      <textarea
        rows="5"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
        placeholder="Describe the issue in detail..."
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Priority
        </label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 appearance-none bg-white"
        >
          <option value="low" className="text-green-600">Low</option>
          <option value="medium" className="text-yellow-600">Medium</option>
          <option value="high" className="text-orange-600">High</option>
          <option value="critical" className="text-red-600">Critical</option>
        </select>
        <div className="text-xs text-gray-500 mt-1">
          {priority === "low" && "Minor issue, can be addressed later"}
          {priority === "medium" && "Normal priority, schedule accordingly"}
          {priority === "high" && "Important issue, address soon"}
          {priority === "critical" && "Critical issue, needs immediate attention"}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 appearance-none bg-white"
        >
          <option value="open" className="text-blue-600">Open</option>
          <option value="in_progress" className="text-purple-600">In Progress</option>
          <option value="resolved" className="text-green-600">Resolved</option>
          <option value="closed" className="text-gray-600">Closed</option>
        </select>
        <div className="text-xs text-gray-500 mt-1">
          {status === "open" && "Issue is newly created and unassigned"}
          {status === "in_progress" && "Issue is currently being worked on"}
          {status === "resolved" && "Issue has been fixed, pending verification"}
          {status === "closed" && "Issue is completed and verified"}
        </div>
      </div>
    </div>

    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Assign To <span className="text-red-500">*</span>
      </label>
      <select
        value={assignee}
        onChange={(e) => setAssignee(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 appearance-none bg-white"
      >
        <option value="" className="text-gray-400">Select user...</option>
        {assigneeList.map((username, index) => (
          <option key={index} value={username} className="text-gray-700">
            {username}
          </option>
        ))}
      </select>
      <div className="text-xs text-gray-500 mt-1">
        Leave unassigned to assign later
      </div>
    </div>

    <div className="pt-4 border-t border-gray-200">
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Create Issue
      </button>
    </div>
  </form>
);
}

export default IssueForm;
