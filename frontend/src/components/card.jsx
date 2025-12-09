import { useNavigate } from "react-router-dom";

function Card({ name, role, navigateTo }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(navigateTo)}
      style={{
        border: "1px solid #ccc",
        padding: "20px",
        borderRadius: "12px",
        width: "260px",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow =
          "0 4px 12px rgba(0, 0, 0, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow =
          "0 2px 8px rgba(0, 0, 0, 0.1)";
      }}
    >
      <h2 style={{ margin: "0 0 10px 0" }}>Project Name: {name}</h2>
      <p style={{ margin: 0, fontSize: "16px", color: "#555" }}>
        Role: {role}
      </p>
    </div>
  );
}

export default Card;