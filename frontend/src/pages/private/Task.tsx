import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from '../../components/common/Input';
import { useParams } from 'react-router-dom';
import { useGetTaskQuery, useUpdateTaskMutation } from '../../services/api';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

// Define form shape
const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string(),
});

export default function TaskDetailsForm() {
  const { id } = useParams();
  const { data, isLoading } = useGetTaskQuery({ id: id ?? '' });

  const [updateTask] = useUpdateTaskMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
    resolver: yupResolver(schema),
  });

  // Reset form values after data is loaded
  useEffect(() => {
    if (data?.data) {
      console.log('data?.data: ', data?.data);
      reset({
        title: data.data.title,
        description: data.data.description,
      });
    }
  }, [data, reset, id]);

  const onSubmit = async (formData: yup.InferType<typeof schema>) => {
    try {
      await updateTask({ id: id ?? "", task: formData }).unwrap();
      toast.success('Task updated successfully');
    } catch {
      toast.error('Update failed');
    }
  };

  if (isLoading || !data?.data) {
    return <Loader />;
  }

  return (
    <div className="flex justify-center p-6">
      <Card className="w-full max-w-xl shadow-lg">
        <CardContent className="space-y-6">
          <Typography variant="h5" className="font-semibold">
            Task Details
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col gap-5 mt-5">
            <Input
              label="Title"
              fullWidth
              variant="outlined"
              {...register('title')}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <Input
              label="Description"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              {...register('description')}
              error={!!errors.description}
              helperText={errors.description?.message}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Task'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
