import { createEvent } from '../../features/events/eventsSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { get } from '../../utils/localStorage';
import styles from './CreateEvent.module.css';

function CreateEventPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dateTime: '',
        location: ''
    });

    const handleToChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    // Добавляем состояние для ошибки
    const [error, setError] = useState('');

    const handleToSubmit = (e) => {
        if (e) e.preventDefault();
        
        // Простая проверка полей
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
            // Получаем userId из localStorage и убеждаемся, что он в правильном формате
            const userId = get('userId');
            if (!userId) {
                setError('Вы не авторизованы. Пожалуйста, войдите в систему.');
                return;
            }
            
            // Создаем объект события
            const eventData = {
                title: formData.title,
                description: formData.description,
                dateTime: formData.dateTime,
                location: formData.location,
                organizerId: userId,
                participants: [userId]
            };
            
            // Проверяем наличие токена
            const token = get('token');
            if (!token) {
                setError('Токен авторизации отсутствует. Пожалуйста, войдите в систему заново.');
                return;
            }
            
            // Отправляем запрос на создание события
            dispatch(createEvent(eventData))
                .unwrap()
                .then(() => {
                    navigate('/profile');
                })
                .catch(error => {
                    console.error('Ошибка при создании события:', error);
                    setError(error.message || 'Ошибка при создании события. Проверьте права доступа.');
                });
        } catch (error) {
            console.error('Ошибка:', error);
            setError('Произошла ошибка при создании события');
        }
    }

    const handleToCancel = () => {
        setFormData({
            title: '',
            description: '',
            dateTime: '',
            location: ''
        });
        
        navigate(-1)
    }

    return (
        <div className={styles.container}>
            <div className={styles.homeButton}>
                <Link to="/" className={styles.link}>На главную</Link>
            </div>
            
            <h1 className={styles.title}>Создать событие</h1>
            
            {error && <div className={styles.errorMessage}>{error}</div>}
            
            <div className={styles.formGroup}>
                <label className={styles.label} htmlFor='title'>Название:</label>
                <input 
                    className={styles.input}
                    onChange={handleToChange} 
                    type='text' 
                    name='title' 
                    id='title' 
                    required 
                    value={formData.title} 
                />
            </div>
            
            <div className={styles.formGroup}>
                <label className={styles.label} htmlFor='dateTime'>Время проведения:</label>
                <input 
                    className={styles.input}
                    onChange={handleToChange} 
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
                    onChange={handleToChange} 
                    type='text' 
                    name='location' 
                    id='location' 
                    value={formData.location} 
                />
            </div>
            
            <div className={styles.formGroup}>
                <label className={styles.label} htmlFor='description'>Описание:</label>
                <textarea 
                    className={styles.textarea}
                    onChange={handleToChange} 
                    name='description' 
                    id='description' 
                    value={formData.description} 
                />
            </div>
            
            <div className={styles.buttonGroup}>
                <button 
                    className={`${styles.button} ${styles.secondaryButton}`}
                    onClick={handleToCancel}
                >
                    Отменить
                </button>
                <button 
                    className={`${styles.button} ${styles.primaryButton}`}
                    onClick={handleToSubmit}
                >
                    Создать
                </button>
            </div>
        </div>
    )
}

export default CreateEventPage;