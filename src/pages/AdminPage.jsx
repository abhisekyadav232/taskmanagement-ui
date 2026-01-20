import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllTasks } from '../api/store/taskSlice'
import { logout } from '../api/store/authSlice'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

export default function AdminPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const tasks = useSelector(state => state.tasks.list)

  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [menuOpen, setMenuOpen] = useState(null)

  // Edit states
  const [editTask, setEditTask] = useState(null)
  const [editUser, setEditUser] = useState(null)

  // Task fields
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')
  const [deadline, setDeadline] = useState('')

  // User fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')

  // Filters
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [filterDeadline, setFilterDeadline] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [searchUser, setSearchUser] = useState('')

  useEffect(() => {
    dispatch(fetchAllTasks())
  }, [dispatch])

  useEffect(() => {
    api.get('/users/me').then(res => setUser(res.data))
  }, [])

  useEffect(() => {
    api.get('/users').then(res => setUsers(res.data))
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const getUserName = id => {
    const u = users.find(x => x.id === id)
    return u ? u.name : 'Unassigned'
  }

  // ---------------- TASK ----------------

  const openEditTask = task => {
    setEditTask(task)
    setStatus(task.status || 'Pending')
    setPriority(task.priority || 'Medium')
    setDeadline(task.deadline ? task.deadline.slice(0, 10) : '')
    setMenuOpen(null)
  }

  const updateTask = async () => {
    if (!status || !priority || !deadline) {
      return alert('All fields required')
    }

    try {
      const payload = {
        title: editTask.title,
        description: editTask.description,
        assignedToUserId: editTask.assignedToUserId,
        status,
        priority,
        deadline: new Date(deadline).toISOString()
      }

      await api.put(`/tasks/${editTask.id}`, payload)
      setEditTask(null)
      dispatch(fetchAllTasks())
    } catch (err) {
      console.error(err)
      alert('Task update failed')
    }
  }

  const deleteTask = async id => {
    if (!window.confirm('Delete this task?')) return
    try {
      await api.delete(`/tasks/${id}`)
      dispatch(fetchAllTasks())
      setMenuOpen(null)
    } catch {
      alert('Delete failed')
    }
  }

  // ---------------- USER ----------------

  const openEditUser = u => {
    setEditUser(u)
    setName(u.name)
    setEmail(u.email)
    setRole(u.role)
    setMenuOpen(null)
  }

  const updateUser = async () => {
    try {
      await api.put(`/users/${editUser.id}`, { name, email, role })
      const res = await api.get('/users')
      setUsers(res.data)
      setEditUser(null)
    } catch {
      alert('User update failed')
    }
  }

  const deleteUser = async id => {
    if (!window.confirm('Delete this user?')) return
    try {
      await api.delete(`/users/${id}`)
      setUsers(prev => prev.filter(u => u.id !== id))
      setMenuOpen(null)
    } catch {
      alert('Delete failed')
    }
  }

  

  // ---------------- FILTERED DATA ----------------

  const filteredTasks = tasks.filter(t => {
    const matchStatus = filterStatus ? t.status === filterStatus : true
    const matchPriority = filterPriority ? t.priority === filterPriority : true
    const matchDeadline = filterDeadline ? t.deadline?.slice(0, 10) === filterDeadline : true
    return matchStatus && matchPriority && matchDeadline
  })

  const filteredUsers = users.filter(u => {
    const matchRole = filterRole ? u.role === filterRole : true
    const matchSearch = searchUser
      ? u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
        u.email.toLowerCase().includes(searchUser.toLowerCase())
      : true
    return matchRole && matchSearch
  })

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-900">

      {/* HEADER */}
      <div className="flex justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold">Admin Dashboard</h2>
          {user && <p className="text-gray-600">{user.name} | {user.email} ({user.role})</p>}
        </div>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded height-fit">
          Logout
        </button>
      </div>

      {/* TASK FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 grid md:grid-cols-4 gap-4">
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border p-2 rounded">
          <option value="">All Status</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="border p-2 rounded">
          <option value="">All Priority</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <input type="date" value={filterDeadline} onChange={e => setFilterDeadline(e.target.value)} className="border p-2 rounded" />

        <button onClick={() => { setFilterStatus(''); setFilterPriority(''); setFilterDeadline('') }} className="bg-gray-200 rounded">
          Clear
        </button>
      </div>

      {/* TASKS */}
      <h3 className="text-2xl font-semibold mb-4">Tasks</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredTasks.map(task => (
          <div key={task.id} className="relative bg-white p-6 rounded-xl shadow">
            <button onClick={() => setMenuOpen(menuOpen === `task-${task.id}` ? null : `task-${task.id}`)} className="absolute top-3 right-3 text-xl">⋮</button>

            {menuOpen === `task-${task.id}` && (
              <div className="absolute right-3 top-10 bg-white border rounded shadow w-32 z-10">
                <button onClick={() => openEditTask(task)} className="block w-full px-4 py-2 text-left hover:bg-gray-100">Edit</button>
                <button onClick={() => deleteTask(task.id)} className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100">Delete</button>
              </div>
            )}

            <h3 className="font-bold">{task.title}</h3>
            <p>{task.description}</p>
            <p className="text-sm text-gray-500">Assigned: {getUserName(task.assignedToUserId)}</p>
            <p className="text-sm text-gray-500">Deadline: {task.deadline?.slice(0, 10)}</p>
          </div>
        ))}
      </div>
      {/* USER FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 grid md:grid-cols-3 gap-4">
        <input
          placeholder="Search name or email..."
          value={searchUser}
          onChange={e => setSearchUser(e.target.value)}
          className="border p-2 rounded"
        />

        <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="border p-2 rounded">
          <option value="">All Roles</option>
          <option>User</option>
          <option>Manager</option>
          <option>Admin</option>
        </select>

        <button
          onClick={() => {
            setFilterRole('')
            setSearchUser('')
          }}
          className="bg-gray-200 hover:bg-gray-300 rounded px-4 py-2"
        >
          Clear User Filters
        </button>
      </div>

      {/* USERS */}
      <h3 className="text-2xl font-semibold mb-4">Users</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(u => (
          <div key={u.id} className="relative bg-white p-6 rounded-xl shadow">
            <button onClick={() => setMenuOpen(menuOpen === `user-${u.id}` ? null : `user-${u.id}`)} className="absolute top-3 right-3 text-xl">⋮</button>

            {menuOpen === `user-${u.id}` && (
              <div className="absolute right-3 top-10 bg-white border rounded shadow w-32 z-10">
                <button onClick={() => openEditUser(u)} className="block w-full px-4 py-2 text-left hover:bg-gray-100">Edit</button>
                <button onClick={() => deleteUser(u.id)} className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100">Delete</button>
              </div>
            )}

            <h4 className="font-bold">{u.name}</h4>
            <p>{u.email}</p>
            <p className="text-sm text-gray-500">{u.role}</p>
          </div>
        ))}
      </div>

      {/* EDIT TASK MODAL */}
      {editTask && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="font-bold mb-3">Edit Task</h3>

            <select value={status} onChange={e => setStatus(e.target.value)} className="border p-2 w-full mb-2">
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>

            <select value={priority} onChange={e => setPriority(e.target.value)} className="border p-2 w-full mb-2">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="border p-2 w-full mb-4" />

            <div className="flex justify-end gap-2">
              <button onClick={() => setEditTask(null)}>Cancel</button>
              <button onClick={updateTask} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editUser && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="font-bold mb-3">Edit User</h3>

            <input value={name} onChange={e => setName(e.target.value)} className="border p-2 w-full mb-2" />
            <input value={email} onChange={e => setEmail(e.target.value)} className="border p-2 w-full mb-2" />

            <select value={role} onChange={e => setRole(e.target.value)} className="border p-2 w-full mb-4">
              <option>User</option>
              <option>Manager</option>
              <option>Admin</option>
            </select>

            <div className="flex justify-end gap-2">
              <button onClick={() => setEditUser(null)}>Cancel</button>
              <button onClick={updateUser} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
