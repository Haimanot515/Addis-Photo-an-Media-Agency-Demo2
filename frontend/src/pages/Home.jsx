import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios'; 

const HomePage = () => {
  const [services, setServices] = useState([]);
  const [features, setFeatures] = useState([]);
  const [aboutData, setAboutData] = useState(null);
  const [heroData, setHeroData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resServices, resFeatures, resAbout, resHero] = await Promise.all([
          api.get('/services'),
          api.get('/home/features'),
          api.get('/about'),
          api.get('/home/hero')
        ]);
        if (resServices.data.success) setServices(resServices.data.data);
        if (resFeatures.data.success) setFeatures(resFeatures.data.data);
        if (resAbout.data.success) setAboutData(resAbout.data.data);
        if (resHero.data.success) setHeroData(resHero.data.data);
      } catch (err) {
        console.error("Error fetching home data:", err);
      }
    };
    fetchData();
  }, []);

  const heroStyle = {
    backgroundImage: heroData?.hero_bg 
      ? `url(${heroData.hero_bg})` 
      : "url('../images/photo8.jpg')",
    position: 'relative',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  return (
    <>
      {/* Hero Section */}
      <header className="hero" style={heroStyle}>
        {/* Added padding-bottom to ensure content doesn't hit the marquee */}
        <div className="hero-text" style={{ paddingBottom: '100px', textAlign: 'center' }}>
          <h1>{heroData?.hero_title || "Addis Photo & Media Agency"}</h1>
          <p>{heroData?.hero_subtitle || "Professional Photography & Videography Across Ethiopia"}</p>
          <Link to="/contact" className="btn">Book a Session</Link>
        </div>

        {/* Marquee pinned to the bottom edge of the screen */}
        <div style={{ 
          position: 'absolute', 
          bottom: '0', 
          left: '0', 
          width: '100%', 
          background: '#b8c3da', 
          color: '#333', 
          padding: '10px 0', 
          fontFamily: 'Arial, sans-serif', 
          zIndex: '10',
          borderTop: '1px solid rgba(0,0,0,0.1)'
        }}>
          <marquee behavior="scroll" direction="left" scrollamount="6" style={{ fontSize: '1.2rem', fontWeight: 'bold', display: 'block' }}>
            {heroData?.hero_marquee || "We take the first position in the country. Our Lens - Addis Photo & Media helps you tell your story through stunning photos and videos. Quality work, trusted service, everywhere in Ethiopia. Visit us today!"}
          </marquee>
        </div>
      </header>

      <main className="container">
        {/* Services Section */}
        <section className="services">
          <h2>Our Services</h2>
          <div className="services-bottom">
            <img 
              src={services.length > 0 && services[0].image_url ? services[0].image_url : "../images/camera20.jpg"} 
              alt="Our Services" 
            />
            <ul>
              {services.length > 0 ? (
                services.map((service) => (
                  <li key={service.id}>{service.title}</li>
                ))
              ) : (
                <>
                  <li>Wedding Photography</li>
                  <li>Graduation Photos</li>
                  <li>Studio Portraits</li>
                  <li>Event Coverage</li>
                  <li>Passport Photos</li>
                </>
              )}
            </ul>
          </div>
        </section>

        {/* Featured Works Gallery */}
        <section className="featured-works">
          <h2>Featured Works</h2>
          <div className="gallery">
            {features.length > 0 ? (
              features.map((item) => (
                <img key={item.id} src={item.src} alt={item.alt || "Gallery Image"} />
              ))
            ) : (
              <>
                <img src="../images/photo1.jpg" alt="Wedding" />
                <img src="../images/passa.jpg" alt="Wedding" />
                <img src="../images/GC5.jpg" alt="Graduation" />
                <img src="../images/passport.jpg" alt="Wedding" />
                <img src="../images/photo3.jpg" alt="Studio Portrait" />
                <img src="../images/GC7.jpg" alt="Wedding" />
                <img src="../images/gc1.jpg" alt="Event" />
                <img src="../images/photo5.jpg" alt="Passport" />
                <img src="../images/photo0.jpg" alt="Outdoor Session" />
                <img src="../images/cty.jpg" alt="Wedding" />
                <img src="../images/s1.jpg" alt="Wedding" />
                <img src="../images/photo8.jpg" alt="Graduation" />
                <img src="../images/outdoora.jpg" alt="Graduation" />
                <img src="../images/girls.jpg" alt="Graduation" />
              </>
            )}
          </div>
        </section>

        {/* About Us Section */}
        <section className="about-us" aria-labelledby="about-us-title">
          <h2 id="about-us-title">About Us</h2>
          <p>
            {aboutData ? aboutData.description_top : "With over 10 years of experience, Addis Photo & Media Agency offers professional photography and videography services across Addis Ababa and beyond."}
          </p>
          <p>
            Visit our studio located in <strong>{aboutData ? aboutData.location_text : "5 Kilo, Addis Ababa"}</strong>.
          </p>

          <div className="contact-info">
            <div className="contact-item location">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" width="24" height="24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/>
              </svg>
              <div className="contact-text">
                <span className="contact-label">Studio Location</span>
                <a href={aboutData ? aboutData.google_maps_link : "#"} target="_blank" rel="noopener noreferrer" className="contact-link">
                  {aboutData ? aboutData.location_text : "AAiT 5 Kilo, Addis Ababa"}
                </a>
              </div>
            </div>

            <div className="contact-item phone">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" width="24" height="24">
                <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 011 1v3.25a1 1 0 01-1 1A17 17 0 013 6a1 1 0 011-1h3.25a1 1 0 011 1c0 1.35.27 2.67.76 3.88a1 1 0 01-.21 1.11l-2.18 2.2z"/>
              </svg>
              <div className="contact-text">
                <span className="contact-label">Phone</span>
                <a href={`tel:${aboutData ? aboutData.phone : "+251943257078"}`} className="contact-link">{aboutData ? aboutData.phone : "+251943257078"}</a>
              </div>
            </div>

            <div className="contact-item email">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" width="24" height="24">
                <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm-1.4 3.25L12 13.07 5.4 7.25H18.6zM4 18V8.4l8 5 8-5V18H4z"/>
              </svg>
              <div className="contact-text">
                <span className="contact-label">Email</span>
                <a href={`mailto:${aboutData ? aboutData.email : "haimanotbeka@gmail.com"}`} className="contact-link">{aboutData ? aboutData.email : "haimanotbeka@gmail.com"}</a>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Section */}
        <section className="booking container">
          <div className="booking-info">
            <h2>Booking</h2>
            <p>To book a photoshoot, please contact us via phone or email, or use our contact page form.</p>
            <Link to="/contact" className="btn">Contact Us</Link>
          </div>

          <form className="subscribe-form" action="https://formsubmit.co/haimanotbeka@gmail.com" method="POST">
            <input type="email" name="email" placeholder="Enter your email" required />
            <button className="btn-subscribe-btn" type="submit">Subscribe</button>
          </form>
        </section>
      </main>
    </>
  );
};

export default HomePage;