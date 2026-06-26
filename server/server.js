const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const env = require('./config/env');
const sequelize = require('./config/db');
// Require models to ensure they are registered before sync
require('./models');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  }
});

// Set io globally on the express app to access it in controllers
app.set('io', io);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const startServer = async () => {
  try {
    // Authenticate and sync DB
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    
    // In production, use migrations instead of sync()
    // Using alter: true is convenient, but wrap in try-catch to avoid crashing on minor constraint sync issues
    try {
      await sequelize.sync({ alter: true });
      console.log('Database synced.');
    } catch (syncErr) {
      console.warn('Database sync alter warning:', syncErr.message);
      await sequelize.sync();
      console.log('Database synced (fallback).');
    }

    server.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();
