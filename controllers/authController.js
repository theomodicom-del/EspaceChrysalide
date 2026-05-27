const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Format d\'email invalide.' });
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.' });
        }

        const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.query(
            'INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)',
            [firstname, lastname, email, hashedPassword]
        );

        res.status(201).json({ message: 'Utilisateur créé avec succès !' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'inscription.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email et mot de passe requis.' });
        }

        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Identifiants incorrects.' });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Identifiants incorrects.' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET,           
            { expiresIn: '24h' }             
        );

        res.status(200).json({
            message: 'Connexion réussie',
            token: token,
            user: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion.' });
    }
};
