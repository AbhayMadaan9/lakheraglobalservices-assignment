import { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from '../common/Input';

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormInputs) => void;
  mode?: 'create' | 'edit';
  defaultValues?: Partial<TaskFormInputs>;
  loading: boolean;
}

export interface TaskFormInputs {
  title: string;
  description: string;
}

// Validation schema
const schema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
});

export default function TaskDialog({
  open,
  onClose,
  onSubmit,
  mode = 'create',
  defaultValues = {},
  loading = false,
}: TaskDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      description: '',
    },
  });


  useEffect(() => {
    if (open && mode === 'edit' && defaultValues) {
      reset({
        title: defaultValues.title ?? '',
        description: defaultValues.description ?? '',
      });
    }

  }, [open, mode, defaultValues, reset]);

  const handleFormSubmit: SubmitHandler<TaskFormInputs> = (data) => {
    onSubmit(data);
    onClose();
    reset()
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === 'edit' ? 'Edit Task' : 'Create Task'}</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <DialogContent className="space-y-4 flex flex-col gap-5 text-black">
          <Input
            label="Title"
            fullWidth
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <Input
            label="Description"
            fullWidth
            multiline
            rows={3}
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {mode === 'edit' ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
