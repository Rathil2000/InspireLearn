import { useState,useEffect } from "react";
import "./FavouritePlaylist.css";

const FavouritePlaylist = () => {
  const [playlists, setPlaylists] = useState([]);
  const [courses, setCourses] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const fetchPlaylists = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/favorite-playlist`);
      const data = await response.json();
      setPlaylists(data);

      const courseResponse = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/courses`);
      const courseData = await courseResponse.json();
      const filteredCourses = courseData.filter((course) =>
        data.some((playlist) => playlist.title === course.playlist)
      );
      setCourses(filteredCourses);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  });

  const handleView = (course) => {
    setSelectedCourse(course);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/favorite-playlist/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          alert("Playlist deleted successfully!");
          fetchPlaylists();
        } else {
          alert("Failed to delete playlist.");
        }
      } catch (error) {
        console.error("Error deleting playlist:", error);
      }
    }
  };

  return (
    <div>
      <div className="playlists-table">
        <h2>Available Playlists</h2>
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Title</th>
              <th>Description</th>
              <th>Thumbnail</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {playlists.map((playlist) => (
              <tr key={playlist._id}>
                <td>{playlist.status}</td>
                <td>{playlist.title}</td>
                <td>{playlist.description}</td>
                <td>
                  {playlist.thumbnail && (
                    <img
                      src={`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/${playlist.thumbnail}`}
                      alt={playlist.title}
                      className="thumbnail"
                    />
                  )}
                </td>
                <td>
                  <button onClick={() => handleDelete(playlist._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
            {Array.isArray(courses) &&
              courses.map((course) => (
                <tr key={course._id}>
                  <td>
                    <div className="image-container">
                      <img
                        src={`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/${course.thumbnail}`}
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

                      <button
                        onClick={() => handleDelete(course._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
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

export default FavouritePlaylist;
