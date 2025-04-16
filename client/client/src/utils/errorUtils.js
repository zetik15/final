export function getErrorInfo(error) {
    if (!error.response) {
        return {
            statusCode: 0,
            message: 'Ошибка сети. Проверьте подключение к интернету'
        }
    }

    const statusCode = error.response.status;
    let message = error.response.data?.message;

    if (!message) {
        if (statusCode === 401) message = 'Необходима авторизация';
        else if (statusCode === 403) message = 'Доступ запрещён';
        else if (statusCode === 404) message = 'Ресурс не найден';
        else if (statusCode === 409) message = 'Конфликт данных';
        else if (statusCode >= 500) message = 'Ошибка сервера';
        else message = 'Произошла ошибка'
    }

    return { statusCode, message }
}