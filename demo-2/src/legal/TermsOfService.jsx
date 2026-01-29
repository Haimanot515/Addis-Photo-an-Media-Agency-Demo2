import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios"; 

const TermsOfService = () => {
  const [data, setData] = useState({ title: "Terms of Service", effectiveDate: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setLoading(true);
        const response = await api.get("/legal/terms-of-service", { withCredentials: true });
        if (response.data.success) setData(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Authentication required. Please log in.");
        } else {
          setError(err.response?.data?.message || "Unable to load Terms of Service.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTerms();
  }, []);

  if (loading) return <div className="container" style={{ padding: "100px 20px", textAlign: "center" }}><div className="media-loader"></div></div>;

  return (
    <main className="container legal-page" style={{ padding: "100px 20px", lineHeight: "1.8" }}>
      {error ? (
        <div style={{ color: 'red', textAlign: 'center' }}><h2>{error}</h2><Link to="/login" className="btn-submit">Login</Link></div>
      ) : (
        <>
          <h1>{data.title}</h1>
          <p><strong>Effective Date:</strong> {data.effectiveDate}</p>
          <hr />
          <article className="policy-body" dangerouslySetInnerHTML={{ __html: data.content }} />
          <Link to="/home" className="btn-submit" style={{ marginTop: "2rem", display: "inline-block", textDecoration: 'none' }}>Accept & Return</Link>
        </>
      )}
    </main>
  );
};

export default TermsOfService;