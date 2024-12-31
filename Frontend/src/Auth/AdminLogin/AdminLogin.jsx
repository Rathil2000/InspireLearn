import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { UserContext } from "../../../UserContext"; // Adjusted path
import "../auth.css";
import logo from "../../../public/logo.svg";
function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // Get setUser from context

  // Check if the user is already logged in (on component mount)
  useEffect(() => {}, [setUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/admin-login", {
        email,
        password,
      });

      // On successful login
      if (response.status === 200) {
        const { name, profession, role, profileImage } = response.data; // Ensure the response structure is correct
        const userData = { name, role, profession, profileImage };
        console.log("userData::::", userData);

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
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
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
            style={{ width: "80%" }}
            type="email"
            name="email"
            placeholder="Enter your email"
            maxLength="50"
            required
            className="login-box"
            value={email}
            autoComplete="username"
            onChange={(e) => setEmail(e.target.value)}
          />
          <p>
            Your Password <span>*</span>
          </p>
          <input
            style={{ width: "80%" }}
            type="password"
            name="password"
            placeholder="Enter your password"
            maxLength="20"
            required
            className="login-box"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="link">
            do not have an account? <a href="/register-admin">Register new</a>
          </p>
          <input type="submit" value="Login Now" className="btn" />
          <ToastContainer />
        </form>
      </section>
    </div>
  );
}

export default AdminLogin;
