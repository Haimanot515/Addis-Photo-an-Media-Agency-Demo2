-- 1. CLEANUP: Remove existing table if it exists
DROP TABLE IF EXISTS contacts CASCADE;

-- 2. CREATE TABLE: Addis Photo & Media Inquiry Log
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    -- Reference to the users table (optional link if they are logged in)
    user_internal_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    
    -- Contact Details
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    
    -- Inquiry Content
    subject VARCHAR(150) DEFAULT 'General Inquiry',
    message TEXT NOT NULL,
    
    -- Metadata
    inquiry_status VARCHAR(20) DEFAULT 'NEW', -- e.g., NEW, IN_PROGRESS, RESOLVED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Indexing for faster admin lookups
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_status ON contacts(inquiry_status);