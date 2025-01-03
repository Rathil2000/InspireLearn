import { useContext, useEffect} from "react";
import { UserContext } from "../../UserContext"; // Adjusted path
import image1 from "../Images/pic-1.jpg";
import "./Sidebar.css";

function Sidebar() {
  const { user, setUser } = useContext(UserContext); // Access and update user context

  useEffect(()=>{
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem("user");
        console.log(storedUser,111222);
      if (storedUser) {
        setUser(JSON.parse(storedUser)); // Use existing user data
      } else {
        // Get logged-in email and role from localStorage
        const loggedInEmail = localStorage.getItem("loggedInEmail");
        const role = localStorage.getItem("role"); // Assume role is stored ('admin' or 'user')

        const apiUrl =
          role === "admin"
            ? `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/admin`
            : `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/user`;

        try {
          const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch data from ${apiUrl}`);
          }

          const data = await response.json();
          console.log(data,222);
          if (data && data.email === loggedInEmail) {
            setUser(data); // Set user in context
            localStorage.setItem("user", JSON.stringify(data)); // Cache user data
          } else {
            console.error("User not found or email mismatch!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          alert("An error occurred while fetching user data.");
        }
      }
    };

    fetchUserData();
  }, [setUser]);
  return (
    <div className="side-bar">
      <div id="close-btn">
        <i className="fas fa-times"></i>
      </div>

      <div className="profile">
        <img
          src={`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/${user?.profileImage || image1}`} // Use profileImage or default image
          className="image"
          alt={user?.name || "User"} // Use user's name or "User"
        />
        <h3 className="name">{user?.name || "Guest"}</h3> {/* User's name or fallback */}
        <p className="role">{user?.profession || "User Role"}</p> {/* Profession */}
        <button
          className="btn"
          onClick={() => (window.location.href = "/profile")} // Navigate to profile
        >
          View Profile
        </button>
      </div>

      <nav className="navbar">
        <a href="home">
          <i className="fas fa-home"></i>
          <span>home</span>
        </a>
        <a href="about">
          <i className="fas fa-question"></i>
          <span>about</span>
        </a>
        <a href="playlist">
          <i className="fas fa-question"></i>
          <span>playlist</span>
        </a>
        <a href="favorite-playlist">
          <i className="fas fa-question"></i>
          <span>favorite Playlist</span>
        </a>
        <a href="courses">
          <i className="fas fa-graduation-cap"></i>
          <span>courses</span>
        </a>
        <a href="teachers">
          <i className="fas fa-chalkboard-user"></i>
          <span>teachers</span>
        </a>
        <a href="users">
          <i className="fas fa-chalkboard-user"></i>
          <span>users</span>
        </a>
        <a href="contact">
          <i className="fas fa-headset"></i>
          <span>contact us</span>
        </a>
      </nav>
    </div>
  );
}

export default Sidebar;
