import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../public/logo.svg"; // Import the SVG logo
const RegisterOptions = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const logoStyles = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '48px',
    fontWeight: 700,
    color: isHovered ? '#264653' : '#2A9D8F',
    textShadow: isHovered ? '4px 4px 8px rgba(0, 0, 0, 0.3)' : '2px 2px 4px rgba(0, 0, 0, 0.2)',
    letterSpacing: '1px',
    display: 'inline-block',
    position: 'relative',
    cursor: 'pointer',
    transition: 'color 0.3s ease, text-shadow 0.3s ease',
  };

  const learnStyles = {
    color: '#E76F51',
    fontWeight: 500,
  };

  const underlineStyles = {
    content: "''",
    position: 'absolute',
    bottom: '-5px',
    left: 0,
    width: '100%',
    height: '4px',
    backgroundColor: '#F4A261',
    transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
    transition: 'transform 0.3s ease-in-out',
  };

  const buttonStyles = {
    padding: "15px 25px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  const adminButtonStyles = {
    ...buttonStyles,
    backgroundColor: "#1976d2",
    color: "white",
  };

  const adminButtonHoverStyles = {
    ...adminButtonStyles,
    backgroundColor: "#115293",
  };

  const userButtonStyles = {
    ...buttonStyles,
    backgroundColor: "#9c27b0",
    color: "white",
  };

  const userButtonHoverStyles = {
    ...userButtonStyles,
    backgroundColor: "#6a1b9a",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
    {/* Logo Section */}
    <img
        src={logo}
        alt="Logo"
        style={{
          width: "120px",
          height: "120px",
          marginBottom: "20px",
          filter: "drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.2))",
        }}
        />
      <div
        style={{ position: "relative", display: "inline-block" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >

        <h1 style={logoStyles}>
          Choose <span style={learnStyles}>Registration Type</span>
        </h1>
        <div style={underlineStyles}></div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
        {/* Register Admin Button */}
        <button
          style={isHovered ? adminButtonHoverStyles : adminButtonStyles}
          onClick={() => navigate("/register-admin")}
        >
          <i className="bi bi-shield-lock-fill" style={{ marginRight: "10px" }}></i>
          Register Admin
        </button>

        {/* Register User Button */}
        <button
          style={isHovered ? userButtonHoverStyles : userButtonStyles}
          onClick={() => navigate("/register-user")}
        >
          <i className="bi bi-person-plus-fill" style={{ marginRight: "10px" }}></i>
          Register User
        </button>
      </div>
    </div>
  );
};

export default RegisterOptions;
