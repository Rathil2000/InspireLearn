import { useState, useContext } from "react";
import { UserContext } from "../../../UserContext";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../auth.css";
import axios from "axios";
import logo from "../../../public/logo.svg";
function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // Get setUser from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/user-login", {
        email,
        password,
      });

      // On successful login
      if (response.status === 200) {
        const { name, profession, role, profileImage } = response.data; // Ensure the response structure is correct
        const userData = { name, role, profession, profileImage };
        console.log("userData:", userData);
        // Save the token and user data in localStorage
        localStorage.setItem("user", JSON.stringify(userData)); // Save user data in localStorage

        // Set user data in context
        setUser(userData);

        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          onClose: () => navigate("/home"), // Redirect on close
        });
      }
    } catch (error) {
      // Log or use the error here
      console.error("Login error:", error); // Log the error to the console
      // Display error if login fails
      toast.error("Invalid email or password.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  return (
    <div style={{ paddingLeft: "0" }}>
      <section className="form-container">
        <form onSubmit={handleSubmit} className="login">
          <div className="alignment">
            {/* Logo Section */}

            <img
              src={logo}
              alt="Logo"
              style={{
                width: "80px",
                height: "auto",
              }}
            />
            <h3>Welcome back!</h3>
            <div className="register-options">
              <button
                type="button"
                className="btn"
                onClick={() => navigate("/")}
              >
                Go Back
              </button>
            </div>
          </div>
          <p>
            Your Email <span>*</span>
          </p>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            maxLength="50"
            required
            className="login-box"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p>
            Your Password <span>*</span>
          </p>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            maxLength="20"
            required
            className="login-box"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="link">
            Do not have an account? <a href="/register-user">Register new</a>
          </p>
          <input type="submit" value="Login Now" className="btn" />
          <ToastContainer />
        </form>
      </section>
    </div>
  );
}

export default UserLogin;
