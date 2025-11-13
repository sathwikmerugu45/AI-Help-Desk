import { useEffect, useState } from "react";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ role: "", skills: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/users`);

      if (!res.ok) {
        throw new Error(`Failed to fetch users: ${res.status}`);
      }

      const data = await res.json();
      setUsers(data);
      setFilteredUsers(data);
      
    } catch (err) {
      console.error("Error fetching users", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user.email);
    setFormData({
      role: user.role,
      skills: user.skills?.join(", ") || "",
    });
  };

  const handleUpdate = async () => {
    try {
      setError("");
      
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/update-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: editingUser,
            role: formData.role,
            skills: formData.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean),
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update user");
      }

      setEditingUser(null);
      setFormData({ role: "", skills: "" });
      fetchUsers();
      
    } catch (err) {
      console.error("Update failed", err);
      setError(err.message);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(
      users.filter((user) => user.email.toLowerCase().includes(query))
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center animate-pulse">
            <svg className="w-10 h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-slate-300 text-lg">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 flex items-center justify-center p-6">
        <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2 text-center">Error Loading Users</h2>
          <p className="text-slate-400 text-center mb-6">{error}</p>
          <button 
            onClick={fetchUsers}
            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-slate-400 mt-1">Manage user roles and permissions</p>
            </div>
          </div>
        </div>
        
        {/* Error Alert */}
        {error && (
          <div className="mb-6 backdrop-blur-xl bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-red-200">{error}</span>
            </div>
          </div>
        )}
        
        {/* Search Bar */}
        <div className="mb-6 backdrop-blur-xl bg-white/5 rounded-2xl p-2 border border-white/10 shadow-2xl">
          <div className="flex items-center gap-3 px-4">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 py-3"
              placeholder="Search users by email..."
              value={searchQuery}
              onChange={handleSearch}
            />
            {searchQuery && (
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setFilteredUsers(users);
                }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* User Cards */}
        <div className="space-y-4">
          {filteredUsers.map((user, index) => (
            <div
              key={user._id}
              className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden"
              style={{
                animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`
              }}
            >
              <div className="p-6">
                {editingUser === user.email ? (
                  /* Edit Mode */
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold">{user.email}</p>
                        <p className="text-slate-400 text-sm">Editing user details</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Role</label>
                        <select
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-200"
                          value={formData.role}
                          onChange={(e) =>
                            setFormData({ ...formData, role: e.target.value })
                          }
                        >
                          <option value="user" className="bg-slate-900">User</option>
                          <option value="moderator" className="bg-slate-900">Moderator</option>
                          <option value="admin" className="bg-slate-900">Admin</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Skills</label>
                        <input
                          type="text"
                          placeholder="e.g. React, Node.js, Python"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-200"
                          value={formData.skills}
                          onChange={(e) =>
                            setFormData({ ...formData, skills: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        className="flex-1 py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/25"
                        onClick={handleUpdate}
                      >
                        Save Changes
                      </button>
                      <button
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold rounded-xl transition-all duration-200 border border-white/10"
                        onClick={() => setEditingUser(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/25">
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-lg truncate">{user.email}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                            user.role === 'admin' 
                              ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                              : user.role === 'moderator' 
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                              : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-400 mb-2">Skills</p>
                      {user.skills && user.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {user.skills.map((skill, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 rounded-lg text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 text-sm">No skills assigned</p>
                      )}
                    </div>

                    <button
                      className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/25 whitespace-nowrap"
                      onClick={() => handleEditClick(user)}
                    >
                      Edit User
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty States */}
        {filteredUsers.length === 0 && users.length > 0 && (
          <div className="text-center py-16 backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
              <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No Users Found</h3>
            <p className="text-slate-500">Try adjusting your search query</p>
          </div>
        )}

        {users.length === 0 && !loading && (
          <div className="text-center py-16 backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
              <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No Users</h3>
            <p className="text-slate-500">There are no users in the system yet</p>
          </div>
        )}
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
      `}</style>
    </div>
  );
}