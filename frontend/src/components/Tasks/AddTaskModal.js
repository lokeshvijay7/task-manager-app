"use client"

import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
} from "@mui/material"
import { useTask } from "../../context/TaskContext"

const AddTaskModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
  })
  const [error, setError] = useState("")
  const { createTask } = useTask()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!formData.title.trim()) {
      setError("Task title is required")
      return
    }

    const result = await createTask(formData)
    if (result.success) {
      setFormData({
        title: "",
        description: "",
        priority: "Medium",
      })
      onClose()
    } else {
      setError(result.error)
    }
  }

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      priority: "Medium",
    })
    setError("")
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Task</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Task Title"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            name="description"
            label="Description (Optional)"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.description}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth variant="outlined">
            <InputLabel>Priority</InputLabel>
            <Select name="priority" value={formData.priority} onChange={handleChange} label="Priority">
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Add Task
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default AddTaskModal
