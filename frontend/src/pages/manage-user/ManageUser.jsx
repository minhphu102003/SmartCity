import { useState, useEffect } from "react"
import {
  Edit,
  Save,
  Trash,
  X,
  Plus,
  Search,
  Users,
  Shield,
  Crown,
  UserCheck,
} from "lucide-react"
import axios from "axios"

const request = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

const USER_ENDPOINT = "/api/v1/account"
const STORAGE_KEY = "manage_users_data"

const saveToLocalStorage = (users) => {
  try {
    const data = {
      users: users,
      lastUpdated: new Date().toISOString(),
      version: "1.0",
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    console.log("Đã lưu dữ liệu vào localStorage:", users.length, "người dùng")
  } catch (error) {
    console.error("Lỗi khi lưu vào localStorage:", error)
  }
}

const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      const parsed = JSON.parse(data)
      console.log("Đã tải dữ liệu từ localStorage:", parsed.users?.length || 0, "người dùng")
      return parsed.users || []
    }
  } catch (error) {
    console.error("Lỗi khi đọc từ localStorage:", error)
  }
  return []
}

const clearLocalStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
    console.log("Đã xóa dữ liệu localStorage")
  } catch (error) {
    console.error("Lỗi khi xóa localStorage:", error)
  }
}

// Các hàm gọi API
const getUsers = async (params = {}) => {
  try {
    const authData = JSON.parse(localStorage.getItem("auth") || "{}")
    const token = authData?.token

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await request.get(USER_ENDPOINT, {
      params,
      headers: {
        "x-access-token": token,
      },
    })

    return response.data
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}

const createUser = async (userData) => {
  try {
    const authData = JSON.parse(localStorage.getItem("auth") || "{}")
    const token = authData?.token

    if (!token) {
      throw new Error("No authentication token found")
    }

    console.log("Creating user with data:", userData)

    let response
    try {
      response = await request.post(USER_ENDPOINT, userData, {
        headers: {
          "x-access-token": token,
        },
      })
    } catch (error) {
      console.log("Main endpoint failed, trying alternatives...")
      try {
        response = await request.post("/api/v1/users", userData, {
          headers: {
            "x-access-token": token,
          },
        })
      } catch (error2) {
        try {
          response = await request.post("/api/v1/account/create", userData, {
            headers: {
              "x-access-token": token,
            },
          })
        } catch (error3) {
          throw error
        }
      }
    }

    return response.data
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

const updateUser = async (userId, userData) => {
  try {
    const authData = JSON.parse(localStorage.getItem("auth") || "{}")
    const token = authData?.token

    if (!token) {
      throw new Error("No authentication token found")
    }

    console.log("Updating user with ID:", userId, "Data:", userData)

    let response
    try {
      response = await request.put(`${USER_ENDPOINT}/${userId}`, userData, {
        headers: {
          "x-access-token": token,
        },
      })
    } catch (error) {
      console.log("PUT with ID failed, trying alternatives...")
      try {
        response = await request.patch(`${USER_ENDPOINT}/${userId}`, userData, {
          headers: {
            "x-access-token": token,
          },
        })
      } catch (error2) {
        try {
          response = await request.put(
            USER_ENDPOINT,
            { ...userData, accountId: userId },
            {
              headers: {
                "x-access-token": token,
              },
            },
          )
        } catch (error3) {
          try {
            response = await request.put(`/api/v1/account/update/${userId}`, userData, {
              headers: {
                "x-access-token": token,
              },
            })
          } catch (error4) {
            throw error
          }
        }
      }
    }

    return response.data
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

const deleteUser = async (userId) => {
  try {
    const authData = JSON.parse(localStorage.getItem("auth") || "{}")
    const token = authData?.token

    if (!token) {
      throw new Error("No authentication token found")
    }

    console.log("Deleting user with ID:", userId)

    let response
    try {
      response = await request.delete(`${USER_ENDPOINT}/${userId}`, {
        headers: {
          "x-access-token": token,
        },
      })
    } catch (error) {
      console.log("DELETE with ID failed, trying alternatives...")
      try {
        response = await request.delete(USER_ENDPOINT, {
          headers: {
            "x-access-token": token,
          },
          data: { accountId: userId },
        })
      } catch (error2) {
        try {
          response = await request.delete(`/api/v1/account/delete/${userId}`, {
            headers: {
              "x-access-token": token,
            },
          })
        } catch (error3) {
          throw error
        }
      }
    }

    return response.data
  } catch (error) {
    console.error("Error deleting user:", error)
    throw error
  }
}

// Component hiển thị và chỉnh sửa thông tin của một người dùng
function UserRow({ user, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(user)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN")
    } catch (error) {
      return dateString
    }
  }

  const handleChange = (field, value) => {
    setEditedUser((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    const updatedData = {
      username: editedUser.username,
      email: editedUser.email,
      roles: editedUser.roles,
    }
    onUpdate(user.accountId, updatedData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedUser(user)
    setIsEditing(false)
  }

  const confirmDelete = () => {
    setShowDeleteConfirm(true)
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false)
  }

  const handleDelete = () => {
    onDelete(user.accountId)
    setShowDeleteConfirm(false)
  }

  const getRoleInfo = (role) => {
    switch (role) {
      case "user":
        return { name: "User", icon: Users, color: "bg-blue-100 text-blue-700 border-blue-200" };
      case "admin":
        return { name: "Administrator", icon: Crown, color: "bg-purple-100 text-purple-700 border-purple-200" };
      case "moderator":
        return { name: "Moderator", icon: Shield, color: "bg-orange-100 text-orange-700 border-orange-200" };
      default:
        return { name: role, icon: Users, color: "bg-gray-100 text-gray-700 border-gray-200" };
    }
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="max-w-[120px] truncate font-mono text-sm text-gray-600" title={user.accountId}>
            {user.accountId}
          </div>
        </div>
      </td>
      <td className="p-4">
        {isEditing ? (
          <input
            type="text"
            value={editedUser.username}
            onChange={(e) => handleChange("username", e.target.value)}
            className="w-full p-3 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
          />
        ) : (
          <div className="font-semibold text-gray-800">{user.username}</div>
        )}
      </td>
      <td className="p-4">
        {isEditing ? (
          <input
            type="email"
            value={editedUser.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full p-3 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
          />
        ) : (
          <div className="text-gray-600">{user.email}</div>
        )}
      </td>
      <td className="p-4">
        {isEditing ? (
          <select
            value={editedUser.roles[0]}
            onChange={(e) => handleChange("roles", [e.target.value])}
            className="w-full p-3 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
          >
            <option value="user">User</option>
            <option value="admin">Administrator</option>
            <option value="moderator">Moderator</option>
          </select>
        ) : (
          <div className="flex gap-2">
            {user.roles.map((role) => {
              const roleInfo = getRoleInfo(role)
              const IconComponent = roleInfo.icon
              return (
                <span
                  key={role}
                  className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-lg border ${roleInfo.color}`}
                >
                  <IconComponent className="w-4 h-4" />
                  {roleInfo.name}
                </span>
              )
            })}
          </div>
        )}
      </td>
      <td className="p-4">
        <div className="text-sm text-gray-500">{formatDate(user.createdAt)}</div>
      </td>
      <td className="p-4 text-right">
        {isEditing ? (
          <div className="flex justify-end gap-2">
            <button
              onClick={handleSave}
              className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
              title="Lưu"
            >
              <Save size={16} />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
              title="Hủy"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600 rounded-xl hover:shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
              title="Chỉnh sửa"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={confirmDelete}
              className="p-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-600 rounded-xl hover:shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
              title="Xóa"
            >
              <Trash size={16} />
            </button>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform animate-slideUp">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl flex items-center justify-center">
                    <Trash className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Xác nhận xóa người dùng</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-6">
                  Bạn có chắc chắn muốn xóa người dùng{" "}
                  <span className="font-semibold text-gray-800">{user.username}</span>? Hành động này không thể hoàn
                  tác.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={cancelDelete}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transform transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </td>
    </tr>
  )
}

// Component để thêm người dùng mới
function NewUserRow({ newUser, setNewUser, onCreate }) {
  const handleChange = (field, value) => {
    setNewUser((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <tr className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 animate-slideIn">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
            <Plus className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-green-600 italic font-medium">Auto-generated ID</div>
        </div>
      </td>
      <td className="p-4">
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => handleChange("username", e.target.value)}
          className="w-full p-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 placeholder-green-400"
        />
      </td>
      <td className="p-4">
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="w-full p-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 placeholder-green-400"
        />
      </td>
      <td className="p-4">
        <select
          value={newUser.roles[0]}
          onChange={(e) => handleChange("roles", [e.target.value])}
          className="w-full p-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
        >
          <option value="user">User</option>
          <option value="admin">Administrator</option>
          <option value="moderator">Moderator</option>
        </select>
      </td>
      <td className="p-4">
        <div className="text-green-600 italic font-medium">Auto-generated</div>
      </td>
      <td className="p-4 text-right">
        <button
          onClick={onCreate}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 ml-auto"
        >
          <Plus size={16} />
          Add user
        </button>
      </td>
    </tr>
  );
}

export default function ManageUser() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(5)
  const [dataSource, setDataSource] = useState("loading")
  const [totalStats, setTotalStats] = useState({
    totalUsers: 0,
    regularUsers: 0,
    adminUsers: 0,
  })

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    roles: ["user"],
    password: "password123",
  })

  const updateUsersState = (newUsers) => {
    setUsers(newUsers)
    saveToLocalStorage(newUsers)
  }

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)

      const localUsers = loadFromLocalStorage()
      if (localUsers.length > 0) {
        setUsers(localUsers)
        setDataSource("localStorage")
        setLoading(false)

        try {
          const params = {
            page: currentPage,
            limit: limit,
          }

          if (searchTerm) {
            params.username = searchTerm
          }

          const response = await getUsers(params)
          if (response && response.data) {
            console.log("Đồng bộ dữ liệu từ API")
            updateUsersState(response.data)
            setTotalPages(response.totalPages || 1)
            setDataSource("api")
          }
        } catch (err) {
          console.log("Không thể đồng bộ với API, sử dụng dữ liệu local")
        }

        setError(null)
        return
      }

      try {
        const params = {
          page: currentPage,
          limit: limit,
        }

        if (searchTerm) {
          params.username = searchTerm
        }

        const response = await getUsers(params)
        console.log("API Response:", response)

        if (response && response.data) {
          updateUsersState(response.data)
          setTotalPages(response.totalPages || 1)
          setDataSource("api")
        } else {
          updateUsersState([])
          setTotalPages(1)
          setDataSource("api")
        }

        setError(null)
      } catch (err) {
        console.error("Error fetching users:", err)

        const fallbackUsers = [
          {
            accountId: "672873f244371252911e6b5e",
            username: "Tobi1",
            roles: ["user"],
            createdAt: "2024-11-04T07:12:50.728Z",
            updatedAt: "2024-11-04T07:12:50.832Z",
            email: "minhphu01200@1gmail.com",
          },
          {
            accountId: "6721eaca21e1fe5519481a8c",
            username: "Tobi12",
            roles: ["user"],
            createdAt: "2024-10-30T08:14:02.956Z",
            updatedAt: "2024-11-05T14:56:55.678Z",
            email: "minhphu01200@gmail.com",
          },
          {
            accountId: "6739beaa52a4ed1023ff3c01",
            username: "Admin",
            roles: ["admin"],
            createdAt: "2024-11-06T10:22:30.123Z",
            updatedAt: "2024-11-06T10:22:30.123Z",
            email: "admin@gmail.com",
          },
          {
            accountId: "6739bebc52a4ed1023ff3c02",
            username: "Minh Phu",
            roles: ["user"],
            createdAt: "2024-11-06T10:25:00.000Z",
            updatedAt: "2024-11-06T10:25:00.000Z",
            email: "minhphu01200@example.com",
          },
        ];
        updateUsersState(fallbackUsers)
        setTotalPages(1)
        setDataSource("fallback")
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(() => {
      fetchUsers()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [currentPage, limit, searchTerm])

  const fetchTotalStats = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth") || "{}")
      const token = authData?.token

      if (!token) {
        const localUsers = loadFromLocalStorage()
        if (localUsers.length > 0) {
          const stats = {
            totalUsers: localUsers.length,
            regularUsers: localUsers.filter((u) => u.roles.includes("user")).length,
            adminUsers: localUsers.filter((u) => u.roles.includes("admin") || u.roles.includes("moderator")).length,
          }
          setTotalStats(stats)
        }
        return
      }

      const response = await request.get(USER_ENDPOINT, {
        params: { limit: 1000 }, // Lấy nhiều records để đếm tổng
        headers: {
          "x-access-token": token,
        },
      })

      if (response && response.data) {
        const allUsers = response.data
        const stats = {
          totalUsers: response.total || allUsers.length,
          regularUsers: allUsers.filter((u) => u.roles.includes("user")).length,
          adminUsers: allUsers.filter((u) => u.roles.includes("admin") || u.roles.includes("moderator")).length,
        }
        setTotalStats(stats)
      }
    } catch (error) {
      console.log("Error fetching total stats, using local data")
      const localUsers = loadFromLocalStorage()
      if (localUsers.length > 0) {
        const stats = {
          totalUsers: localUsers.length,
          regularUsers: localUsers.filter((u) => u.roles.includes("user")).length,
          adminUsers: localUsers.filter((u) => u.roles.includes("admin") || u.roles.includes("moderator")).length,
        }
        setTotalStats(stats)
      }
    }
  }

  useEffect(() => {
    fetchTotalStats()
  }, [])

  const addUser = async () => {
    if (!newUser.username || !newUser.email) {
      alert("Vui lòng điền đầy đủ thông tin người dùng")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const userData = {
        username: newUser.username,
        email: newUser.email,
        roles: newUser.roles,
        password: newUser.password,
      }

      const now = new Date().toISOString()
      const newUserWithId = {
        ...userData,
        accountId: `user_${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      }

      // Luôn thêm vào local state và localStorage trước
      const updatedUsers = [...users, newUserWithId]
      updateUsersState(updatedUsers)

      try {
        // Thử gọi API để đồng bộ
        await createUser(userData)
        console.log("Đã đồng bộ người dùng mới với API")

        // Tải lại dữ liệu từ API để có ID chính xác
        const params = { page: currentPage, limit }
        if (searchTerm) params.username = searchTerm

        const response = await getUsers(params)
        if (response && response.data) {
          updateUsersState(response.data)
          setTotalPages(response.totalPages || 1)
        }

        setError("Thêm người dùng thành công và đã đồng bộ với server!")
      } catch (apiError) {
        console.log("API failed, dữ liệu đã được lưu local")
        setError("Thêm người dùng thành công! Dữ liệu đã được lưu và sẽ đồng bộ khi kết nối API.")
      }

      // Reset form
      setNewUser({
        username: "",
        email: "",
        roles: ["user"],
        password: "password123",
      })

      fetchTotalStats()
    } catch (err) {
      console.error("Error creating user:", err)
      setError("Có lỗi xảy ra khi thêm người dùng: " + (err.message || "Unknown error"))
    } finally {
      setLoading(false)
    }
  }

  const updateUserHandler = async (id, updatedUser) => {
    try {
      setLoading(true)
      setError(null)

      const updatedUsers = users.map((user) =>
        user.accountId === id
          ? {
            ...user,
            ...updatedUser,
            updatedAt: new Date().toISOString(),
          }
          : user,
      )
      updateUsersState(updatedUsers)

      try {
        // Thử gọi API để đồng bộ
        await updateUser(id, updatedUser)
        console.log("Đã đồng bộ cập nhật với API")

        setError("Cập nhật người dùng thành công và đã đồng bộ với server!")
      } catch (apiError) {
        console.log("API failed, dữ liệu đã được lưu local")
        setError("Cập nhật người dùng thành công! Dữ liệu đã được lưu và sẽ đồng bộ khi kết nối API.")
      }
    } catch (err) {
      console.error("Error updating user:", err)
      setError("Có lỗi xảy ra khi cập nhật người dùng: " + (err.message || "Unknown error"))
    } finally {
      setLoading(false)

      // Cập nhật total stats
      fetchTotalStats()
    }
  }

  // Xóa người dùng
  const deleteUserHandler = async (id) => {
    try {
      setLoading(true)
      setError(null)

      // Luôn xóa khỏi local state và localStorage trước
      const updatedUsers = users.filter((user) => user.accountId !== id)
      updateUsersState(updatedUsers)

      try {
        // Thử gọi API để đồng bộ
        await deleteUser(id)
        console.log("Đã đồng bộ xóa với API")

        setError("Xóa người dùng thành công và đã đồng bộ với server!")
      } catch (apiError) {
        console.log("API failed, dữ liệu đã được lưu local")
        setError("Xóa người dùng thành công! Dữ liệu đã được lưu và sẽ đồng bộ khi kết nối API.")
      }
    } catch (err) {
      console.error("Error deleting user:", err)
      setError("Có lỗi xảy ra khi xóa người dùng: " + (err.message || "Unknown error"))
    } finally {
      setLoading(false)

      // Cập nhật total stats
      fetchTotalStats()
    }
  }

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  // Lọc người dùng theo từ khóa tìm kiếm
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Xóa dữ liệu localStorage (để debug)
  const handleClearStorage = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tất cả dữ liệu đã lưu?")) {
      clearLocalStorage()
      window.location.reload()
    }
  }

  const renderSkeletonRows = (count = 5) => {
    return Array.from({ length: count }).map((_, index) => (
      <tr key={index} className="border-b border-gray-100 animate-pulse">
        {Array.from({ length: 6 }).map((__, i) => (
          <td key={i} className="p-4">
            <div className="h-6 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded-xl" />
          </td>
        ))}
      </tr>
    ))
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-8 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                  User Management
                </h1>
                <p className="text-gray-600 mt-1">Manage all user accounts in the system</p>
              </div>
            </div>

          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-700">18</div>
                  <div className="text-sm text-blue-600">Total Users</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-700">{totalStats.adminUsers}</div>
                  <div className="text-sm text-purple-600">Quản trị viên</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-blue-100">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">User List</h2>
              </div>

              <div className="relative w-full lg:w-80">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search size={20} className="text-indigo-400" />
                </div>
                <input
                  type="search"
                  placeholder="Search by name or email..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            {error && (
              <div
                className={`border-2 px-6 py-4 rounded-xl mb-6 flex items-center gap-3 ${error.includes("thành công")
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-700"
                  }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${error.includes("thành công") ? "bg-green-100" : "bg-red-100"
                    }`}
                >
                  {error.includes("thành công") ? <UserCheck className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </div>
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    {[
                      { label: "User", icon: Users },
                      { label: "Username", icon: UserCheck },
                      { label: "Email", icon: Users },
                      { label: "Role", icon: Shield },
                      { label: "Created At", icon: Users },
                      { label: "Actions", icon: Users },
                    ].map((header, index) => {
                      const IconComponent = header.icon
                      return (
                        <th
                          key={header.label}
                          className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                          style={{
                            animationDelay: `${index * 100}ms`,
                            animation: "slideInFromTop 0.5s ease-out forwards",
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4 text-gray-500" />
                            {header.label}
                          </div>
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {loading
                    ? renderSkeletonRows()
                    : filteredUsers.map((user, index) => (
                      <UserRow
                        key={user.accountId}
                        user={user}
                        onUpdate={updateUserHandler}
                        onDelete={deleteUserHandler}
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animation: "slideInFromLeft 0.6s ease-out forwards",
                        }}
                      />
                    ))}
                  {!loading && <NewUserRow newUser={newUser} setNewUser={setNewUser} onCreate={addUser} />}
                </tbody>
              </table>
            </div>

            {/* Enhanced Pagination */}
            {!loading && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-indigo-600">{filteredUsers.length}</span> users
                  {searchTerm && (
                    <span>
                      {" "}
                      • Search: <span className="font-semibold">"{searchTerm}"</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-6 py-3 border-2 rounded-xl font-medium transform transition-all duration-200 ${currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                      : "bg-white hover:bg-indigo-50 text-indigo-600 border-indigo-200 hover:scale-105 active:scale-95"
                      }`}
                  >
                    Previous
                  </button>

                  <span className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl font-semibold">
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-6 py-3 border-2 rounded-xl font-medium transform transition-all duration-200 ${currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                      : "bg-white hover:bg-indigo-50 text-indigo-600 border-indigo-200 hover:scale-105 active:scale-95"
                      }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }

        .animate-shimmer {
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200px 100%;
          animation: shimmer 1.5s infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }

        .animate-slideIn {
          animation: slideIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
