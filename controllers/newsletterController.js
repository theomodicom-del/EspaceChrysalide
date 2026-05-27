const db = require('../config/db');
const axios = require('axios');

exports.subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Veuillez entrer un email.' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Format d\'email invalide.' });
        }

        const [existing] = await db.query('SELECT id FROM newsletter WHERE email = ?', [email]);
        if (existing.length === 0) {
            await db.query('INSERT INTO newsletter (email) VALUES (?)', [email]);
        }

        try {
            await axios.post(
                'https://api.brevo.com/v3/contacts',
                {
                    email: email,
                    updateEnabled: true 
                },
                {
                    headers: {
                        'api-key': process.env.BREVO_API_KEY,
                        'Content-Type': 'application/json'
                    }
                }
            );
        } catch (brevoError) {
            console.error(brevoError.message);
        }

        res.status(201).json({ message: 'Inscription réussie !' });

    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'inscription.' });
    }
};
