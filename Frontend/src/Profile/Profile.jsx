import { useEffect, useContext } from "react";
import { UserContext } from "../../UserContext"; // Adjusted path
import "./Profile.css";

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      // If user data exists in localStorage, set it to the context
      setUser(JSON.parse(storedUser));
    } else {
      // Get logged-in admin's email from localStorage
      const loggedInEmail = localStorage.getItem("loggedInEmail");

      fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/admin`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.email === loggedInEmail) {
            setUser(data); // Set user in context
            // Save the user data in localStorage for future page loads
            localStorage.setItem("user", JSON.stringify(data));
          } else {
            console.error("Admin not found or email mismatch!");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          alert("An error occurred while fetching user data.");
        });
    }
  }, [setUser]);

  
  return (
    <div>
      <section className="user-profile">
        <h1 className="profile-heading">your profile</h1>

        <div className="info">
          <div className="user">
            <img
              src={user?.profileImage || user?.name} // Use profileImage or default image
              className="image"
              alt={user?.name || "User"} // Use user's name or "User"
            />
            <h3 className="name">{user?.name || "Guest"}</h3>{" "}
            {/* User's name or fallback */}
            <p className="role">{user?.role || "User Role"}</p>{" "}
            <button
              className="inline-btn"
              onClick={() => (window.location.href = "update")}
            >
              update profile
            </button>
          </div>

          <div className="box-container">
            <div className="box">
              <div className="flex">
                <i className="fas fa-bookmark"></i>
                <div>
                  <span>4</span>
                  <p>saved playlist</p>
                </div>
              </div>
              <button
                className="inline-profileBtn"
                onClick={() => {
                  /* Add your view playlists functionality */
                }}
              >
                view playlists
              </button>
            </div>

            <div className="box">
              <div className="flex">
                <i className="fas fa-heart"></i>
                <div>
                  <span>33</span>
                  <p>videos liked</p>
                </div>
              </div>
              <button
                className="inline-profileBtn"
                onClick={() => {
                  /* Add your view liked videos functionality */
                }}
              >
                view liked
              </button>
            </div>

            <div className="box">
              <div className="flex">
                <i className="fas fa-comment"></i>
                <div>
                  <span>12</span>
                  <p>videos comments</p>
                </div>
              </div>
              <button
                className="inline-profileBtn"
                onClick={() => {
                  /* Add your view comments functionality */
                }}
              >
                view comments
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
