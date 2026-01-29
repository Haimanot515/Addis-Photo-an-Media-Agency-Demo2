import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await api.get('/about'); // Adjusted for your axios baseURL
        if (response.data && response.data.success) {
          setAboutData(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching about info:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  if (loading) return <main className="container about-us"><h1>Loading...</h1></main>;
  if (!aboutData) return null;

  return (
    <main className="container about-us">
      <section className="about-us" aria-labelledby="about-us-title">
        <h2 id="about-us-title">About Us</h2>
        <p>{aboutData.description_top}</p>
        <p>
          Visit our studio located in <strong>{aboutData.location_text}</strong>.
        </p>

        <div className="contact-info">
          {/* Studio Location */}
          <div className="contact-item location">
            <svg viewBox="0 0 24 24" className="icon location-icon"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" /></svg>
            <div className="contact-text">
              <span className="contact-label">Studio Location</span>
              <a href={aboutData.google_maps_link} target="_blank" rel="noopener noreferrer" className="contact-link">
                {aboutData.location_text}
              </a>
            </div>
          </div>

          {/* Phone */}
          <div className="contact-item phone">
            <svg viewBox="0 0 24 24" className="icon phone-icon"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 011 1v3.25a1 1 0 01-1 1A17 17 0 013 6a1 1 0 011-1h3.25a1 1 0 011 1c0 1.35.27 2.67.76 3.88a1 1 0 01-.21 1.11l-2.18 2.2z" /></svg>
            <div className="contact-text">
              <span className="contact-label">Phone</span>
              <a href={`tel:${aboutData.phone}`} className="contact-link">{aboutData.phone}</a>
            </div>
          </div>

          {/* Email */}
          <div className="contact-item email">
            <svg viewBox="0 0 24 24" className="icon email-icon"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 18V8l8 5 8-5v10H4z" /></svg>
            <div className="contact-text">
              <span className="contact-label">Email</span>
              <a href={`mailto:${aboutData.email}`} className="contact-link">{aboutData.email}</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;