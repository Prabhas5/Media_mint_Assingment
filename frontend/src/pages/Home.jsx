import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note"
import "../styles/Home.css"
import UserInfo from "../components/info";
import IssueForm from "../components/IssueForm";
import React from "react";
import CreateProjectForm from "../components/Project";
import Card from "../components/card";
import { useNavigate } from "react-router-dom";



function Home() {
  const [members, setMembers] = useState([]);
    const navigate = useNavigate();

  useEffect(() => {
  api
    .get("/api/get_data/")
    .then((res) => {
      setMembers(res.data);

      // Save in localStorage
      localStorage.setItem("members", JSON.stringify(res.data));
    })
    .catch((err) => {
      console.error("Error fetching members", err);
    });
}, []);


  return (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      {members.map((m) => (
        <Card
        onClick={() => navigate(`/user/${m.id}`)} 
          key={m.id}
          name={m.name}
          role={m.role}
          navigateTo={`/user/${m.id}`}
      
        />
      ))}

      <CreateProjectForm />
    </div>
  );
}

export default Home;



