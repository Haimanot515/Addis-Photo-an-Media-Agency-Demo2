import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        if (response.data && response.data.success) {
          setServices(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) return <main className="coservices container"><h1>Loading...</h1></main>;

  return (
    <main className="coservices container">
      <h1>Our Services</h1>
      <ul>
        {services.map((service) => (
          <li key={service.id}>
            <strong>{service.title}</strong> {service.description}
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Services;