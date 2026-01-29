import React, { useState, useEffect } from 'react';
import api from '../api/axios'; // Adjust path to your axios instance

const Portfolio = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await api.get('/portfolio');
        
        // Handling the backend response wrapper: { success: true, data: [...] }
        if (response.data && response.data.success) {
          setGalleryItems(response.data.data);
        } else {
          setGalleryItems([]);
        }
      } catch (err) {
        console.error("Error fetching portfolio:", err);
        setError("Could not load gallery items.");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  if (loading) return <main className="container container-portfolio"><h1>Loading Gallery...</h1></main>;
  if (error) return <main className="container container-portfolio"><h1>{error}</h1></main>;

  return (
    <main className="container container-portfolio">
      <h1>Portfolio</h1>
      <div className="gallery">
        {galleryItems.length > 0 ? (
          galleryItems.map((item, index) => (
            <img 
              key={item.id || index} 
              src={item.src} 
              alt={item.alt} 
              loading="lazy" 
            />
          ))
        ) : (
          <p>No images found in portfolio.</p>
        )}
      </div>
    </main>
  );
};

export default Portfolio;