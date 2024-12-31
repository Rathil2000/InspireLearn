import "./Contact.css";
import contact from "../Images/contact-img.svg";
import { useState } from "react";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile_number, setMobile_number] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const Submit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:3001/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          mobile_number,
          message,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("result:", result);
        setSuccessMessage("Contact form submitted successfully.");
        setName("");
        setEmail("");
        setMobile_number("");
        setMessage("");
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } catch (err) {
      setErrorMessage("Failed to submit the contact form. Please try again.");
      console.error(err);
    }
  };

  return (
    <section className="contact">
      <div className="row">
        <div className="image">
          <img src={contact} alt="Contact Illustration" />
        </div>

        <form onSubmit={Submit}>
          <h3>get in touch</h3>
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <input
            type="text"
            placeholder="Enter your name"
            required
            maxLength="50"
            className="box"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Enter your email"
            required
            maxLength="50"
            className="box"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="number"
            placeholder="Enter your number"
            required
            maxLength="50"
            className="box"
            value={mobile_number}
            onChange={(e) => setMobile_number(e.target.value)}
          />
          <textarea
            className="box"
            placeholder="Enter your message"
            required
            maxLength="1000"
            cols="30"
            rows="10"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <input type="submit" value="Send Message" className="inline-btn" />
        </form>
      </div>

      <div className="box-container">
        <div className="box">
          <h3>phone number</h3>
          <a href="mob:9879229264">+91 9879229264</a>
          <a href="alternate mob:6353754602">+91 6353754602</a>
        </div>

        <div className="box">
          <h3>email address</h3>
          <a href="mailto:rathilthummar@gmail.com">rathilthummar@gmail.com</a>
          <a href="mailto:rathilthummar1@gmail.com">rathilthummar1@gmail.com</a>
        </div>

        <div className="box">
          <h3>office address</h3>
          <span>
            VIIT college backgate, Betal Nagar, Kondhwa, Pune, Maharashtra
            411048
          </span>
        </div>
      </div>
    </section>
  );
}

export default Contact;
