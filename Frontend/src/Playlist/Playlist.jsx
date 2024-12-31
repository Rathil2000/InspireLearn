import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../UserContext";
import "./Playlist.css";
// import image1 from "../Images/pic-1.jpg";
// import { useNavigate } from "react-router-dom";

const Playlist = () => {
  const { user, setUser } = useContext(UserContext);
  const [showPopup, setShowPopup] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentPlaylistId, setCurrentPlaylistId] = useState(null);
  //   const navigate = useNavigate();
  const [playlistData, setPlaylistData] = useState({
    status: "Select Status",
    title: "",
    description: "",
    thumbnail: null,
  });

  useEffect(() => {
    fetchPlaylists();
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      // If user data exists in localStorage, set it to the context
      setUser(JSON.parse(storedUser));
    } else {
      // Get logged-in admin's email from localStorage
      const loggedInEmail = localStorage.getItem("loggedInEmail");

      fetch("http://localhost:3001/api/admin", {
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

  const fetchPlaylists = async () => {
    try {
      const response = await fetch("http://localhost:3001/playlist");
      const data = await response.json();
      setPlaylists(data);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  const handleAddToFavorites = async (playlistId) => {
    try {
      const response = await fetch(`http://localhost:3001/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id, playlistId }),
      });

      if (response.ok) {
        alert("Playlist added to favorites!");
      } else {
        const errorText = await response.text();
        console.error("Failed to add to favorites:", errorText);
        alert(`Failed to add to favorites. Details: ${errorText}`);
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
      alert("An error occurred while adding to favorites.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlaylistData({ ...playlistData, [name]: value });
  };

  const handleThumbnailChange = (e) => {
    setPlaylistData({ ...playlistData, thumbnail: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("status", playlistData.status);
    formData.append("title", playlistData.title);
    formData.append("description", playlistData.description);
    if (playlistData.thumbnail) {
      formData.append("thumbnail", playlistData.thumbnail);
    }

    const url = editMode
      ? `http://localhost:3001/playlists/${currentPlaylistId}`
      : "http://localhost:3001/playlist";
    const method = editMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        body: formData,
      });
      // Check if the response is successful
      if (!response.ok) {
        const errorText = await response.text();
        console.error("HTTP Error:", response.status);
        console.error("Error Details:", errorText);
        alert(
          `Failed to save playlist: ${response.status}. Details: ${errorText}`
        );
        return;
      }
      const result = await response.json(); // Parse the response
      if (response.ok) {
        if (result.message === "Playlist added successfully") {
          alert("Playlist added successfully!");
        } else if (result.message === "Playlist updated successfully") {
          alert("Playlist updated successfully!");
        } else {
          alert(`${result.message}`);
        }

        setShowPopup(false);
        setEditMode(false);
        setCurrentPlaylistId(null);
        setPlaylistData({
          status: "Select Status",
          title: "",
          description: "",
          thumbnail: null,
        });
        fetchPlaylists(); // Refresh playlists
      } else {
        alert(`Failed to save playlist. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving the playlist.");
    }
  };

  const handleEdit = (playlist) => {
    setEditMode(true);
    setShowPopup(true);
    setCurrentPlaylistId(playlist._id);
    setPlaylistData({
      status: playlist.status,
      title: playlist.title,
      description: playlist.description,
      thumbnail: null, // Thumbnail will remain unchanged unless updated
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      try {
        const response = await fetch(`http://localhost:3001/playlists/${id}`, {
          method: "DELETE",
        });

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
      <div>working...</div>
      {/* Main Content */}
      <main>
        {user?.role === "admin" && (
          <button className="btn1" onClick={() => setShowPopup(true)}>
            Add Playlist
          </button>
        )}
        {/* Playlists Table */}
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
                        src={`http://localhost:3001/${playlist.thumbnail}`}
                        alt={playlist.title}
                        className="thumbnail"
                      />
                    )}
                  </td>
                  <td>
                  {user?.role === "admin" && (
                    <button onClick={() => handleEdit(playlist)}>Edit</button>
                  )}
                  {user?.role === "admin" && (
                    <button onClick={() => handleDelete(playlist._id)}>
                      Delete
                    </button>
                  )}

                    <button onClick={() => handleAddToFavorites(playlist._id)}>
                      Add to Favorites
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Popup Form */}
        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <h3>{editMode ? "Edit Playlist" : "Create New Playlist"}</h3>
              <button onClick={() => setShowPopup(null)} className="close-btn">
                X
              </button>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="status">Status:</label>
                  <select
                    name="status"
                    id="status"
                    value={playlistData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Select Status" disabled>
                      Select Status
                    </option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="title">Playlist Title:</label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Enter playlist title"
                    value={playlistData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Playlist Description:</label>
                  <textarea
                    name="description"
                    id="description"
                    placeholder="Enter playlist description"
                    value={playlistData.description}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="thumbnail">Thumbnail:</label>
                  <input
                    type="file"
                    name="thumbnail"
                    id="thumbnail"
                    onChange={handleThumbnailChange}
                  />
                </div>
                <button type="submit">
                  {editMode ? "Update Playlist" : "Create Playlist"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Playlist;
