"use client"

import { useEffect, useState } from "react"
import { Container, Typography, Box, Button, AppBar, Toolbar, Grid, Fab, Paper, Avatar, Chip } from "@mui/material"
import {
  Add as AddIcon,
  ExitToApp as LogoutIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
} from "@mui/icons-material"
import { useAuth } from "../context/AuthContext"
import { useTask } from "../context/TaskContext"
import TaskColumn from "../components/Tasks/TaskColumn"
import AddTaskModal from "../components/Tasks/AddTaskModal"

const Dashboard = () => {
  const { user, logout } = useAuth()
  const { tasks, fetchTasks, loading } = useTask()
  const [addModalOpen, setAddModalOpen] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleLogout = () => {
    logout()
  }

  const statusConfig = {
    "To Do": {
      color: "#ef4444",
      bgColor: "#fef2f2",
      lightColor: "#fee2e2",
    },
    "In Progress": {
      color: "#f59e0b",
      bgColor: "#fffbeb",
      lightColor: "#fef3c7",
    },
    Done: {
      color: "#10b981",
      bgColor: "#f0fdf4",
      lightColor: "#dcfce7",
    },
  }

  const getTotalTasks = () => {
    return Object.values(tasks).reduce((total, taskList) => total + taskList.length, 0)
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* Modern Header */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "white",
          borderBottom: "1px solid #e2e8f0",
          color: "text.primary",
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <DashboardIcon sx={{ mr: 2, color: "#6366f1" }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b" }}>
              Task Manager
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: "#6366f1" }}>
                <PersonIcon fontSize="small" />
              </Avatar>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#374151" }}>
                  {user?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
            </Box>
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{
                color: "#64748b",
                "&:hover": { bgcolor: "#f1f5f9" },
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Dashboard Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 800,
              color: "#0f172a",
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            My Tasks
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            <Typography variant="h6" color="text.secondary">
              Organize and track your tasks efficiently
            </Typography>
            <Chip
              label={`${getTotalTasks()} Total Tasks`}
              sx={{
                bgcolor: "#6366f1",
                color: "white",
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>

        {/* Task Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {Object.entries(tasks).map(([status, taskList]) => (
            <Grid item xs={12} sm={4} key={status}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  bgcolor: statusConfig[status].bgColor,
                  border: `2px solid ${statusConfig[status].lightColor}`,
                  borderRadius: 3,
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    bgcolor: statusConfig[status].color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ color: "white", fontWeight: 700 }}>
                    {taskList.length}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#374151" }}>
                  {status}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {taskList.length === 1 ? "task" : "tasks"}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Task Columns */}
        <Grid container spacing={3}>
          {Object.entries(tasks).map(([status, taskList]) => (
            <Grid item xs={12} lg={4} key={status}>
              <TaskColumn
                title={status}
                tasks={taskList}
                color={statusConfig[status].color}
                bgColor={statusConfig[status].bgColor}
                lightColor={statusConfig[status].lightColor}
                loading={loading}
              />
            </Grid>
          ))}
        </Grid>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add task"
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            width: 64,
            height: 64,
            bgcolor: "#6366f1",
            "&:hover": {
              bgcolor: "#4f46e5",
              transform: "scale(1.1)",
            },
            transition: "all 0.2s ease-in-out",
            boxShadow: "0 8px 32px rgba(99, 102, 241, 0.3)",
          }}
          onClick={() => setAddModalOpen(true)}
        >
          <AddIcon sx={{ fontSize: 28 }} />
        </Fab>

        <AddTaskModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
      </Container>
    </Box>
  )
}

export default Dashboard
