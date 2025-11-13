import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/auth/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    );

    // Get the raw response text first for debugging
    const responseText = await res.text();
    console.log("Raw response:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError);
      alert("Server returned invalid response");
      return;
    }

    console.log("Response status:", res.status);
    console.log("Response data:", data);

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } else {
      alert(data.message || `Signup failed with status ${res.status}`);
    }
  } catch (err) {
    console.error("Network error:", err);
    if (err.message.includes("Failed to fetch")) {
      alert("Cannot connect to server. Please check if backend is running.");
    } else {
      alert("Something went wrong: " + err.message);
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm shadow-xl bg-base-100">
        <form onSubmit={handleSignup} className="card-body">
          <h2 className="card-title justify-center">Sign Up</h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input input-bordered"
            value={form.password}
            onChange={handleChange}
            required
          />

          <div className="form-control mt-4">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
