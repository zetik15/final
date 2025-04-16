import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteEvent, joinEvent, leaveEvent, fetchEvents } from '../../features/events/eventsSlice';
import { formatDateTime } from '../../utils/dateFormat';
import styles from './EventCard.module.css';

export function EventCard({ event, interactive }) {
    const { user } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const userId = localStorage.getItem('userId');
    const userId_parsed = userId ? JSON.parse(userId) : null;
    
    const isOrganizer = userId_parsed && event.organizerId === userId_parsed;
    const isParticipant = userId_parsed && event.participants.includes(userId_parsed);

    return (
        <div className={styles.card}>
            <div className={styles.cardContent}>
                <h2 className={styles.title}>{event.title}</h2>
                <p className={styles.info}>
                    <span className={styles.infoLabel}>Время проведения:</span> {formatDateTime(event.dateTime)}
                </p>
                <p className={styles.info}>
                    <span className={styles.infoLabel}>Локация:</span> {event.location}
                </p>
                <p className={styles.description}>{event.description}</p>
                <div className={styles.participants}>
                    <span className={styles.participantsIcon}>&#x1F465;</span>
                    <span>Участников: {event.participants.length}</span>
                </div>
            </div>
            
            {interactive && (
                <div className={styles.cardActions}>
                    <button 
                        className={`${styles.button} ${styles.detailsButton}`}
                        onClick={() => navigate(`/events/${event.id}`)}
                    >
                        Подробнее
                    </button>
                    
                    {isOrganizer && (
                        <div className={styles.organizerActions}>
                            <button 
                                className={`${styles.button} ${styles.editButton}`}
                                onClick={() => navigate(`/events/edit/${event.id}`)}
                            >
                                Редактировать
                            </button>
                            <button 
                                className={`${styles.button} ${styles.deleteButton}`}
                                onClick={() => {
                                    dispatch(deleteEvent(event.id))
                                        .catch(error => {
                                            console.error('Ошибка при удалении события:', error);
                                        });
                                }}
                            >
                                Удалить
                            </button>
                        </div>
                    )}
                    
                    {isParticipant && !isOrganizer && (
                        <button 
                            className={`${styles.button} ${styles.leaveButton}`}
                            onClick={() => {
                                if (!userId_parsed) {
                                    alert('Необходимо авторизоваться');
                                    return;
                                }
                                
                                dispatch(leaveEvent({ eventId: event.id, userId: userId_parsed }))
                                    .unwrap()
                                    .then(() => {
                                        dispatch(fetchEvents());
                                    })
                                    .catch(error => {
                                        console.error('Ошибка при выходе из события:', error);
                                        alert('Ошибка при выходе из события');
                                    });
                            }}
                        >
                            Покинуть встречу
                        </button>
                    )}
                    
                    {!isParticipant && (
                        <button 
                            className={`${styles.button} ${styles.joinButton}`}
                            onClick={() => {
                                if (!userId_parsed) {
                                    alert('Необходимо авторизоваться');
                                    return;
                                }
                                dispatch(joinEvent({ eventId: event.id, userId: userId_parsed }))
                                    .unwrap()
                                    .then(() => {
                                        dispatch(fetchEvents());
                                    })
                                    .catch(error => {
                                        console.error('Ошибка при присоединении к событию:', error);
                                        alert('Ошибка при присоединении к событию');
                                    });
                            }}
                        >
                            Присоединиться
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}