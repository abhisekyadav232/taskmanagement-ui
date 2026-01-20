import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyTasks, updateTask } from '../api/store/taskSlice'
import { logout } from '../api/store/authSlice'
import { useNavigate } from 'react-router-dom'

export default function UserPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const tasks = useSelector(state => state.tasks.list)

  const [editTask, setEditTask] = useState(null)
  const [editStatus, setEditStatus] = useState('')

  useEffect(() => {
    dispatch(fetchMyTasks())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const handleEdit = (task) => {
    setEditTask(task)
    setEditStatus(task.status)
  }

  const handleSubmitUpdate = async () => {
    try {
      await dispatch(updateTask({
        id: editTask.id,
        data: {
          status: editStatus,
          priority: editTask.priority,
          deadline: editTask.deadline
        }
      })).unwrap()

      setEditTask(null)
      dispatch(fetchMyTasks())
    } catch {
      alert("Update failed")
    }
  }

  const user = tasks.length > 0 ? tasks[0].assignedToUser : null

  const statusStyle = (status) => {
    if (status === "Completed") return "bg-green-100 text-green-700"
    if (status === "In Progress") return "bg-yellow-100 text-yellow-700"
    return "bg-gray-200 text-gray-700"
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-900">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Dashboard</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-5 py-2 rounded-lg shadow hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* USER INFO CARD */}
      {user && (
        <div className="bg-white rounded-xl shadow p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">👤 Profile</h2>
          <div className="grid sm:grid-cols-3 gap-4 text-gray-700">
            <p><b>Name:</b> {user.name}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Role:</b> {user.role}</p>
          </div>
        </div>
      )}

      {/* TASKS */}
      <h2 className="text-2xl font-semibold mb-6">📋 My Tasks</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {tasks.map(task => (
          <div
            key={task.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 relative"
          >
            {/* Edit button */}
            <button
              onClick={() => handleEdit(task)}
              className="absolute top-4 right-4 text-blue-600 hover:underline text-sm"
            >
              Edit
            </button>

            <h3 className="text-lg font-bold mb-1">{task.title}</h3>
            <p className="text-gray-600 mb-3">{task.description}</p>

            <div className="flex flex-wrap justify-between items-center gap-3 text-sm">
              <span className={`px-3 py-1 rounded-full ${statusStyle(task.status)}`}>
                {task.status}
              </span>

              <span className="text-gray-500">
                Priority: <b>{task.priority}</b>
              </span>

              <span className="text-gray-500">
                ⏰ {new Date(task.deadline).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* UPDATE MODAL */}
      {editTask && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-96">
            <h3 className="text-xl font-bold mb-4">Update Task Status</h3>

            <p className="font-medium mb-2">{editTask.title}</p>

            <select
              className="border p-3 rounded w-full mb-6"
              value={editStatus}
              onChange={e => setEditStatus(e.target.value)}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditTask(null)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmitUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
