const db = require('../config/db');

exports.getAllEvents = async (req, res) => {
    try {
        const [events] = await db.query('SELECT * FROM planning ORDER BY FIELD(day, "LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI", "DIMANCHE")');
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const { day, title, description, location, time } = req.body;
        await db.query(
            'INSERT INTO planning (day, title, description, location, time) VALUES (?, ?, ?, ?, ?)',
            [day, title, description, location, time]
        );
        res.status(201).json({ message: 'Créneau ajouté' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { day, title, description, location, time } = req.body;
        await db.query(
            'UPDATE planning SET day = ?, title = ?, description = ?, location = ?, time = ? WHERE id = ?',
            [day, title, description, location, time, id]
        );
        res.status(200).json({ message: 'Créneau modifié' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM planning WHERE id = ?', [id]);
        res.status(200).json({ message: 'Créneau supprimé' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};