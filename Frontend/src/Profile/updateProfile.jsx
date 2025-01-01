import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Update = () => {
  const navigate = useNavigate(); // Initialize history

  const [formData, setFormData] = useState({
    name: "",
    profession: "",
    email: "",
    old_pass: "",
    new_pass: "",
    c_pass: "",
    profilePic: "",
  });

  // Handle file change for profile picture
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profilePic: e.target.files[0],
    });
  };

  // Handle form data change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission without axios
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // JWT token stored in localStorage
    const storedUser = localStorage.getItem("user"); // Role stored in localStorage
    const Role = JSON.parse(storedUser);

    const updatedData = new FormData();
    updatedData.append("name", formData.name);
    updatedData.append("profession", formData.profession);
    updatedData.append("email", formData.email);
    updatedData.append("old_pass", formData.old_pass);
    updatedData.append("new_pass", formData.new_pass);
    updatedData.append("c_pass", formData.c_pass);
    if (formData.profilePic)
      updatedData.append("profilePic", formData.profilePic);
 
    // Determine API endpoint based on role
    const apiUrl =
      Role.role === "admin"
        ? `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/update-adminProfile`
        : `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/update-userProfile`;

    try {
      const response = await fetch(apiUrl, {
        method: "PUT", // HTTP method
        headers: {
          Authorization: `Bearer ${token}`, // Add token to the header for authentication
        },
        body: updatedData, // Form data is passed as the body
      });

      const result = await response.json(); // Parse the JSON response

      if (response.ok && result.message === "Profile updated successfully") {
        // Fetch latest user data
        const fetchProfileUrl =
          Role.role === "admin"
            ? `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/get-adminProfile?email=${formData.email}`
            : `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/get-userProfile?email=${formData.email}`;

        const profileResponse = await fetch(fetchProfileUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (profileResponse.ok) {
          const updatedUserData = await profileResponse.json();

          // Optionally, update formData state with the fetched data
          setFormData({
            name: updatedUserData.name || "",
            profession: updatedUserData.profession || "",
            role: updatedUserData.role || "",
            email: updatedUserData.email || "",
            profilePic: updatedUserData.profileImage || "",
          });
          // Update localStorage with the latest user data
          localStorage.setItem("user", JSON.stringify(updatedUserData));

          // Redirect to profile page
          navigate("/profile");
        } else {
          console.error(result.message);
        }
      } else {
        console.error("Error updating profile:", result);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div>
      <section className="form-container">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <h3>update profile</h3>
          <p>update name</p>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            maxLength="50"
            className="box"
            value={formData.name || ""}
            onChange={handleChange}
          />
          <p>update email</p>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            maxLength="50"
            className="box"
            value={formData.email || ""}
            onChange={handleChange}
          />
          <p>
            Your Profession <span>*</span>
          </p>
          <select
            name="profession"
            className="box"
            required
            aria-label="Profession"
            value={formData.profession || ""}
            onChange={handleChange}
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
          <p>previous password</p>
          <input
            type="password"
            name="old_pass"
            placeholder="enter your old password"
            maxLength="20"
            className="box"
            value={formData.old_pass || ""}
            onChange={handleChange}
          />
          <p>new password</p>
          <input
            type="password"
            name="new_pass"
            placeholder="enter your new password"
            maxLength="20"
            className="box"
            value={formData.new_pass || ""}
            onChange={handleChange}
          />
          <p>confirm password</p>
          <input
            type="password"
            name="c_pass"
            placeholder="confirm your new password"
            maxLength="20"
            className="box"
            value={formData.c_pass || ""}
            onChange={handleChange}
          />
          <p>update pic</p>
          <input
            type="file"
            accept="image/*"
            className="box"
            onChange={handleFileChange}
          />
          <input
            type="submit"
            value="update profile"
            name="submit"
            className="btn"
          />
        </form>
      </section>
    </div>
  );
};

export default Update;
