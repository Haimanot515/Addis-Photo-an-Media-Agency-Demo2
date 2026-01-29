import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, Save, Trash2, Hash, Plus, RefreshCcw } from 'lucide-react';

const AdminPrivacyPolicy = () => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(false);

    const syncRegistry = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/admin/legal', { headers: { Authorization: `Bearer ${token}` } });
            setSections(res.data.registry.privacy.sort((a, b) => a.serial_number - b.serial_number));
        } catch (err) { console.error("PRIVACY_SYNC_FAIL"); }
        finally { setLoading(false); }
    };

    useEffect(() => { syncRegistry(); }, []);

    const addNode = () => {
        const nextSn = sections.length > 0 ? Math.max(...sections.map(s => s.serial_number)) + 1 : 1;
        setSections([...sections, { serial_number: nextSn, title: '', content: '', isNew: true }]);
    };

    const pushNode = async (index) => {
        const node = sections[index];
        try {
            const token = localStorage.getItem('token');
            await axios.put('/api/admin/legal/privacy', node, { headers: { Authorization: `Bearer ${token}` } });
            alert(`PRIVACY NODE ${node.serial_number} COMMITTED`);
            syncRegistry();
        } catch (err) { alert("PUSH_ERROR"); }
    };

    const dropNode = async (id, index) => {
        if (!window.confirm("EXECUTE DROP: REMOVE THIS PRIVACY RULE?")) return;
        try {
            const token = localStorage.getItem('token');
            if (id) await axios.delete(`/api/admin/legal/privacy/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            const updated = [...sections];
            updated.splice(index, 1);
            setSections(updated);
        } catch (err) { alert("DROP_ERROR"); }
    };

    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm mb-8">
            <div className="flex justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-3 rounded-2xl text-blue-600"><ShieldCheck size={24} /></div>
                    <h2 className="text-sm font-black uppercase tracking-widest">Privacy Authority</h2>
                </div>
                <div className="flex gap-2">
                    <button onClick={syncRegistry} className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"><RefreshCcw size={18} className={loading ? "animate-spin" : ""} /></button>
                    <button onClick={addNode} className="bg-[#1b1b2f] text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"><Plus size={16} className="inline mr-2"/> Add Rule</button>
                </div>
            </div>
            <div className="space-y-4">
                {sections.map((node, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                        <div className="col-span-1 relative">
                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={12}/>
                            <input type="number" value={node.serial_number} onChange={(e) => {const u = [...sections]; u[index].serial_number = e.target.value; setSections(u);}} className="w-full bg-white py-3 pl-8 rounded-xl text-[12px] font-black outline-none" />
                        </div>
                        <div className="col-span-3">
                            <input type="text" value={node.title} onChange={(e) => {const u = [...sections]; u[index].title = e.target.value; setSections(u);}} className="w-full bg-white py-3 px-4 rounded-xl text-[12px] font-bold uppercase outline-none" placeholder="TITLE" />
                        </div>
                        <div className="col-span-6">
                            <textarea value={node.content} onChange={(e) => {const u = [...sections]; u[index].content = e.target.value; setSections(u);}} className="w-full bg-white py-3 px-4 rounded-xl text-[12px] min-h-[46px] outline-none resize-none" placeholder="CONTENT..." />
                        </div>
                        <div className="col-span-2 flex gap-2 justify-end">
                            <button onClick={() => pushNode(index)} className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md shadow-blue-100"><Save size={16} /></button>
                            <button onClick={() => dropNode(node.id, index)} className="p-3 bg-white border border-slate-200 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default AdminPrivacyPolicy;