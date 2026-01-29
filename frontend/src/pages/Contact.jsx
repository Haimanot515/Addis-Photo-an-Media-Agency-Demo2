import React, { useState } from 'react';
import api from '../api/axios'; 

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', msg: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setFeedback({ type: '', msg: '' });

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      /**
       * ENDPOINT CORRECTION:
       * In server.js, you have: app.use("/api/contact", contactRoutes);
       * In axios.js, you have: baseURL: .../api
       * Sending to '/' here points to exactly /api/contact/
       */
      const response = await api.post('/contact/', data, { 
        withCredentials: true 
      });

      if (response.data.success) {
        setFeedback({ type: 'success', msg: "Message sent successfully!" });
        e.target.reset(); 
      }
    } catch (error) {
      console.error("Submission error:", error);
      
      // Stop the redirect behavior by handling the 401 status here
      if (error.response?.status === 401) {
        setFeedback({ type: 'error', msg: "Authentication required. Please log in." });
      } else {
        const errorMsg = error.response?.data?.message || "Failed to send message.";
        setFeedback({ type: 'error', msg: errorMsg });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container contact" aria-labelledby="contact-title">
      <h1 id="contact-title">Contact Us</h1>

      <div className="contact-wrapper">
        <section className="contact-details" aria-label="Contact information">
          <h2>Get in Touch</h2>
          <p>We’re here to help! Reach out to us by phone, email, or visit our studio.</p>

          <ul className="contact-list" role="list">
            <li className="contact-item">
              <svg className="icon phone-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" width="24" height="24">
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 011 1v3.25a1 1 0 01-1 1A17 17 0 013 6a1 1 0 011-1h3.25a1 1 0 011 1c0 1.35.27 2.67.76 3.88a1 1 0 01-.21 1.11l-2.18 2.2z" />
              </svg>
              <a href="tel:+251943257078" className="contact-link">+251943257078</a>
            </li>

            <li className="contact-item">
              <svg className="icon email-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" width="24" height="24">
                <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 18V8l8 5 8-5v10H4z" />
              </svg>
              <a href="mailto:haimanotbeka@gmail.com" className="contact-link">haimanotbeka@gmail.com</a>
            </li>
          </ul>
        </section>

        <section className="contact-form-section" aria-label="Contact form">
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <h2>Send Us a Message</h2>

            {feedback.msg && (
              <div className={`form-feedback ${feedback.type}`} 
                   style={{ 
                     color: feedback.type === 'success' ? 'green' : 'red', 
                     padding: '10px', 
                     backgroundColor: feedback.type === 'success' ? '#f0fff4' : '#fff5f5',
                     borderRadius: '4px',
                     marginBottom: '1rem' 
                   }}>
                {feedback.msg}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input type="text" id="name" name="name" placeholder="Your full name" required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input type="email" id="email" name="email" placeholder="you@example.com" required />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" name="phone" placeholder="+251 9..." />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea id="message" name="message" rows="5" placeholder="Write your message here..." required></textarea>
            </div>

            <button 
              type="submit" 
              className="btn-submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Contact;