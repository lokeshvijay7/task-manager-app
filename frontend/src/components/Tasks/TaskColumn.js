import { Paper, Typography, Box, Skeleton } from "@mui/material"
import TaskCard from "./TaskCard"

const TaskColumn = ({ title, tasks, color, loading }) => {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        height: "fit-content",
        minHeight: 400,
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
          pb: 1,
          borderBottom: `2px solid ${color}`,
        }}
      >
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            bgcolor: color,
            mr: 1,
          }}
        />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            ml: "auto",
            bgcolor: color,
            color: "white",
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: "0.75rem",
            fontWeight: 600,
          }}
        >
          {tasks.length}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          ))
        ) : tasks.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 4,
              color: "text.secondary",
            }}
          >
            <Typography variant="body2">No tasks yet</Typography>
          </Box>
        ) : (
          tasks.map((task) => <TaskCard key={task._id} task={task} />)
        )}
      </Box>
    </Paper>
  )
}

export default TaskColumn
