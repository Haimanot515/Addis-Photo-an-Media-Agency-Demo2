import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminTeam = () => {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Form State
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [education, setEducation] = useState("");
    const [phone, setPhone] = useState("");
    const [file, setFile] = useState(null);

    // 1. READ: Fetch the Team Registry
    const fetchTeam = async () => {
        try {
            const res = await axios.get('/api/admin/team');
            if (res.data.success) setTeam(res.data.data);
        } catch (err) {
            console.error("Registry Fetch Error:", err);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, []);

    // 2. PUSH: Commit a New Node to the Registry
    const handlePush = async (e) => {
        e.preventDefault();
        if (!file || !name || !role) return alert("Missing required fields (Name, Role, Image)");

        const formData = new FormData();
        formData.append('image', file); // Field name must match upload.single("image")
        formData.append('name', name);
        formData.append('role', role);
        formData.append('education', education);
        formData.append('phone', phone);

        setLoading(true);
        try {
            const res = await axios.post('/api/admin/team', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                alert("REGISTRY PUSH: Node committed.");
                // Reset form
                setName(""); setRole(""); setEducation(""); setPhone(""); setFile(null);
                fetchTeam(); // Refresh list
            }
        } catch (err) {
            console.error("PUSH ERROR:", err.response?.data);
            alert("Authority rejected the PUSH request.");
        } finally {
            setLoading(false);
        }
    };

    // 3. DROP: Remove a Node from the Registry
    const handleDrop = async (id) => {
        if (!window.confirm("Confirm REGISTRY DROP? This action is permanent.")) return;

        try {
            const res = await axios.delete(`/api/admin/team/${id}`);
            if (res.data.success) {
                alert("REGISTRY DROP: Node purged.");
                fetchTeam();
            }
        } catch (err) {
            console.error("DROP ERROR:", err);
            alert("Authority rejected the DROP request.");
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold mb-6 text-green-800">Team Management Authority</h2>

            {/* PUSH FORM */}
            <form onSubmit={handlePush} className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-2xl">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">PUSH New Member</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded" required />
                    <input type="text" placeholder="Role (e.g. Agronomist)" value={role} onChange={(e) => setRole(e.target.value)} className="border p-2 rounded" required />
                    <input type="text" placeholder="Education" value={education} onChange={(e) => setEducation(e.target.value)} className="border p-2 rounded" />
                    <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="border p-2 rounded" />
                    <div className="col-span-full">
                        <label className="block text-sm text-gray-600 mb-1">Member Image</label>
                        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full border p-1 rounded" required />
                    </div>
                </div>
                <button type="submit" disabled={loading} className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400">
                    {loading ? "Syncing..." : "COMMIT PUSH"}
                </button>
            </form>

            {/* REGISTRY LIST */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {team.map((member) => (
                    <div key={member.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <img src={member.image} alt={member.name} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h4 className="font-bold text-lg">{member.name}</h4>
                            <p className="text-green-700 font-medium">{member.role}</p>
                            <p className="text-sm text-gray-500 mt-2 italic">{member.education}</p>
                            <button onClick={() => handleDrop(member.id)} className="mt-4 text-red-600 font-semibold text-sm hover:underline">
                                [DROP NODE]
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminTeam;