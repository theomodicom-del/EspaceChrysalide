const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { apiLimiter } = require('./middlewares/rateLimit');
const likesRoutes = require('./routes/likes');
const sequelize = require('./db');
const User = require('./models/User');

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use('/api/', apiLimiter);
app.use('/api/likes', likesRoutes);

const authRoutes = require('./routes/authRoutes');
const activityRoutes = require('./routes/activityRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const planningRoutes = require('./routes/planningRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/planning', planningRoutes);

app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
    .then(() => {
        console.log('✅ Base de données synchronisée avec succès !');
        app.listen(PORT, () => {
            console.log(`🚀 Serveur en cours d'exécution sur le port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ Erreur lors de la synchronisation :', error);
    });