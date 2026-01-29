import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        {/* Top footer: About, Quick Links, Contact Info */}
        <div className="footer-top">
          
          {/* About */}
          <div className="footer-section footer-about">
            <h3>About Addis Photo & Media</h3>
            <p>
              We provide professional photography and media solutions in Ethiopia. 
              Capturing your moments with passion and precision.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/team">Team</Link></li>
              <li><Link to="/portfolio">Gallery</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section footer-contact">
            <h3>Contact Info</h3>
            <ul>
              <li><strong>Address:</strong> Addis Ababa, Ethiopia</li>
              <li>
                <strong>Phone:</strong>{" "}
                <a href="tel:+251911234567">+251 911 234 567</a>
              </li>
              <li>
                <strong>Email:</strong>{" "}
                <a href="mailto:haimanotbeka@gmail.com">
                  haimanotbeka@gmail.com
                </a>
              </li>
              <li><strong>Working Hours:</strong> Mon - Fri, 9AM - 6PM</li>
            </ul>
          </div>

          {/* Social Media Icons */}
          <div className="social-icons">
            <a
              href="https://t.me/haimasearchjobplanstart"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className="social-icon telegram"
            >
              <svg width="32" height="32" viewBox="0 0 240 240">
                <circle cx="120" cy="120" r="120" fill="#0088cc"/>
                <path d="M180 60L50 108c-9 3-9 14-1 18l33 11 12 39c2 6 9 7 13 2l18-19 34 25c7 4 16 1 18-7l20-97c2-10-6-18-15-15z" fill="#fff"/>
              </svg>
            </a>

            <a
              href="https://instagram.com/haimanotbeka"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="social-icon instagram"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
                <defs>
                  <linearGradient id="insta-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#feda75"/>
                    <stop offset="50%" stopColor="#fa7e1e"/>
                    <stop offset="100%" stopColor="#d62976"/>
                  </linearGradient>
                </defs>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#insta-gradient)" strokeWidth="2"/>
                <circle cx="12" cy="12" r="5" stroke="url(#insta-gradient)" strokeWidth="2" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="url(#insta-gradient)" />
              </svg>
            </a>

            <a
              href="https://facebook.com/haimanotbeka"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="social-icon facebook"
            >
              <svg width="32" height="32" viewBox="0 0 512 512">
                <rect width="512" height="512" rx="100" fill="#1877F2"/>
                <path d="M355 330l10-72h-67v-47c0-20 10-39 41-39h32V109s-29-5-56-5c-57 0-94 34-94 96v58h-63v72h63v173h78V330h56z" fill="#fff"/>
              </svg>
            </a>

            <a
              href="https://twitter.com/yourtwitter"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="social-icon twitter"
            >
              <svg width="32" height="32" viewBox="0 0 512 512">
                <rect width="512" height="512" rx="100" fill="#1DA1F2"/>
                <path d="M437 152c-14 6-29 11-45 12 16-9 28-24 34-42-15 9-32 15-50 19-14-15-34-24-56-24-42 0-76 35-76 77 0 6 1 12 2 17-63-3-118-34-155-80-7 11-11 24-11 38 0 26 13 49 34 62-13 0-24-4-34-9v1c0 37 26 69 61 76-6 2-14 3-22 3-5 0-11 0-16-1 11 34 43 58 81 59-29 23-66 36-106 36-7 0-14 0-21-1 38 24 83 38 131 38 157 0 243-132 243-246v-11c17-12 31-28 42-46z" fill="#fff"/>
              </svg>
            </a>

            <a
              href="https://linkedin.com/in/yourlinkedin"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="social-icon linkedin"
            >
              <svg width="32" height="32" viewBox="0 0 512 512">
                <rect width="512" height="512" rx="100" fill="#0A66C2"/>
                <path d="M164 416h-74V198h74zm-37-248a43 43 0 1 1 0-86 43 43 0 0 1 0 86zM416 416h-74v-110c0-26 0-59-36-59-36 0-42 28-42 57v112h-74V198h71v30h1c10-19 33-39 69-39 74 0 85 49 85 112z" fill="#fff"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-legal-payments">
            <div className="footer-section payment-methods-section">
              <h3>Payment Methods</h3>
              <div className="payment-methods">
                <a href="https://telebirr.et" target="_blank" rel="noopener noreferrer">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5a/Telebirr_logo.svg" alt="Telebirr" />
                </a>
                <a href="https://www.combanketh.et" target="_blank" rel="noopener noreferrer">
                  <img src="https://www.combanketh.et/sites/default/files/CBE-Logo-Vector-01.png" alt="CBE Birr" />
                </a>
                <a href="https://amole.et" target="_blank" rel="noopener noreferrer">
                  <img src="https://amole.et/img/logo-amole.png" alt="Amole" />
                </a>
              </div>
            </div>

            {/* Legal Links */}
            <div className="legal-links">
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/cookie-policy">Cookie Policy</Link>
            </div>
          </div>
        </div>

        <div className="footer-copy">
          <p>© 2025 Addis Photo & Media Agency. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
