import { createSignal } from "solid-js";
import "./App.css";

interface Message {
  id: string;
  data: string;
  color: string;
}

const MessageComponent = () => {
  const [messages, setMessages] = createSignal<Message[]>([]);
  const [newMessage, setNewMessage] = createSignal<Message>({
    id: "",
    data: "",
    color: "",
  });

  const fetchMessages = async () => {
    try {
      const response = await fetch("http://localhost:4001/message");
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const createNewMessage = async () => {
    try {
      await fetch("http://localhost:4001/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage()),
      });
      // Clear new message fields after creation
      setNewMessage({
        id: "",
        data: "",
        color: "",
      });
      // Fetch all messages again to update the list
      fetchMessages();
    } catch (error) {
      console.error("Error creating new message:", error);
    }
  };

  return (
    <div>
      <button onClick={fetchMessages}>Fetch Messages</button>
      <ul>
        {messages().map((message) => (
          <li>
            <div>ID: {message.id}</div>
            <div>Data: {message.data}</div>
            <div>Color: {message.color}</div>
          </li>
        ))}
      </ul>
      <h2>Create New Message</h2>
      <div>
        <label>
          ID:
          <input
            type="text"
            value={newMessage().id}
            onInput={(e) =>
              setNewMessage((prev) => ({ ...prev, id: e.target.value }))
            }
          />
        </label>
      </div>
      <div>
        <label>
          Data:
          <input
            type="text"
            value={newMessage().data}
            onInput={(e) =>
              setNewMessage((prev) => ({ ...prev, data: e.target.value }))
            }
          />
        </label>
      </div>
      <div>
        <label>
          Color:
          <input
            type="text"
            value={newMessage().color}
            onInput={(e) =>
              setNewMessage((prev) => ({ ...prev, color: e.target.value }))
            }
          />
        </label>
      </div>
      <button onClick={createNewMessage}>Create Message</button>
    </div>
  );
};

export default MessageComponent;
