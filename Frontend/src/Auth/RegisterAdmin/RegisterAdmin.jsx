import { useState, useCallback } from "react";
import "../auth.css";
import axios from "axios";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import logo from "../../../public/logo.svg";
const RegisterAdmin = () => {
  const navigate = useNavigate();

  const notifySuccess = useCallback(() => {
    toast.success("Admin Register Successfully..", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });

    setTimeout(() => {
      navigate("/admin-login");
    }, 3000);
  }, [navigate]);

  const notifyError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
  };

  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("profession", profession);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("profileImage", profileImage);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/register-admin`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log(response.data);
      notifySuccess();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        notifyError(error.response.data.message);
      } else {
        notifyError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="App">
      <section className="form-container">
        <form
          className="register"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
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
            <h3>Register New Tutor</h3>
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
          <div className="flex1">
            <div className="col">
              <p>
                Your Name <span>*</span>
              </p>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                maxLength="50"
                required
                className="box"
                aria-label="Name"
                onChange={(e) => setName(e.target.value)}
              />
              <p>
                Your Profession <span>*</span>
              </p>
              <select
                name="profession"
                className="box"
                required
                aria-label="Profession"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
              >
                <option value="" disabled>
                  -- Select your profession --
                </option>
                <option value="developer">Developer</option>
                <option value="designer">Designer</option>
                <option value="musician">Musician</option>
                <option value="biologist">Biologist</option>
                <option value="teacher">Teacher</option>
                <option value="engineer">Engineer</option>
                <option value="lawyer">Lawyer</option>
                <option value="accountant">Accountant</option>
                <option value="doctor">Doctor</option>
                <option value="journalist">Journalist</option>
                <option value="photographer">Photographer</option>
              </select>
              <p>
                Your Email <span>*</span>
              </p>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                maxLength="50"
                required
                className="box"
                aria-label="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="col">
              <p>
                Your Password <span>*</span>
              </p>
              <input
                type="password"
                name="pass"
                placeholder="Enter your password"
                maxLength="20"
                required
                className="box"
                aria-label="Password"
                autoComplete="new-password" // Add this line
                onChange={(e) => setPassword(e.target.value)}
              />
              <p>
                Confirm Password <span>*</span>
              </p>
              <input
                type="password"
                name="cpass"
                placeholder="Confirm your password"
                maxLength="20"
                required
                className="box"
                aria-label="Confirm Password"
                autoComplete="new-password" // Add this line
              />
              <p>
                Select Picture <span>*</span>
              </p>
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                required
                className="box"
                aria-label="Profile Picture"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
          </div>
          <p className="link">
            Already have an account? <a href="/admin-login">Login now</a>
          </p>
          <input type="submit" value="Register Now" className="btn" />
          <ToastContainer />
        </form>
      </section>
    </div>
  );
};

export default RegisterAdmin;
