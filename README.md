# Веб-приложение для организации встреч

Проект веб-приложения для организации и управления мероприятиями с использованием React и JSON Server.

## Технологии

- **Frontend**: React, Redux Toolkit, React Router, CSS Modules
- **Backend**: JSON Server (имитация REST API)

## Структура проекта

```
FINAL_PROJECT/
├── client/              # Frontend часть (React)
│   └── src/             # Исходный код
│       ├── components/  # Компоненты React
│       ├── pages/       # Страницы приложения
│       ├── features/    # Слайсы Redux Toolkit
│       └── api/         # Взаимодействие с API
├── server/              # Backend часть (JSON Server)
│   ├── db.json          # Файл с данными для JSON Server
│   └── server.js        # Настройки JSON Server
```

## Основной функционал

- **Пользователи**: регистрация, авторизация, профиль
- **Мероприятия**: создание, просмотр, редактирование, удаление
- **Участие**: присоединение к мероприятию, отказ от участия

## Запуск проекта

### Требования
- Node.js (версия 14+)
- npm

### Установка и запуск

1. Установить зависимости:
```bash
cd client && npm install
cd ../server && npm install
```

2. Запустить JSON Server:
```bash
cd server && npm run server
```

3. Запустить клиентскую часть:
```bash
cd client && npm start
```

4. Открыть http://localhost:3000

## Автор

Разработано в рамках дипломного проекта по специализации "Frontend-разработка (React)".