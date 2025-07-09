import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getItemLocalStorage, handleSessionExpire, handleSetLocalStorage } from '../utils/functions'
import { toast } from 'react-hot-toast';

import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { TokenType } from '../utils/enums';

export const customBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BE_BASE_URL}/api`,
    prepareHeaders: (headers) => {
      const accessToken = getItemLocalStorage(TokenType.ACCESS_TOKEN);
      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }
      return headers;
    },
  });

  const response = await rawBaseQuery(args, api, extraOptions);

  if (!response.error && response.data) {
    return response;
  }
  if (response && response.error) {
    const customError = response.error as CustomError;
    if (
      customError.data?.message === 'jwt expired' ||
      customError.data?.message === 'jwt malformed'
    ) {
      try {
        const refreshToken = getItemLocalStorage(TokenType.REFRESH_TOKEN);
        const refreshResponse = await rawBaseQuery(
          { method: 'POST', url: '/users/refresh-token', body: { refreshToken } },
          api,
          extraOptions,
        );
        const refreshData = refreshResponse?.data as LoginResponse;
        if (!refreshData?.success) {
          throw new Error('Refresh token failed');
        }
        handleSetLocalStorage(TokenType.ACCESS_TOKEN, refreshData.data.accessToken);
        handleSetLocalStorage(TokenType.REFRESH_TOKEN, refreshData.data.refreshToken);
        return await rawBaseQuery(args, api, extraOptions);
      } catch {
        toast.error('Session expired please login again.');
        handleSessionExpire();
        return response;
      }
    }
    return response;
  }
  return response;
};
enum Tags {
  User = 'user',
  Task = 'task'
}
type LoginResponse = ApiResponse<{ accessToken: string; refreshToken: string; }>;
interface LoginRequest {
  email: string;
  password: string;
}
type RegisterResponse = ApiResponse<{ message: string }>;
interface RegisterRequest {
  name: string;
  password: string;
  email: string;
}
type ProfileResponse = ApiResponse<UserProfileData>;


export const api = createApi({
  reducerPath: 'api',
  baseQuery: customBaseQuery,
  tagTypes: [...Object.values(Tags)],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (credentials) => ({
        url: 'auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),

    profile: builder.query<ProfileResponse, void>({
      query: () => ({
        url: 'users/me',
        method: 'GET'
      }),
    }),
    getAllTasks: builder.query<ApiResponse<{ tasks: TaskType[], total: number }>, { search?: string, skip: number, limit: number }>({
      query: ({ search = "", skip, limit }) => ({
        url: 'tasks/',
        method: 'GET',
        params: {
          search,
          skip,
          limit
        }
      }),
      providesTags: [Tags.Task]
    }),
    getTask: builder.query<ApiResponse<TaskType>, { id: string }>({
      query: ({ id }) => ({
        url: `tasks/${id}`,
        method: 'GET'
      }),
    }),
    createTask: builder.mutation<void, { title: string, description?: string }>({
      query: ({title, description}) => ({
        url: `tasks`,
        method: 'POST',
        body: {
          title, description
        }
      }),
      invalidatesTags: [Tags.Task]
    }),
    updateTask: builder.mutation<ApiResponse<TaskType>, { id: string, task: { title: string, description: string } }>({
      query: ({ id, task }) => ({
        url: `tasks/${id}`,
        method: 'PUT',
        body: {...task}
      }),
      invalidatesTags: [Tags.Task]
    }),
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [Tags.Task]
    }),


  }),
});
export const {
  useLoginMutation,
  useRegisterMutation,
  useProfileQuery,
  useGetAllTasksQuery,
  useGetTaskQuery,
  useUpdateTaskMutation,
  useCreateTaskMutation,
  useDeleteTaskMutation
} = api;
