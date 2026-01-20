import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../api/store/authSlice'
import api from '../api/axios'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', { email, password })
      dispatch(loginSuccess(res.data))

      if (res.data.role === 'Admin') navigate('/admin')
      if (res.data.role === 'Manager') navigate('/manager')
      if (res.data.role === 'User') navigate('/user')
    } catch {
      alert("Invalid credentials")
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/15 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white p-3">Login</h2>

            <input
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 outline-none border border-white/20 focus:border-white focus:ring-2 focus:ring-white/40 transition mb-5"
            placeholder="Email"
            onChange={e => setEmail(e.target.value)}
            />

            <input
            type="password"
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 outline-none border border-white/20 focus:border-white focus:ring-2 focus:ring-white/40 transition mb-5"
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
            />

            <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
            Login
            </button>

            <p className="text-center mt-4 text-sm text-white">
            Don’t have an account?{' '}
            <Link to="/register" className="text-blue-600 underline text-white">
                Sign up
            </Link>
            </p>
        </div>
      </div>
    </div>
  )
}
