import { useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Button,
} from '@mui/material';
import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TaskDialog, { type TaskFormInputs } from '../../components/task/TaskDialog';
import { tableFormat } from '../../utils/dateTime';
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useGetAllTasksQuery,
  useUpdateTaskMutation,
} from '../../services/api';
import toast from 'react-hot-toast';

export default function Tasks() {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  const skip = paginationModel.page * paginationModel.pageSize;
  const limit = paginationModel.pageSize;

  const { data, isFetching } = useGetAllTasksQuery({ skip, limit });
  const [createTask, { isLoading: createTaskLoading }] = useCreateTaskMutation();
  const [updateTask, { isLoading: updateTaskLoading }] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

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
    try {
      if (dialogMode === 'create') {
        await createTask(formData);
        toast.success("Task created")
      } else if (dialogMode === 'edit' && selectedTask) {
        console.log('formData: ', formData);
        await updateTask({ id: selectedTask.id, task: formData });
      }
    } catch (error) {
      console.log('error: ', error);
      toast.error(`Failed to ${dialogMode}`)
    } finally {
      setDialogOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
      console.log('Deleting task:', id);
    }
  };

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Title', flex: 1 },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      flex: 1,
      valueFormatter: ({ value }) => tableFormat(value),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => openEditDialog(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
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
          rows={data?.data?.tasks ?? []}
          rowCount={data?.data?.total ?? 0}
          columns={columns}
          getRowId={(row) => row.id}
          loading={isFetching}
          pagination
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25]}
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
          selectedTask
            ? {
              title: selectedTask.title,
              description: selectedTask?.description ?? '',
            }
            : undefined
        }
        loading={createTaskLoading || updateTaskLoading}
      />
    </Box>
  );
}
