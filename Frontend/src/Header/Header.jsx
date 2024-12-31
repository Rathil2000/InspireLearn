import "./Header.css";
import PropTypes from "prop-types";
import { BsSearch, BsPersonCircle, BsMoonFill, BsList,BsBoxArrowLeft  } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
function Header({ toggleSidebar }) {
  const navigate = useNavigate(); // Initialize history
  const handleLogout = () => {
    // Navigate to the appropriate login page based on the user's role
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData.role === "admin") {
      navigate("/admin-login");
    } else if (userData.role === "user") {
      navigate("/user-login");
    } else {
      navigate("/"); // In case the role is not set or unknown
    }
  };
  return (
    <header className="header">
      <section className="flex">
        <div className="heading">
          <div className="heading-box">
            <a href="/home" className="logo">
              TrackMyCourse.
            </a>
          </div>
          <div className="heading-box">
            <form className="search-form">
              <input
                type="text"
                placeholder="search courses"
                maxLength={100}
              ></input>
              <BsSearch className="search-btn"></BsSearch>
            </form>
          </div>
          <div className="heading-box">
            <span className="users-btns">
              <BsList className="button" onClick={toggleSidebar}></BsList>
              <BsSearch className="button" id="bsSearch-btn"></BsSearch>
              <BsPersonCircle className="button"></BsPersonCircle>
              <BsMoonFill className="button"></BsMoonFill>
              <BsBoxArrowLeft className="button" onClick={handleLogout} ></BsBoxArrowLeft>
            </span>
          </div>
        </div>
      </section>
    </header>
  );
}

Header.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};

export default Header;
