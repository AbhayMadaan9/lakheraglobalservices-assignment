import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Button,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TaskDialog, { type TaskFormInputs } from '../../components/task/TaskDialog';

// Uncomment these lines when using RTK Query
// import {
//   useGetTasksQuery,
//   useCreateTaskMutation,
//   useUpdateTaskMutation,
//   useDeleteTaskMutation,
// } from '../features/api/taskApi';


export default function Tasks() {
  // Replace with real data
  const tasks: TaskType[] = [
    {
      _id: '1',
      title: 'Sample Task',
      description: 'This is a test task',
      createdAt: new Date(),
    },
  ];

  // Uncomment for real API
  // const { data: tasks = [], isLoading } = useGetTasksQuery();
  // const [createTask] = useCreateTaskMutation();
  // const [updateTask] = useUpdateTaskMutation();
  // const [deleteTask] = useDeleteTaskMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);

  const openCreateDialog = () => {
    setSelectedTask(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const openEditDialog = (task: TaskType) => {
    setSelectedTask(task);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleSubmit = async (formData: TaskFormInputs) => {
    if (dialogMode === 'create') {
      // await createTask(formData);
    } else if (dialogMode === 'edit' && selectedTask) {
      // await updateTask({ id: selectedTask.id, data: formData });
      console.log('Updating task:', selectedTask._id, formData);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      // await deleteTask(id);
      console.log('Deleting task:', id);
    }
  };

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Title', flex: 1 },
    {
      field: 'createdAt',
      headerName: 'Created At',
      flex: 1,
      valueFormatter: ({ value }) => new Date(value).toLocaleString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => openEditDialog(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box className="p-4 text-black">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h4">Tasks</Typography>
        <Button variant="contained" onClick={openCreateDialog}>
          + Add Task
        </Button>
      </Box>

      <Box height={500} width="100%">
        <DataGrid
          rows={tasks}
          columns={columns}
          getRowId={(row) => row._id}
          pageSizeOptions={[5, 10, 25]}
          paginationModel={{ pageSize: 5, page: 0 }}
          disableRowSelectionOnClick
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 2,
          }}
        />
      </Box>

      <TaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        mode={dialogMode}
        defaultValues={
          dialogMode === 'edit' && selectedTask
            ? {
                title: selectedTask.title,
                description: selectedTask.description,
              }
            : undefined
        }
      />
    </Box>
  );
}
