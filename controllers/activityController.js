const db = require('../config/db');

exports.getAllActivities = async (req, res) => {
    try {
        const [activities] = await db.query('SELECT * FROM activities');
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.createActivity = async (req, res) => {
    try {
        const { title, description } = req.body;
        const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
        const imageUrl = req.file ? `${baseUrl}/uploads/${req.file.filename}` : null;
        
        await db.query('INSERT INTO activities (image, title, description) VALUES (?, ?, ?)', [imageUrl, title, description]);
        res.status(201).json({ message: 'Activité ajoutée' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.updateActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, existingImage } = req.body;
        const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
        const imageUrl = req.file ? `${baseUrl}/uploads/${req.file.filename}` : existingImage;

        await db.query('UPDATE activities SET image = ?, title = ?, description = ? WHERE id = ?', [imageUrl, title, description, id]);
        res.status(200).json({ message: 'Activité modifiée' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.deleteActivity = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM activities WHERE id = ?', [id]);
        res.status(200).json({ message: 'Activité supprimée' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

