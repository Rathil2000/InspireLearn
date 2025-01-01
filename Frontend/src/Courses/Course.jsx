import { useState, useEffect, useContext } from "react";
import "./Course.css";
import { UserContext } from "../../UserContext";
// Assuming you have an API endpoint to fetch playlists from MongoDB

const fetchPlaylists = async () => {
  const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/playlist`); // API for fetching playlists
  const data = await response.json();

  // Create an array of key-value pairs
  const keyValuePairs = data.map((item) => [item._id, item.title]);

  // Convert the key-value pairs into an object
  const playlists = Object.fromEntries(keyValuePairs);

  return playlists;
};

const showPopupMenuAPI = async () => {
  const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/playlist`); // API for popup menu data
  // Check if the response status is OK (status code 200-299)
  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  console.log(data, 222);
  // Create an array of key-value pairs
  const keyValuePairs = data.map((item) => [item._id, item.title]);

  // Convert the key-value pairs into an object
  const finalData = Object.fromEntries(keyValuePairs);
  return finalData;
};

const Courses = () => {
  const { user, setUser } = useContext(UserContext);
  const [courses, setCourses] = useState([]); // State for storing available courses
  const [finalData, setPlaylists] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [courseData, setCourseData] = useState({
    status: "Select Status",
    title: "",
    description: "",
    playlist: "",
    thumbnail: null,
    video: null,
    notes: null,
  });
  const [selectedCourse, setSelectedCourse] = useState(null); // For update/view

  useEffect(() => {
    // Fetch playlists from MongoDB on component mount
    fetchPlaylists().then((finalData) => setPlaylists(finalData));
    fetchCourses();
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

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/courses`); // API endpoint for courses

      if (!response.ok) {
        throw new Error(`Error fetching courses: ${response.statusText}`);
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/courses/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete course: ${response.statusText}`);
      }
      alert("Course deleted successfully!");
      fetchCourses(); // Refresh course list after deletion
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  const handleView = (course) => {
    setSelectedCourse(course);
  };

  // Fetch playlists when the dropdown is clicked
  const handleFetchPlaylists = async () => {
    try {
      const fetchedPlaylists = await fetchPlaylists();
      setPlaylists(
        Object.entries(fetchedPlaylists).map(([id, title]) => ({ id, title }))
      );
    } catch (error) {
      console.error("Failed to fetch playlists:", error);
    }
  };

  // Fetch popup menu data when showing the popup
  const handleShowPopup = async () => {
    try {
      await showPopupMenuAPI();
      setShowPopup(true);
    } catch (error) {
      console.error("Failed to fetch popup menu data:", error);
    }
  };

  // Add or Update Course
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("status", courseData.status);
    formData.append("title", courseData.title);
    formData.append("description", courseData.description);
    formData.append("playlist", courseData.playlist);
    if (courseData.thumbnail) {
      formData.append("thumbnail", courseData.thumbnail);
    }
    if (courseData.video) {
      formData.append("video", courseData.video);
    }
    if (courseData.notes) {
      formData.append("notes", courseData.notes);
    }
    const url = editMode
      ? `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/courses/${currentCourseId}`
      : `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/courses`;
    const method = editMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        body: formData,
      });

      // Handle Response
      if (!response.ok) {
        const errorText = await response.text();
        console.error("HTTP Error:", response.status);
        console.error("Error Details:", errorText);
        alert(
          `Failed to save course: ${response.status}. Details: ${errorText}`
        );
        return;
      }

      const result = await response.json();

      if (result.message === "Course added successfully") {
        alert("Course added successfully!");
      } else if (result.message === "Course updated successfully") {
        alert("Course updated successfully!");
      } else {
        alert(result.message);
      }

      // Reset State
      setShowPopup(false);
      setEditMode(false);
      setCurrentCourseId(null);
      setCourseData({
        status: "Select Status",
        title: "",
        description: "",
        thumbnail: null,
      });

      fetchCourses(); // Refresh courses
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving the course.");
    }
  };

  // Edit Course
  const handleEdit = (course) => {
    setEditMode(true);
    setShowPopup(true);
    setCurrentCourseId(course._id);
    setCourseData({
      status: course.status,
      title: course.title,
      description: course.description,
      thumbnail: null, // Thumbnail will remain unchanged unless updated
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: files[0] }));
  };

  return (
    <div>
      {/* Add Course Button */}
      {user?.role === "admin" && (
        <button onClick={handleShowPopup} className="add-course-btn">
          Add Course
        </button>
      )}
      {/* Popup Form */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <button onClick={() => setShowPopup(false)} className="close-btn">
              X
            </button>
            <h3>Add New Course</h3>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={courseData.status}
                  onChange={handleInputChange}
                >
                  <option value="Select Status" disabled>
                    Select Status
                  </option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="form-group">
                <label>Video Title</label>
                <input
                  type="text"
                  name="title"
                  value={courseData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Video Description</label>
                <textarea
                  name="description"
                  value={courseData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Select Playlist</label>
                <select
                  name="playlist"
                  value={courseData.playlist}
                  onClick={handleFetchPlaylists} // Fetch playlists on click
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Playlist</option>
                  {Object.values(finalData).map((playlist) => (
                    <option key={playlist._id} value={playlist._id}>
                      {playlist.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Upload Thumbnail</label>
                <input
                  type="file"
                  name="thumbnail"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                />
              </div>
              <div className="form-group">
                <label>Upload Video</label>
                <input
                  type="file"
                  name="video"
                  onChange={handleFileChange}
                  accept="video/*"
                  required
                />
              </div>
              <div className="form-group">
                <label>Upload Notes</label>
                <input
                  type="file"
                  name="notes"
                  onChange={handleFileChange}
                  accept=".pdf,.docx"
                  required
                />
              </div>
              <button type="submit" className="submit-btn">
                Submit Course
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="course-table">
        <h2>Available Courses</h2>
        <table>
          <thead>
            <tr>
              <th>Thumbnail</th>
              <th>Title</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td>
                  <div className="image-container">
                    <img
                      src={`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/${course.thumbnail}`} // Ensure backend provides thumbnail URLs
                      alt={course.title}
                    />
                  </div>
                </td>
                <td>{course.title}</td>
                <td>{course.status}</td>
                <td>{new Date(course.createdAt).toLocaleString()}</td>
                <td>
                  <div className="actions">
                    <button
                      onClick={() => handleView(course)}
                      className="view-btn"
                    >
                      View
                    </button>
                    {user?.role === "admin" && (
                      <button
                        onClick={() => handleEdit(course)}
                        className="update-btn"
                      >
                        Update
                      </button>
                    )}
                    {user?.role === "admin" && (
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Course Modal */}
      {selectedCourse && (
        <div className="modal active">
          {/* Apply 'active' class to make modal visible */}
          <div className="modal-content">
            <button
              onClick={() => setSelectedCourse(null)}
              className="close-btn"
            >
              X
            </button>
            <h3>{selectedCourse.title}</h3>

            <video
              controls
              src={`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/${selectedCourse.video}`} // Backend should provide video URL
              className="course-video"
            ></video>
            <p>{selectedCourse.description}</p>
            <a
              href={`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/${selectedCourse.notes}`}
              target="_blank"
              rel="noopener noreferrer"
              className="notes-link"
            >
              View Notes
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
