import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signout, deleteAccount } from '../../features/auth/authSlice';
import { EventCard } from '../../components/EventCard/index';
import { useNavigate, Link } from 'react-router-dom';
import { fetchEvents } from '../../features/events/eventsSlice';
import styles from './Profile.module.css';

function ProfilePage() {
    const { user, loading } = useSelector(state => state.auth);
    const { events } = useSelector(state => state.events);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    useEffect(() => {
        dispatch(fetchEvents())
    }, [dispatch])

    const handleSignout = () => {
        try {
            dispatch(signout())
                .then(() => {
                    navigate('/');
                })
                .catch(error => {
                    console.error('Ошибка при выходе из системы:', error);
                });
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }
    
    const handleDeleteAccount = () => {
        if (!user || !user.id) return;
        
        try {
            dispatch(deleteAccount(user.id))
                .then(() => {
                    navigate('/');
                })
                .catch(error => {
                    console.error('Ошибка при удалении аккаунта:', error);
                });
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    if (loading) {
        return <div className={styles.loadingContainer}>Загрузка...</div>
    }

    if (events.loading) {
        return <div className={styles.loadingContainer}>Загрузка событий...</div>
    }

    if (!user) {
        return <div className={styles.loadingContainer}>Пользователь не найден</div>
    }

    return (
        <div className={styles.container}>
            <div className={styles.homeButton}>
                <Link to="/" className={styles.link}>На главную</Link>
            </div>
            
            <div className={styles.header}>
                <div className={styles.userInfo}>
                    <h1 className={styles.userName}>{user.name}</h1>
                    <p className={styles.userEmail}>{user.email}</p>
                </div>
                <div className={styles.actions}>
                    <button 
                        className={styles.createButton}
                        onClick={() => navigate('/events/create')}
                    >
                        Создать встречу
                    </button>
                    <button 
                        className={styles.signoutButton}
                        onClick={handleSignout}
                    >
                        Выйти из аккаунта
                    </button>
                    <button 
                        className={styles.deleteButton}
                        onClick={() => setShowConfirmDelete(true)}
                    >
                        Удалить аккаунт
                    </button>
                </div>
            </div>
            
            <div className={styles.eventsSection}>
                <h2 className={styles.sectionTitle}>Мои встречи</h2>
                
                {events && events.length > 0 ? (
                    <div className={styles.eventsList}>
                        {events
                            .filter(event => event.organizerId === user.id || event.participants.includes(user.id))
                            .map(event => (
                                <EventCard key={event.id} event={event} interactive={true}/>
                            ))}
                    </div>
                ) : (
                    <p className={styles.noEvents}>У вас пока нет встреч</p>
                )}
            </div>
            
            {showConfirmDelete && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3 className={styles.modalTitle}>Подтверждение удаления</h3>
                        <p className={styles.modalText}>Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить.</p>
                        <div className={styles.modalButtons}>
                            <button 
                                className={styles.cancelButton}
                                onClick={() => setShowConfirmDelete(false)}
                            >
                                Отмена
                            </button>
                            <button 
                                className={styles.confirmDeleteButton}
                                onClick={handleDeleteAccount}
                            >
                                Удалить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfilePage;