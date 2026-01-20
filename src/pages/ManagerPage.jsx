import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createTask, fetchAllTasks, updateTask } from '../api/store/taskSlice'
import { logout } from '../api/store/authSlice'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

export default function ManagerPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const tasks = useSelector(state => state.tasks.list)

  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [menuOpen, setMenuOpen] = useState(null)

  // CREATE STATES
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [userId, setUserId] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [createDeadline, setCreateDeadline] = useState('')

  // EDIT STATES
  const [editTask, setEditTask] = useState(null)
  const [editStatus, setEditStatus] = useState('')
  const [editPriority, setEditPriority] = useState('')
  const [editDeadline, setEditDeadline] = useState('')

  // FILTER STATES
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [filterDeadline, setFilterDeadline] = useState('')

  // LOAD PROFILE + TASKS
  useEffect(() => {
    api.get('/users/me')
      .then(res => setUser(res.data))
      .catch(() => navigate('/'))

    dispatch(fetchAllTasks())
  }, [dispatch, navigate])

  // LOAD USERS
  useEffect(() => {
    api.get('/users').then(res => setUsers(res.data))
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const getUserName = (id) => {
    const u = users.find(x => x.id === id)
    return u ? u.name : 'Unassigned'
  }

  // CREATE TASK
  const handleCreate = async () => {
    if (!title || !desc || !userId || !createDeadline) {
      return alert("All fields required")
    }

    const payload = {
      title,
      description: desc,
      priority,
      deadline: new Date(createDeadline).toISOString(),
      assignedToUserId: Number(userId)
    }

    try {
      await dispatch(createTask(payload)).unwrap()

      setShowForm(false)
      setTitle('')
      setDesc('')
      setUserId('')
      setPriority('Medium')
      setCreateDeadline('')

      dispatch(fetchAllTasks())
    } catch {
      alert("Create failed")
    }
  }

  // OPEN EDIT
  const handleUpdate = (task) => {
    setEditTask(task)
    setEditStatus(task.status)
    setEditPriority(task.priority)
    setEditDeadline(task.deadline?.slice(0, 10))
    setMenuOpen(null)
  }

  // SUBMIT UPDATE
  const submitUpdate = async () => {
    try {
      await dispatch(updateTask({
        id: editTask.id,
        data: {
          status: editStatus,
          priority: editPriority,
          deadline: new Date(editDeadline).toISOString()
        }
      })).unwrap()

      setEditTask(null)
      dispatch(fetchAllTasks())
    } catch {
      alert("Update failed")
    }
  }

  // FILTERED TASKS (FIXED)
  const filteredTasks = tasks.filter(task => {
    const matchStatus = filterStatus ? task.status === filterStatus : true
    const matchPriority = filterPriority ? task.priority === filterPriority : true
    const matchDeadline = filterDeadline
      ? task.deadline?.slice(0, 10) === filterDeadline
      : true

    return matchStatus && matchPriority && matchDeadline
  })

  // BADGE STYLES
  const statusStyle = (s) =>
    s === "Completed" ? "bg-green-100 text-green-700" :
    s === "In Progress" ? "bg-yellow-100 text-yellow-700" :
    "bg-gray-100 text-gray-700"

  const priorityStyle = (p) =>
    p === "High" ? "bg-red-100 text-red-700" :
    p === "Medium" ? "bg-yellow-100 text-yellow-700" :
    "bg-green-100 text-green-700"

  // STATS (can be tasks or filteredTasks)
  const totalTasks = filteredTasks.length
  const completedTasks = filteredTasks.filter(t => t.status === "Completed").length
  const pendingTasks = filteredTasks.filter(t => t.status === "Pending").length

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-900">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Manager Dashboard</h1>
        {user && <p className="text-gray-600">{user.name} | {user.email}</p>}

        <div className="mt-4 flex gap-3 justify-end">
          <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
            + Add Task
          </button>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 grid md:grid-cols-4 gap-4">
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border p-2 rounded">
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="border p-2 rounded">
          <option value="">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <input type="date" value={filterDeadline} onChange={e => setFilterDeadline(e.target.value)} className="border p-2 rounded" />

        <button
          onClick={() => {
            setFilterStatus('')
            setFilterPriority('')
            setFilterDeadline('')
          }}
          className="bg-gray-200 hover:bg-gray-300 rounded px-4 py-2"
        >
          Clear Filters
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Total Tasks</p>
          <h2 className="text-2xl font-bold">{totalTasks}</h2>
        </div>
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Completed</p>
          <h2 className="text-2xl font-bold">{completedTasks}</h2>
        </div>
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Pending</p>
          <h2 className="text-2xl font-bold">{pendingTasks}</h2>
        </div>
      </div>

      {/* TASK LIST */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map(task => (
          <div key={task.id} className="bg-white p-6 rounded-xl shadow relative">

            <button onClick={() => setMenuOpen(menuOpen === task.id ? null : task.id)} className="absolute top-4 right-4 text-xl">
              ⋮
            </button>

            {menuOpen === task.id && (
              <div className="absolute right-4 top-10 bg-white border rounded shadow w-32 z-10">
                <button onClick={() => handleUpdate(task)} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                  Edit
                </button>
              </div>
            )}

            <h3 className="text-lg font-bold">{task.title}</h3>
            <p className="text-gray-600 mb-2">{task.description}</p>

            <p className="text-sm text-gray-500 mb-1">
              Assigned to: <b>{getUserName(task.assignedToUserId)}</b>
            </p>

            <p className="text-sm text-gray-500 mb-3">
              Deadline: <b>{task.deadline ? new Date(task.deadline).toLocaleDateString() : "No deadline"}</b>
            </p>

            <div className="flex gap-2">
              <span className={`px-2 py-1 rounded ${statusStyle(task.status)}`}>
                {task.status}
              </span>
              <span className={`px-2 py-1 rounded ${priorityStyle(task.priority)}`}>
                {task.priority}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {(showForm || editTask) && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl">

            <h3 className="text-xl font-bold mb-4">
              {showForm ? "Create Task" : "Update Task"}
            </h3>

            {showForm && (
              <>
                <input className="border p-3 w-full mb-3 rounded" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
                <textarea className="border p-3 w-full mb-3 rounded" placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />

                <select className="border p-3 w-full mb-3 rounded" value={priority} onChange={e => setPriority(e.target.value)}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>

                <select className="border p-3 w-full mb-3 rounded" value={userId} onChange={e => setUserId(e.target.value)}>
                  <option value="">Select User</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>

                <input type="date" className="border p-3 w-full mb-4 rounded" value={createDeadline} onChange={e => setCreateDeadline(e.target.value)} />

                <div className="flex justify-end gap-3">
                  <button onClick={() => setShowForm(false)} className="border px-4 py-2 rounded">Cancel</button>
                  <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
                </div>
              </>
            )}

            {editTask && (
              <>
                <select className="border p-3 w-full mb-3 rounded" value={editStatus} onChange={e => setEditStatus(e.target.value)}>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>

                <select className="border p-3 w-full mb-3 rounded" value={editPriority} onChange={e => setEditPriority(e.target.value)}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>

                <input type="date" className="border p-3 w-full mb-4 rounded" value={editDeadline} onChange={e => setEditDeadline(e.target.value)} />

                <div className="flex justify-end gap-3">
                  <button onClick={() => setEditTask(null)} className="border px-4 py-2 rounded">Cancel</button>
                  <button onClick={submitUpdate} className="bg-green-600 text-white px-4 py-2 rounded">Update</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
