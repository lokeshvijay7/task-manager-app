"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      localStorage.setItem("token", action.payload.token)
      return {
        ...state,
        user: action.payload,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      }
    case "LOGOUT":
      localStorage.removeItem("token")
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      }
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      }
    case "AUTH_ERROR":
      localStorage.removeItem("token")
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: localStorage.getItem("token"),
    isAuthenticated: false,
    loading: true,
    error: null,
  })

  // Set auth token in axios headers
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${state.token}`
    } else {
      delete axios.defaults.headers.common["Authorization"]
    }
  }, [state.token])

  // Check if user is authenticated on app load
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      // Verify token with backend
      axios
        .get("http://localhost:5000/api/auth/profile")
        .then((response) => {
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: { ...response.data, token },
          })
        })
        .catch(() => {
          dispatch({ type: "AUTH_ERROR", payload: "Token invalid" })
        })
    } else {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  const login = async (email, password) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      })
      dispatch({ type: "LOGIN_SUCCESS", payload: response.data })
      return { success: true }
    } catch (error) {
      dispatch({
        type: "AUTH_ERROR",
        payload: error.response?.data?.message || "Login failed",
      })
      return { success: false, error: error.response?.data?.message || "Login failed" }
    }
  }

  const signup = async (name, email, password) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
      })
      dispatch({ type: "LOGIN_SUCCESS", payload: response.data })
      return { success: true }
    } catch (error) {
      dispatch({
        type: "AUTH_ERROR",
        payload: error.response?.data?.message || "Signup failed",
      })
      return { success: false, error: error.response?.data?.message || "Signup failed" }
    }
  }

  const logout = () => {
    dispatch({ type: "LOGOUT" })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
