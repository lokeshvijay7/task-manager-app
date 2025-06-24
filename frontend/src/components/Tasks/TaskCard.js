"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material"
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flag as FlagIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material"
import { useTask } from "../../context/TaskContext"
import EditTaskModal from "./EditTaskModal"

const TaskCard = ({ task }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const { deleteTask } = useTask()

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    setEditModalOpen(true)
    handleMenuClose()
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
    handleMenuClose()
  }

  const handleDeleteConfirm = async () => {
    await deleteTask(task._id)
    setDeleteDialogOpen(false)
  }

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case "High":
        return { color: "#ef4444", bg: "#fef2f2", text: "#991b1b" }
      case "Medium":
        return { color: "#f59e0b", bg: "#fffbeb", text: "#92400e" }
      case "Low":
        return { color: "#10b981", bg: "#f0fdf4", text: "#065f46" }
      default:
        return { color: "#6b7280", bg: "#f9fafb", text: "#374151" }
    }
  }

  const priorityConfig = getPriorityConfig(task.priority)

  return (
    <>
      <Card
        elevation={0}
        sx={{
          border: "1px solid #e2e8f0",
          borderRadius: 2,
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            transform: "translateY(-2px)",
            borderColor: "#c7d2fe",
          },
          cursor: "pointer",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "1rem",
                color: "#1e293b",
                lineHeight: 1.4,
                flex: 1,
                mr: 1,
              }}
            >
              {task.title}
            </Typography>
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{
                color: "#64748b",
                "&:hover": { bgcolor: "#f1f5f9" },
              }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Description */}
          {task.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 3,
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {task.description}
            </Typography>
          )}

          {/* Priority and Date */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FlagIcon
                sx={{
                  fontSize: 16,
                  color: priorityConfig.color,
                }}
              />
              <Chip
                label={task.priority}
                size="small"
                sx={{
                  bgcolor: priorityConfig.bg,
                  color: priorityConfig.text,
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  height: 24,
                  "& .MuiChip-label": {
                    px: 1,
                  },
                }}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <ScheduleIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
              <Typography variant="caption" sx={{ color: "#64748b", fontSize: "0.75rem" }}>
                {new Date(task.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            border: "1px solid #e2e8f0",
          },
        }}
      >
        <MenuItem onClick={handleEdit} sx={{ py: 1.5 }}>
          <EditIcon fontSize="small" sx={{ mr: 2, color: "#6366f1" }} />
          <Typography variant="body2">Edit Task</Typography>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ py: 1.5, color: "error.main" }}>
          <DeleteIcon fontSize="small" sx={{ mr: 2 }} />
          <Typography variant="body2">Delete Task</Typography>
        </MenuItem>
      </Menu>

      <EditTaskModal open={editModalOpen} onClose={() => setEditModalOpen(false)} task={task} />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Delete Task
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            Are you sure you want to delete <strong>"{task.title}"</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: "#64748b" }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" sx={{ borderRadius: 2 }}>
            Delete Task
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default TaskCard
