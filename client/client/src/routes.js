import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import HomePage from './pages/Home/index';
import LoginPage from './pages/Login/index';
import ProfilePage from './pages/Profile/index';
import RegisterPage from './pages/Register/index';
import CreateEventPage from './pages/CreateEvent/index';
import EventDetailsPage from './pages/EventDetails/index';
import EditEventPage from './pages/EditEvent/index';

function AppRoutes() {
    return (
        <Routes>
            <Route path='/' element={<HomePage />}/>
            <Route path='/login' element={<LoginPage />}/>
            <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}/>
            <Route path='/register' element={<RegisterPage />}/>
            <Route path='/events/create' element={<ProtectedRoute><CreateEventPage /></ProtectedRoute>}/>
            <Route path='/events/:id' element={<ProtectedRoute><EventDetailsPage /></ProtectedRoute>}/>
            <Route path="/events/edit/:id" element={<EditEventPage />} />
        </Routes>
    )
}

export default AppRoutes;