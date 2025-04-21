import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signin, clearError } from '../../features/auth/authSlice';
import { useState, useEffect } from 'react';
import styles from './Login.module.css';

function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { error, loading } = useSelector(state => state.auth);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const searchParams = new URLSearchParams(location.search);
    const redirect = searchParams.get('redirect') || '/profile';

    useEffect(() => {
        dispatch(clearError());
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const credentials = {
            email: formData.email,
            password: formData.password
        }

        dispatch(signin(credentials))
            .unwrap()
            .then(() => {
                navigate(redirect);
            })
            .catch((error) => {
                console.error('Ошибка входа:', error);
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
            <h2 className={styles.title}>Вход в систему</h2>
            
            {error && <div className={styles.errorMessage}>{error}</div>}
            
            <form className={styles.form} onSubmit={handleSubmit}>
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
                    />
                </div>
                
                <button 
                    className={styles.button} 
                    type='submit' 
                    disabled={loading}
                >
                    {loading ? 'Загрузка...' : 'Войти'}
                </button>
            </form>
            
            <p className={styles.registerLink}>
                Нет аккаунта? <Link className={styles.link} to='/register'>Зарегистрироваться</Link>
            </p>
        </div>
    )
}

export default LoginPage;