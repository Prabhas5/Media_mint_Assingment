import { useState } from "react";
import api from "../api";

function CreateProjectForm() {
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      project: {
        name,
        key,
        description,
      }
    };

    api.post("/api/create_project/", data)
      .then((res) => {
        alert("Project Created Successfully");
        console.log("Response:", res.data);
      })
      .catch((err) => {
        console.log("Error:", err);
        alert("Something went wrong");
      });
  };

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto" }}>
      <h2>Create Project</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

        {/* Project Name */}
        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Project Key */}
        <input
          type="text"
          placeholder="Project Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          required
        />

        {/* Description */}
        <textarea
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
        />

        <button type="submit">Create Project</button>
      </form>
    </div>
  );
}

export default CreateProjectForm;