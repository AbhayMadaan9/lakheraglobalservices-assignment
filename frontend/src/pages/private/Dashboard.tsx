import { useState } from 'react';
import { TextField, CircularProgress, Button } from '@mui/material';
import { useDebounce } from '../../hooks/useDebounce';
import { useGetAllTasksQuery } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { tableFormat } from '../../utils/dateTime';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [skip, setSkip] = useState(0);
  const limit = 5;

  const { data: tasks, isFetching } = useGetAllTasksQuery(
    { search: debouncedSearch, skip, limit },
    { refetchOnMountOrArgChange: true }
  );

  const items = tasks?.data?.tasks ?? [];
  const total = tasks?.data?.total ?? 0

  const handleNext = () => {
    if (skip + limit < total) setSkip((prev) => prev + limit);
  };

  const handlePrev = () => {
    if (skip > 0) setSkip((prev) => prev - limit);
  };
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      {/* Centered Search Bar */}
      <div className="w-full max-w-xl mt-20 mb-10">
        <TextField
          fullWidth
          label="Search Tasks"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSkip(0); // Reset skip on new search
          }}
        />
      </div>

      {/* Tasks List */}
      <div className="w-full max-w-xl bg-white rounded-xl shadow p-4 text-black">
        <h2 className="text-xl font-semibold mb-3 ">Latest Tasks</h2>

        {isFetching ? (
          <div className="flex justify-center p-6">
            <CircularProgress />
          </div>
        ) : items.length === 0 ? (
          <p className="text-gray-500 text-center">No tasks found.</p>
        ) : (
          <>
            <ul className="divide-y divide-gray-200">
              {items.map((task) => (
                <li key={task.id} className="py-3 cursor-pointer" onClick={()=>navigate(`/tasks/${task.id}`)}>
                  <div className="font-medium">{task.title}</div>

                  <div className="text-sm text-gray-600 mb-1">
                    {task.description}
                  </div>
                  <div className="text-sm text-gray-500">
                    {tableFormat(task.createdAt)}
                  </div>
                </li>
              ))}
            </ul>

            {/* Pagination Controls */}
            <div className="flex justify-between mt-4">
              <Button
                variant="outlined"
                disabled={skip === 0}
                onClick={handlePrev}
              >
                Previous
              </Button>
              <Button
                variant="outlined"
                disabled={skip + limit >= total}
                onClick={handleNext}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
