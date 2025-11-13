import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/tickets/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setTicket(data.ticket);
        } else {
          alert(data.message || "Failed to fetch ticket");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-950 via-slate-900 to-cyan-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center animate-pulse">
            <svg className="w-10 h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-slate-300 text-lg">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-950 via-slate-900 to-cyan-950 flex items-center justify-center p-6">
        <div className="text-center backdrop-blur-xl bg-white/5 rounded-3xl p-12 border border-white/10">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Ticket Not Found</h2>
          <p className="text-slate-400">The ticket you're looking for doesn't exist</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-slate-900 to-cyan-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-2">
            Ticket Details
          </h2>
        </div>

        {/* Main Card */}
        <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl space-y-6">
          {/* Title and Status */}
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-3xl font-bold text-white flex-1">{ticket.title}</h3>
            {ticket.status && (
              <div className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap ${
                ticket.status === 'open' 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : ticket.status === 'closed' 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {ticket.status}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="pt-4 border-t border-white/10">
            <h4 className="text-lg font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Description
            </h4>
            <p className="text-slate-300 leading-relaxed">{ticket.description}</p>
          </div>

          {/* Metadata Section */}
          {ticket.status && (
            <>
              <div className="pt-4 border-t border-white/10">
                <h4 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Additional Information
                </h4>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Priority */}
                  {ticket.priority && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-sm text-slate-400 mb-2">Priority</p>
                      <div className={`inline-flex px-3 py-1 rounded-lg text-sm font-semibold ${
                        ticket.priority === 'high' 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                          : ticket.priority === 'medium' 
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {ticket.priority}
                      </div>
                    </div>
                  )}

                  {/* Assigned To */}
                  {ticket.assignedTo && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-sm text-slate-400 mb-2">Assigned To</p>
                      <p className="text-white font-medium">{ticket.assignedTo.email}</p>
                    </div>
                  )}

                  {/* Created At */}
                  {ticket.createdAt && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-sm text-slate-400 mb-2">Created At</p>
                      <p className="text-white font-medium">
                        {new Date(ticket.createdAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Related Skills */}
              {ticket.relatedSkills?.length > 0 && (
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-slate-400 mb-3">Related Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {ticket.relatedSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 text-cyan-300 rounded-lg text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Helpful Notes */}
              {ticket.helpfulNotes && (
                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-lg font-semibold text-slate-300 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Helpful Notes
                  </h4>
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 prose prose-invert max-w-none">
                    <ReactMarkdown>{ticket.helpfulNotes}</ReactMarkdown>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}