import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { registerUser, clearError } from '../../features/auth/authSlice';
import { remove } from '../../utils/localStorage';
import styles from './Register.module.css';

function RegisterPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })
    const { error, loading } = useSelector(state => state.auth);

    useEffect(() => {
        // Очищаем ошибки при загрузке страницы
        dispatch(clearError());
        
        // Очищаем localStorage при загрузке страницы регистрации
        // Это позволит избежать проблем с регистрацией после удаления пользователя
        remove('token');
        remove('userId');
        remove('userEmail');
        remove('userPassword');
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Очищаем localStorage перед регистрацией
        remove('token');
        remove('userId');
        remove('userEmail');
        remove('userPassword');

        const userData = {
            name: formData.name,
            email: formData.email,
            password: formData.password
        }

        dispatch(registerUser(userData))
            .then((resultAction) => {
                if (registerUser.fulfilled.match(resultAction)) {
                    navigate('/profile')
                }
            });
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Регистрация</h2>
            
            {error && <div className={styles.errorMessage}>{error}</div>}
            
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor='name'>Имя:</label>
                    <input 
                        className={styles.input}
                        type='text'
                        id='name'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Введите ваше имя"
                    />
                </div>
                
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor='email'>Почта:</label>
                    <input 
                        className={styles.input}
                        type='email'
                        id='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="example@mail.com"
                    />
                </div>
                
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor='password'>Пароль:</label>
                    <input 
                        className={styles.input}
                        type='password'
                        id='password'
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Минимум 6 символов"
                    />
                </div>
                
                <button 
                    className={styles.button} 
                    type='submit' 
                    disabled={loading}
                >
                    {loading ? 'Загрузка...' : 'Зарегистрироваться'}
                </button>
            </form>
            
            <p className={styles.loginLink}>
                Уже есть аккаунт? <Link className={styles.link} to='/login'>Войти</Link>
            </p>
        </div>
    )
}

export default RegisterPage;