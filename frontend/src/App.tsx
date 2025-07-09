import { Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import ErrorBoundary from './wrappers/ErrorBoundary';
import Loader from './components/common/Loader';
import PublicRoutes from './routes/PublicRoutes';
import PrivateRoutes from './routes/PrivateRoutes';
import { useAppDispatch, useAppSelector } from './store/store';
import { useProfileQuery } from './services/api';
import { setUser } from './store/reducers/authReducer';

function App() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((root) => root.auth);
  const { data, isLoading } = useProfileQuery();

  useEffect(() => {
    if (!user && data) {
      const user = { ...data.data, userId: data.data?.id };
      dispatch(setUser({ user }));
    }
  }, [user, dispatch, data]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ErrorBoundary fallback={<div>Error loading component!</div>}>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/*" element={renderRoutes(user)} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

function renderRoutes(user?: UserProfileData | null) {
  if (!user) return <PublicRoutes />;

  else return <PrivateRoutes/>
}

export default App;
