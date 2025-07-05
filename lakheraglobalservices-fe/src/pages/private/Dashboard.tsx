import { useState } from 'react';
import { TextField, CircularProgress } from '@mui/material';
import { useDebounce } from '../../hooks/useDebounce';
import { useGetAllTasksQuery } from '../../services/api';


export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: tasks, isFetching } = useGetAllTasksQuery({search: debouncedSearch}, {
    refetchOnMountOrArgChange: true
  });
  console.log('tasks: ', tasks);
const items = tasks?.data ?? []
console.log('items: ', items);
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      {/* Centered Search Bar */}
      <div className="w-full max-w-xl mt-20 mb-10">
        <TextField
          fullWidth
          label="Search Tasks"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tasks List */}
      <div className="w-full max-w-xl bg-white rounded-xl shadow p-4">
        <h2 className="text-xl font-semibold mb-3">Latest Tasks</h2>

        {isFetching ? (
          <div className="flex justify-center p-6">
            <CircularProgress />
          </div>
        ) : items.length === 0 ? (
          <p className="text-gray-500 text-center">No tasks found.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {items?.slice(0, 5).map((task) => (
              <li key={task._id} className="py-3">
                <div className="font-medium">{task.title}</div>
                <div className="text-sm text-gray-500">
                  {new Date(task.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
