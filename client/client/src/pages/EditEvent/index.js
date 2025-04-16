import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { fetchEventById, updateEventThunk } from '../../features/events/eventsSlice';
import { useNavigate } from 'react-router-dom';
import styles from './EditEvent.module.css';

function EditEventPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const eventData = useSelector(state => state.events.currentEvent);
    const { loading } = useSelector(state => state.events);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dateTime: '',
        location: ''
    });

    const handleChangeFormData = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSave = (e) => {
        if (e) e.preventDefault();
        
        // Проверка полей формы
        if (!formData.title) {
            setError('Название обязательно для заполнения');
            return;
        }
        
        if (!formData.dateTime) {
            setError('Укажите время проведения');
            return;
        }
        
        if (!formData.location) {
            setError('Укажите место проведения');
            return;
        }
        
        setError('');
        
        try {
            const updatedEventData = {
                title: formData.title,
                description: formData.description,
                dateTime: formData.dateTime,
                location: formData.location,
                organizerId: eventData.organizerId,
                participants: eventData.participants
            };
            
            dispatch(updateEventThunk({ id, eventData: updatedEventData }))
                .unwrap()
                .then(() => {
                    navigate(`/events/${id}`);
                })
                .catch(error => {
                    console.error('Ошибка при обновлении события:', error);
                    setError(error.message || 'Ошибка при обновлении события. Проверьте права доступа.');
                });
        } catch (error) {
            console.error('Ошибка:', error);
            setError('Произошла ошибка при обновлении события');
        }
    }

    const handleCancel = () => {
        setFormData({
            title: '',
            description: '',
            dateTime: '',
            location: ''
        });
        
        navigate(`/events/${id}`)
    }

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
        if (eventData) {
            setFormData({
                title: eventData.title || '',
                description: eventData.description || '',
                dateTime: eventData.dateTime || '',
                location: eventData.location || ''
            })
        }
    }, [eventData]);

    if (loading || !dataLoaded) {
        return <div className={styles.loadingContainer}>Загрузка...</div>
    }
    
    if (!eventData && dataLoaded) {
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
                onClick={() => navigate(-1)}
            >
                ← Назад
            </button>
            
            <div className={styles.formCard}>
                <div className={styles.formHeader}>
                    <h1 className={styles.formTitle}>Редактирование события</h1>
                    <p className={styles.formSubtitle}>Внесите необходимые изменения в информацию о событии</p>
                    {error && <div className={styles.errorMessage}>{error}</div>}
                </div>
                
                <div className={styles.formBody}>
                    <form onSubmit={handleSave}>
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor='title'>Название:</label>
                            <input 
                                className={styles.input}
                                onChange={handleChangeFormData} 
                                type='text' 
                                name='title' 
                                id='title' 
                                required 
                                value={formData.title} 
                                placeholder="Введите название события"
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor='dateTime'>Время проведения:</label>
                            <input 
                                className={styles.input}
                                onChange={handleChangeFormData} 
                                type='datetime-local' 
                                name='dateTime' 
                                id='dateTime' 
                                value={formData.dateTime} 
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor='location'>Локация:</label>
                            <input 
                                className={styles.input}
                                onChange={handleChangeFormData} 
                                type='text' 
                                name='location' 
                                id='location' 
                                value={formData.location} 
                                placeholder="Укажите место проведения"
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor='description'>Описание:</label>
                            <textarea 
                                className={styles.textarea}
                                onChange={handleChangeFormData} 
                                name='description' 
                                id='description' 
                                value={formData.description} 
                                placeholder="Добавьте описание события"
                            />
                        </div>
                        
                        <div className={styles.actionButtons}>
                            <button 
                                type="button"
                                className={`${styles.button} ${styles.cancelButton}`}
                                onClick={handleCancel}
                            >
                                Отмена
                            </button>
                            
                            <button 
                                type="submit"
                                className={`${styles.button} ${styles.saveButton}`}
                            >
                                Сохранить
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditEventPage;