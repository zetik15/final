const jsonServer = require('json-server');
const cors = require('cors');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(cors({
  origin: ['https://event-organizer-front.onrender.com', 'http://localhost:3000'],
  credentials: true
}));
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Middleware для проверки авторизации
server.use((req, res, next) => {
  // Пропускаем запросы на логин и регистрацию
  if (req.path === '/login' || (req.path === '/users' && req.method === 'POST')) {
    return next();
  }
  
  // Пропускаем GET запросы для публичного доступа
  if (req.method === 'GET') {
    return next();
  }
  
  // Проверяем наличие токена в заголовке
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Требуется авторизация' });
  }
  
  // Для простоты проверяем только наличие токена, без валидации
  // В реальном приложении здесь была бы проверка JWT
  next();
});

server.post('/login', (req, res) => {
  const users = router.db.get('users').value();
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ message: 'Пользователь не найден' });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: 'Неверный пароль' });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    token: 'fake-jwt-token'
  });
});

server.post('/users', (req, res) => {
  const users = router.db.get('users').value();
  const { email, password, name } = req.body;
  const existingUser = users.find(u => u.email === email);

  if (existingUser) {
    return res.status(409).json({ message: 'Пользователь с таким email уже существует' });
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password
  };

  router.db.get('users').push(newUser).write();

  res.status(201).json({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    token: 'fake-jwt-token'
  });
});

server.use(router);

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`JSON Server запущен на порту ${PORT}`);
});