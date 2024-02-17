const express = require('express');
const cors = require('cors');

const PORT = 4002;

const app = express();
app.use(cors());
app.use(express.json());

// Sample database to store messages
const messages = [];

// TypeScript type for message
class Message {
    constructor(id, data, color) {
        this.id = id;
        this.data = data;
        this.color = color;
    }
}

// Endpoint to retrieve all messages
app.get('/message', (req, res) => {
    res.json(messages);
});

// Endpoint to add a new message
app.post('/message', (req, res) => {
    const { id, data, color } = req.body;
    if (!id || !data || !color) {
        return res.status(400).json({ error: 'Incorrect message format. Required fields: id, data, color' });
    }
    const message = new Message(id, data, color);
    messages.push(message);
    res.status(201).json({ message: 'Message added successfully' });
});

// Endpoint to update a message by ID
app.put('/message/:id', (req, res) => {
    const { id } = req.params;
    const { data, color } = req.body;
    const message = messages.find(msg => msg.id === id);
    if (!message) {
        return res.status(404).json({ error: `Message with id ${id} not found` });
    }
    if (!data || !color) {
        return res.status(400).json({ error: 'Incorrect message format. Required fields: data, color' });
    }
    message.data = data;
    message.color = color;
    res.json({ message: 'Message updated successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});