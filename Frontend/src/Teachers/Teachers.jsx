import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../UserContext';
import "./Teacher.css";
import image1 from '../Images/pic-1.jpg';
const Teachers = () => {
  const { user,setUser } = useContext(UserContext);
  const [teachers, setTeachers] = useState([]);

    useEffect(() => {
      const fetchTeachers = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/teachers`);
          const data = await response.json();
          setTeachers(data);
        } catch (error) {
          console.error('Error fetching teachers:', error);
        }
      };
  
      fetchTeachers();
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
            console.log("Fetched Admin Data:", data);
            if (data && data.email === loggedInEmail) {
              console.log("Found logged-in admin:", data);
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
      
      <section className="teachers-section">
        <h1 className="teacher-heading">Available Teachers</h1>
        <div className="teachers-container">
          {teachers.map((teacher) => (
            <div key={teacher._id} className="teacher-card">
               <img
                src={teacher.profileImage}
                alt={teacher.name}
                className="teacher-image"
                onError={(e) => (e.target.src = image1)} // Fallback to default image
              />
              <h3>{teacher.name}</h3>
              <p>{teacher.profession}</p>
              <p>Email: {teacher.email}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Teachers;
