import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { deleteEvent, joinEvent, leaveEvent } from '../../features/events/eventsSlice';
import { fetchEventById } from '../../features/events/eventsSlice';
import { fetchAllUsers } from '../../features/users/usersSlice';
import { formatDateTime } from '../../utils/dateFormat';
import styles from './EventDetails.module.css';

function EventDetailsPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const eventData = useSelector(state => state.events.currentEvent);
    const { loading } = useSelector(state => state.events);
    const { users } = useSelector(state => state.usersData);
    const { user } = useSelector(state => state.auth);
    const [dataLoaded, setDataLoaded] = useState(false);

    const isOrganizer = eventData && user && eventData.organizerId === user.id;
    const isParticipant = eventData && user && eventData.participants && eventData.participants.includes(user.id);

    useEffect(() => {
        if (id) {
            dispatch(fetchEventById(id))
                .then(() => setDataLoaded(true))
                .catch(error => {
                    console.error('Ошибка при загрузке события:', error);
                    setDataLoaded(true);
                });
        }
    }, [dispatch, id]);

    useEffect(() => {
        dispatch(fetchAllUsers())
    }, [dispatch]);

    if (loading || !dataLoaded) {
        return <div className={styles.loadingContainer}>Загрузка...</div>
    }
    
    if (!eventData) {
        return (
            <div className={styles.container}>
                <button 
                    className={`${styles.button} ${styles.backButton}`}
                    onClick={() => navigate(-1)}
                >
                    ← Назад
                </button>
                <div className={styles.loadingContainer}>
                    Событие не найдено или было удалено
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <button 
                className={`${styles.button} ${styles.backButton}`}
                onClick={() => navigate('/profile')}
            >
                ← Назад в профиль
            </button>
            
            <div className={styles.eventCard}>
                <div className={styles.eventHeader}>
                    <h1 className={styles.eventTitle}>{eventData.title}</h1>
                    
                    <div className={styles.eventInfo}>
                        <div className={styles.infoItem}>
                            <span className={styles.infoIcon}>🗓️</span>
                            <span>{eventData.dateTime ? formatDateTime(eventData.dateTime) : 'Не указано'}</span>
                        </div>
                        
                        <div className={styles.infoItem}>
                            <span className={styles.infoIcon}>📍</span>
                            <span>{eventData.location || 'Не указано'}</span>
                        </div>
                        
                        <div className={styles.infoItem}>
                            <span className={styles.infoIcon}>👥</span>
                            <span>Участников: {eventData.participants ? eventData.participants.length : 0}</span>
                        </div>
                    </div>
                </div>
                
                <div className={styles.eventBody}>
                    <h2 className={styles.sectionTitle}>Описание</h2>
                    <p className={styles.description}>{eventData.description || 'Описание отсутствует'}</p>
                    
                    <div className={styles.participantsSection}>
                        <h2 className={styles.sectionTitle}>Список участников</h2>
                        
                        <div className={styles.participantsList}>
                            {eventData.participants && eventData.participants.length > 0 ? 
                                eventData.participants.map(participantId => {
                                    const participantData = users && users.find(u => u.id === participantId);
                                    
                                    return participantData ? (
                                        <div key={participantId} className={styles.participantCard}>
                                            <h3 className={styles.participantName}>{participantData.name}</h3>
                                            <p className={styles.participantEmail}>{participantData.email}</p>
                                        </div>
                                    ) : (
                                        <div key={participantId} className={styles.participantCard}>
                                            <p className={styles.participantName}>Участник</p>
                                            <p className={styles.participantEmail}>Информация загружается...</p>
                                        </div>
                                    );
                                })
                                : <p className={styles.noEventsMessage}>Пока нет участников</p>
                            }
                        </div>
                    </div>
                </div>
                
                <div className={styles.actionButtons}>
                    {isOrganizer && (
                        <>
                            <button 
                                className={`${styles.button} ${styles.editButton}`}
                                onClick={() => navigate(`/events/edit/${eventData.id}`)}
                            >
                                Редактировать
                            </button>
                            <button 
                                className={`${styles.button} ${styles.deleteButton}`}
                                onClick={() => {
                                    dispatch(deleteEvent(eventData.id))
                                        .then(() => {
                                            navigate('/profile');
                                        })
                                        .catch(error => {
                                            console.error('Ошибка при удалении события:', error);
                                        });
                                }}
                            >
                                Удалить
                            </button>
                        </>
                    )}
                    
                    {isParticipant && !isOrganizer && (
                        <button 
                            className={`${styles.button} ${styles.leaveButton}`}
                            onClick={() => {
                                dispatch(leaveEvent(eventData.id))
                                    .then(() => {
                                        navigate('/profile');
                                    })
                                    .catch(error => {
                                        console.error('Ошибка при выходе из события:', error);
                                    });
                            }}
                        >
                            Покинуть встречу
                        </button>
                    )}
                    
                    {!isParticipant && user && (
                        <button 
                            className={`${styles.button} ${styles.joinButton}`}
                            onClick={() => {
                                dispatch(joinEvent({ eventId: eventData.id, userId: user.id}))
                                    .then(() => {
                                        navigate('/profile');
                                    })
                                    .catch(error => {
                                        console.error('Ошибка при присоединении к событию:', error);
                                    });
                            }}
                        >
                            Присоединиться
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default EventDetailsPage;