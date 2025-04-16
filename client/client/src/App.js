import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser, signin } from './features/auth/authSlice';
import { get } from './utils/localStorage';

function App() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Получаем данные из localStorage
    const userId = get('userId');
    const token = get('token');
    const userEmail = get('userEmail');
    const userPassword = get('userPassword');
    
    // Если есть userId и token, пытаемся загрузить пользователя
    if (userId && token) {
      dispatch(getCurrentUser(userId))
        .then(() => {
          console.log('Пользователь успешно загружен');
          setIsInitialized(true);
        })
        .catch((err) => {
          console.error('Ошибка при загрузке пользователя:', err);
          
          // Если есть email и пароль, пытаемся войти заново
          if (userEmail && userPassword) {
            dispatch(signin({ email: userEmail, password: userPassword }))
              .then(() => {
                console.log('Автоматический вход выполнен');
                setIsInitialized(true);
              })
              .catch((loginErr) => {
                console.error('Ошибка автовхода:', loginErr);
                setIsInitialized(true);
              });
          } else {
            setIsInitialized(true);
          }
        });
    } else {
      // Если нет данных для авторизации, просто показываем приложение
      setIsInitialized(true);
    }
  }, [dispatch]);
  
  // Показываем загрузку, пока не инициализировали приложение
  if (!isInitialized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        flexDirection: 'column',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ 
          marginBottom: '10px', 
          fontSize: '18px',
          color: '#333' 
        }}>
          Загрузка...
        </div>
        {error && (
          <div style={{ 
            color: '#e53e3e',
            backgroundColor: '#fff5f5',
            border: '1px solid #fc8181',
            borderRadius: '8px',
            padding: '10px 15px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
