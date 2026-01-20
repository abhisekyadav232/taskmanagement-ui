import { useState } from 'react'
import api from '../api/axios'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('User')

  const navigate = useNavigate()

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("All fields required")
      return
    }

    try {
      await api.post('/auth/register', {
        name,
        email,
        password,
        role
      })

      alert("Registration successful. Please login.")
      navigate('/')
    } catch (err) {
      alert("Registration failed")
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-4">
      {/* Card Wrapper */}
      <div className="w-full max-w-md">
        {/* Glass Card */}
        <div className="bg-white/15 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">
              Create Account
            </h2>
            <p className="text-white/70 mt-2">
              Join us and get started
            </p>
          </div>

          {/* Name */}
          <div className="mb-5">
            <label className="block text-sm text-white/80 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 outline-none border border-white/20 focus:border-white focus:ring-2 focus:ring-white/40 transition"
            />
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm text-white/80 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 outline-none border border-white/20 focus:border-white focus:ring-2 focus:ring-white/40 transition"
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block text-sm text-white/80 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 outline-none border border-white/20 focus:border-white focus:ring-2 focus:ring-white/40 transition"
            />
          </div>

          {/* Role */}
          <div className="mb-6">
            <label className="block text-sm text-white/80 mb-1">
              Role
            </label>
            <select
              onChange={e => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white outline-none border border-white/20 focus:border-white focus:ring-2 focus:ring-white/40 transition"
            >
              <option className="text-black" value="User">User</option>
              <option className="text-black" value="Manager">Manager</option>
              <option className="text-black" value="Admin">Admin</option>
            </select>
          </div>

          {/* Button */}
          <button
            onClick={handleRegister}
            className="w-full py-3 rounded-lg bg-white text-indigo-600 font-semibold hover:bg-opacity-90 active:scale-95 transition transform"
          >
            Register
          </button>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-white/70">
            Already have an account?{' '}
            <Link 
              to="/" 
              className="text-white font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
