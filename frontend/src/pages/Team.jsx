import React, { useState, useEffect } from 'react';
import api from '../api/axios'; // Adjust path to your axios instance

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await api.get('/team'); 
        
        // Handling the backend response wrapper: { success: true, data: [...] }
        if (response.data && response.data.success) {
          setTeamMembers(response.data.data);
        } else {
          setTeamMembers([]);
        }
      } catch (err) {
        console.error("Error fetching team members:", err);
        setError("Could not load team members.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  if (loading) return <main className="container team"><h1>Loading Team...</h1></main>;
  if (error) return <main className="container team"><h1>{error}</h1></main>;

  return (
    <main className="container team" id="team">
      <h1>Meet Our Team</h1>
      <section className="team-members">
        {teamMembers.length > 0 ? (
          teamMembers.map((member, index) => (
            <article className="member" key={member.id || index} tabIndex="0">
              <img src={member.image} alt={`Portrait of ${member.name}`} />
              <h2>{member.name}</h2>
              <p>{member.role}</p>
              <p>{member.education}</p>
              <p>Phone: {member.phone}</p>
            </article>
          ))
        ) : (
          <p>No team members found.</p>
        )}
      </section>
    </main>
  );
};

export default Team;