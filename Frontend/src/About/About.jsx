import "./About.css";

function Home() {
  return (
    <section className="home-grid">
      <h1 className="heading">quick options</h1>
      <div className="box-container">
        <div className="box">
          <h3 className="title">likes and comments</h3>
          <p className="likes">
            total likes: <span>25</span>
          </p>
          <button
            className="inline-btn"
            onClick={() => {
              /* Add your view likes functionality */
            }}
          >
            view likes
          </button>
          <p className="likes">
            total comments: <span>12</span>
          </p>
          <button
            className="inline-btn"
            onClick={() => {
              /* Add your view comments functionality */
            }}
          >
            view comments
          </button>
          <p className="likes">
            saved playlists: <span>4</span>
          </p>
          <button
            className="inline-btn"
            onClick={() => {
              /* Add your view playlists functionality */
            }}
          >
            view playlists
          </button>
        </div>

        <div className="box">
          <h3 className="title">top categories</h3>
          <div className="flex">
            <button
              onClick={() => {
                /* Add your development functionality */
              }}
            >
              <i className="fas fa-code"></i>
              <span>development</span>
            </button>
            <button
              onClick={() => {
                /* Add your business functionality */
              }}
            >
              <i className="fas fa-chart-simple"></i>
              <span>business</span>
            </button>
            <button
              onClick={() => {
                /* Add your design functionality */
              }}
            >
              <i className="fas fa-pen"></i>
              <span>design</span>
            </button>
            <button
              onClick={() => {
                /* Add your marketing functionality */
              }}
            >
              <i className="fas fa-chart-line"></i>
              <span>marketing</span>
            </button>
            <button
              onClick={() => {
                /* Add your music functionality */
              }}
            >
              <i className="fas fa-music"></i>
              <span>music</span>
            </button>
            <button
              onClick={() => {
                /* Add your photography functionality */
              }}
            >
              <i className="fas fa-camera"></i>
              <span>photography</span>
            </button>
            <button
              onClick={() => {
                /* Add your software functionality */
              }}
            >
              <i className="fas fa-cog"></i>
              <span>software</span>
            </button>
            <button
              onClick={() => {
                /* Add your science functionality */
              }}
            >
              <i className="fas fa-vial"></i>
              <span>science</span>
            </button>
          </div>
        </div>

        <div className="box">
          <h3 className="title">popular topics</h3>
          <div className="flex">
            <button
              onClick={() => {
                /* Add your HTML functionality */
              }}
            >
              <i className="fab fa-html5"></i>
              <span>HTML</span>
            </button>
            <button
              onClick={() => {
                /* Add your CSS functionality */
              }}
            >
              <i className="fab fa-css3"></i>
              <span>CSS</span>
            </button>
            <button
              onClick={() => {
                /* Add your JavaScript functionality */
              }}
            >
              <i className="fab fa-js"></i>
              <span>JavaScript</span>
            </button>
            <button
              onClick={() => {
                /* Add your React functionality */
              }}
            >
              <i className="fab fa-react"></i>
              <span>React</span>
            </button>
            <button
              onClick={() => {
                /* Add your PHP functionality */
              }}
            >
              <i className="fab fa-php"></i>
              <span>PHP</span>
            </button>
            <button
              onClick={() => {
                /* Add your Bootstrap functionality */
              }}
            >
              <i className="fab fa-bootstrap"></i>
              <span>Bootstrap</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
