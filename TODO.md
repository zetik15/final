# План работы над дипломным проектом "Сайт для организации встреч"

## Структура проекта (упрощенная версия с JSON Server)
- **client** - Frontend часть (React)
  - public - статические файлы
  - src - исходный код
    - components - компоненты React
    - pages - страницы приложения
    - features - слайсы Redux Toolkit
    - api - взаимодействие с API
    - utils - вспомогательные функции

- **server** - Backend часть (JSON Server)
  - db.json - файл с данными для JSON Server
  - server.js - настройки JSON Server
  - package.json - зависимости и скрипты

## Функциональность MVP
- **Пользователи**:
  - [x] Регистрация
  - [x] Авторизация
  - [x] Просмотр профиля

- **Мероприятия**:
  - [x] Создание мероприятия
  - [x] Просмотр списка мероприятий
  - [x] Просмотр деталей мероприятия
  - [x] Редактирование своих мероприятий
  - [x] Удаление своих мероприятий

- **Участие**:
  - [x] Присоединение к мероприятию
  - [x] Отказ от участия
  - [x] Просмотр списка участников

- **Интерфейс**:
  - [x] Адаптивный дизайн

## Этапы разработки

### 1. Подготовка и планирование
- [x] Создать структуру документации
- [x] Определить функциональность MVP
- [x] Настроить JSON Server для имитации API
- [x] Спроектировать структуру данных

### 2. Frontend (React)
- [x] Создать структуру проекта React
- [x] Настроить маршрутизацию
- [x] Разработать компоненты UI
- [x] Реализовать страницу авторизации/регистрации
- [x] Реализовать страницу создания мероприятий
- [x] Реализовать страницу просмотра мероприятий
- [x] Реализовать страницу управления мероприятиями
- [x] Настроить Redux Toolkit для управления состоянием
- [x] Реализовать взаимодействие с JSON Server API

### 3. Тестирование и отладка
- [x] Протестировать основные функции
- [x] Исправить выявленные ошибки