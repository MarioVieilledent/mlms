from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Define a sample database to store messages
messages = []

# TypeScript type for message
class Message:
    def __init__(self, id: str, data: str, color: str):
        self.id = id
        self.data = data
        self.color = color

# Endpoint to retrieve all messages
@app.route('/message', methods=['GET'])
def get_messages():
    return jsonify([vars(message) for message in messages])

# Endpoint to add a new message
@app.route('/message', methods=['POST'])
def add_message():
    data = request.json
    if not all(key in data for key in ('id', 'data', 'color')):
        return jsonify({'error': 'Incorrect message format. Required fields: id, data, color'}), 400
    message = Message(data['id'], data['data'], data['color'])
    messages.append(message)
    return jsonify({'message': 'Message added successfully'}), 201

# Endpoint to update a message by ID
@app.route('/message/<string:message_id>', methods=['PUT'])
def update_message(message_id):
    data = request.json
    message = next((msg for msg in messages if msg.id == message_id), None)
    if message is None:
        return jsonify({'error': f'Message with id {message_id} not found'}), 404
    if not all(key in data for key in ('data', 'color')):
        return jsonify({'error': 'Incorrect message format. Required fields: data, color'}), 400
    message.data = data['data']
    message.color = data['color']
    return jsonify({'message': 'Message updated successfully'})


if __name__ == '__main__':
    app.run(port=4003)