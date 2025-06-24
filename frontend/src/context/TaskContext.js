"use client"

import { createContext, useContext, useReducer, useCallback } from "react"
import axios from "axios"

const TaskContext = createContext()

const taskReducer = (state, action) => {
  switch (action.type) {
    case "SET_TASKS":
      return {
        ...state,
        tasks: action.payload,
        loading: false,
      }
    case "ADD_TASK":
      const newTask = action.payload
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [newTask.status]: [...(state.tasks[newTask.status] || []), newTask],
        },
      }
    case "UPDATE_TASK":
      const updatedTask = action.payload
      const updatedTasks = { ...state.tasks }

      // Remove task from old status
      Object.keys(updatedTasks).forEach((status) => {
        updatedTasks[status] = updatedTasks[status].filter((task) => task._id !== updatedTask._id)
      })

      // Add task to new status
      updatedTasks[updatedTask.status] = [...(updatedTasks[updatedTask.status] || []), updatedTask]

      return {
        ...state,
        tasks: updatedTasks,
      }
    case "DELETE_TASK":
      const taskId = action.payload
      const filteredTasks = { ...state.tasks }

      Object.keys(filteredTasks).forEach((status) => {
        filteredTasks[status] = filteredTasks[status].filter((task) => task._id !== taskId)
      })

      return {
        ...state,
        tasks: filteredTasks,
      }
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      }
    default:
      return state
  }
}

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, {
    tasks: {
      "To Do": [],
      "In Progress": [],
      Done: [],
    },
    loading: false,
  })

  const fetchTasks = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await axios.get("http://localhost:5000/api/tasks")
      dispatch({ type: "SET_TASKS", payload: response.data })
      dispatch({ type: "SET_LOADING", payload: false })
    } catch (error) {
      console.error("Error fetching tasks:", error)
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  const createTask = async (taskData) => {
    try {
      const response = await axios.post("http://localhost:5000/api/tasks", taskData)
      dispatch({ type: "ADD_TASK", payload: response.data })
      return { success: true }
    } catch (error) {
      console.error("Error creating task:", error)
      return { success: false, error: error.response?.data?.message || "Failed to create task" }
    }
  }

  const updateTask = async (taskId, updates) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/tasks/${taskId}`, updates)
      dispatch({ type: "UPDATE_TASK", payload: response.data })
      return { success: true }
    } catch (error) {
      console.error("Error updating task:", error)
      return { success: false, error: error.response?.data?.message || "Failed to update task" }
    }
  }

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`)
      dispatch({ type: "DELETE_TASK", payload: taskId })
      return { success: true }
    } catch (error) {
      console.error("Error deleting task:", error)
      return { success: false, error: error.response?.data?.message || "Failed to delete task" }
    }
  }

  return (
    <TaskContext.Provider
      value={{
        ...state,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export const useTask = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider")
  }
  return context
}
