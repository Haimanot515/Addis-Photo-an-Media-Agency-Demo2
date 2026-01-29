import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios'; // Adjust path to your axios instance

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Added only this state for the hide/show logic
  const [expandedPostId, setExpandedPostId] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetching from your backend
        const response = await api.get('/posts'); 
        
        // Corrected to access the data array within your success response
        setPosts(response.data.data || []); 
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setError("Failed to load stories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="container-blog"><h1>Loading Stories...</h1></div>;
  if (error) return <div className="container-blog"><h1>{error}</h1></div>;

  return (
    <main className="container-blog">
      <h1>Photography Tips &amp; Stories</h1>

      <section className="articles">
        {posts.length > 0 ? (
          posts.map((post) => {
            const isExpanded = expandedPostId === (post.id || post.slug);
            
            return (
              <article key={post.id || post.slug}>
                <h2>{post.title}</h2>
                <p>
                  {isExpanded 
                    ? post.content 
                    : (post.excerpt || (post.content && post.content.substring(0, 150) + "..."))
                  }
                </p>
                
                {/* Toggle button that keeps your 'read-btn' style */}
                <button 
                  className="read-btn"
                  style={{ border: 'none', cursor: 'pointer', display: 'inline-block' }}
                  onClick={() => setExpandedPostId(isExpanded ? null : (post.id || post.slug))}
                >
                  {isExpanded ? "Show Less" : "Read More"}
                </button>
              </article>
            );
          })
        ) : (
          <p>No articles found.</p>
        )}
      </section>
    </main>
  );
};

export default Blog;