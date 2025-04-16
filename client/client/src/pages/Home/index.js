import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../../features/events/eventsSlice';
import { getCurrentUser } from '../../features/auth/authSlice';
import { EventCard } from '../../components/EventCard/index';
import { get } from '../../utils/localStorage';
import styles from './Home.module.css';

function HomePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { events, loading } = useSelector(state => state.events);
    const { user } = useSelector(state => state.auth);
    
    useEffect(() => {
        dispatch(fetchEvents());
        
        const userId = get('userId');
        const token = get('token');
        
        if (userId && token) {
            dispatch(getCurrentUser(userId));
        }
    }, [dispatch]);

    if (loading) {
        return <div className={styles.loadingContainer}>Загрузка...</div>
    }

    const isUserLoggedIn = get('token') && get('userId');

    return (
        <div className={styles.container}>
            {isUserLoggedIn ? (
                <>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Доступные события</h1>
                        <p className={styles.subtitle}>Просматривайте доступные события или создайте свое собственное</p>
                        <div className={styles.headerButtons}>
                            <Link 
                                to="/events/create" 
                                className={`${styles.button} ${styles.createButton}`}
                            >
                                Создать новое событие
                            </Link>
                            <Link 
                                to="/profile" 
                                className={`${styles.button} ${styles.profileButton}`}
                            >
                                Мой профиль
                            </Link>
                        </div>
                    </div>
                    
                    <h2 className={styles.sectionTitle}>Все события</h2>
                    
                    {events && events.length > 0 ? (
                        <div className={styles.eventsGrid}>
                            {events.map(event => (
                                <EventCard key={event.id} event={event} interactive={true}/>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.noEventsMessage}>
                            Пока нет доступных событий. Будьте первым, кто создаст событие!
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div className={styles.welcomeSection}>
                        <h1 className={styles.title}>Добро пожаловать на сайт для организации встреч</h1>
                        <p className={styles.subtitle}>Здесь вы можете организовывать встречи, присоединяться к существующим и управлять своими событиями</p>
                        
                        <div className={styles.authButtons}>
                            <Link 
                                to="/login" 
                                className={`${styles.button} ${styles.loginButton}`}
                            >
                                Войти
                            </Link>
                            <Link 
                                to="/register" 
                                className={`${styles.button} ${styles.registerButton}`}
                            >
                                Зарегистрироваться
                            </Link>
                        </div>
                    </div>
                    
                    <h2 className={styles.sectionTitle}>Предстоящие события</h2>
                    
                    {events && events.length > 0 ? (
                        <div className={styles.eventsGrid}>
                            {events.map(event => (
                                <EventCard key={event.id} event={event} interactive={false} />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.noEventsMessage}>
                            Пока нет доступных событий. Заходите позже!
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default HomePage;