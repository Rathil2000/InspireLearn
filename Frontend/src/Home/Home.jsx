import { useState, useEffect } from "react"; 
import "./Home.css";

const Home = () => {
  const [playlists, setPlaylists] = useState([]);

  // Fetch admin data on component mount
  useEffect(() => {
    fetchPlaylists();
  }, []); // Empty dependency array to run the fetch on mount only

  // fetch playlists from the server
  const fetchPlaylists = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/playlist`);
      const data = await response.json();
      setPlaylists(data);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  return (
    <div>
      <section className="courses">
        <h1 className="course-title">Latest Courses</h1>

        <div className="box-container">
          {playlists.map((playlist) => (
            <div className="box" key={playlist._id}>
              <div className="box-content">
                <div className="playlist-info">
                  <h3 className="playlist-title">{playlist.title}</h3>
                  <p className="playlist-status">{playlist.status}</p>
                  <p className="playlist-description">{playlist.description}</p>
                </div>
                <div className="playlist-thumbnail">
                  {playlist.thumbnail && (
                    <img
                      src={`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/${playlist.thumbnail}`}
                      alt={playlist.title}
                      className="thumbnail"
                    />
                  )}
                </div>
              </div>
              <button
                className="inline-btn"
                onClick={() => (window.location.href = "playlist")}
              >
                View Playlist
              </button>
            </div>
          ))}
        </div>

        <div className="more-btn">
          <button
            className="inline-option-btn"
            onClick={() => (window.location.href = "courses")}
          >
            View All Courses
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
