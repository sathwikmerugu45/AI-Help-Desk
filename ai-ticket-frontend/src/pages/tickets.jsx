import { useState, useEffect } from "react";

export default function Tickets() {
  const [form, setForm] = useState({ title: "", description: "" });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTickets = async () => {
    try {
      setError("");
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        headers: { 
          "Content-Type": "application/json"
        },
        method: "GET",
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      setTickets(data.tickets || data || []);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
      if (err.message.includes("Failed to fetch")) {
        setError("Cannot connect to server. Please check if the backend is running.");
      } else {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      if (!form.title.trim() || !form.description.trim()) {
        setError("Title and description are required");
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const text = await res.text();
      console.log("Raw backend response:", text);

      let data = {};
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("Response not valid JSON");
        setError("Server returned invalid response");
        return;
      }

      if (res.ok) {
        setForm({ title: "", description: "" });
        await fetchTickets();
      } else {
        setError(data.message || data.error || "Ticket creation failed");
      }
    } catch (err) {
      console.error("Network error:", err);
      if (err.message.includes("Failed to fetch")) {
        setError("Cannot connect to server. Please check if the backend is running.");
      } else {
        setError("Error creating ticket: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTicketClick = (ticketId) => {
    // Navigation would be handled by your router
    window.location.href = `/tickets/${ticketId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-slate-900 to-cyan-950 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header with gradient text */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            Support Tickets
          </h1>
          <p className="text-slate-400">Create and manage your support requests</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 backdrop-blur-xl bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-red-200">{error}</span>
            </div>
            <button 
              onClick={fetchTickets}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-all duration-200 text-sm font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {/* Create Ticket Form - Glassmorphism */}
        <div className="mb-10 backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            Create New Ticket
          </h2>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Brief description of your issue"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Provide detailed information about your issue..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200 resize-none"
                rows="4"
                required
              ></textarea>
            </div>

            <button 
              className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              onClick={handleSubmit} 
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Submit Ticket
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tickets List */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-orange-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            All Tickets
            <span className="text-sm font-normal text-slate-400 ml-auto">
              {tickets.length} {tickets.length === 1 ? 'ticket' : 'tickets'}
            </span>
          </h2>

          <div className="grid gap-4">
            {tickets.map((ticket, index) => (
              <div
                key={ticket._id}
                onClick={() => handleTicketClick(ticket._id)}
                className="group cursor-pointer block backdrop-blur-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/10"
                style={{
                  animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors duration-200 flex-1">
                    {ticket.title}
                  </h3>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    ticket.status === 'open' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : ticket.status === 'closed' 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {ticket.status || 'open'}
                  </div>
                </div>
                
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                  {ticket.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="text-cyan-400 group-hover:text-cyan-300 flex items-center gap-1">
                    View Details
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
            
            {tickets.length === 0 && !error && (
              <div className="text-center py-16 backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                  <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No Tickets Yet</h3>
                <p className="text-slate-500">Create your first support ticket using the form above</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}