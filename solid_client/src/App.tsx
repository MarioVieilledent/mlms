import { createSignal } from "solid-js";
import "./App.css";

interface Message {
  id: string;
  data: string;
  color: string;
}

interface MicroService {
  name: string;
  port: number;
  state: "unknown" | "error" | "success";
}

const MessageComponent = () => {
  const [messages, setMessages] = createSignal<Message[]>([]);
  const [newMessage, setNewMessage] = createSignal<Message>({
    id: "",
    data: "",
    color: "",
  });

  const [microServices, setMicroServices] = createSignal<MicroService[]>([
    {
      name: "go_ms",
      port: 4001,
      state: "unknown",
    },
    {
      name: "nodejs_ms",
      port: 4002,
      state: "unknown",
    },
    {
      name: "python_ms",
      port: 4003,
      state: "unknown",
    },
    {
      name: "rust_ms",
      port: 4004,
      state: "unknown",
    },
  ]);

  const [MSIndex, setMSIndex] = createSignal<number>(0);

  const fetchMessages = async (ms: MicroService) => {
    try {
      console.log(`GET ro ${ms.name}`);

      const response = await fetch(`http://localhost:${ms.port}/message`);
      const data = await response.json();

      let updatedMS: MicroService[] = JSON.parse(
        JSON.stringify(microServices())
      );
      let index = updatedMS.findIndex((e) => e.name === ms.name);
      if (index >= 0) {
        updatedMS[index].state = "success";
      }
      setMicroServices(updatedMS);
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      let updatedMS: MicroService[] = JSON.parse(
        JSON.stringify(microServices())
      );
      let index = updatedMS.findIndex((e) => e.name === ms.name);
      if (index >= 0) {
        updatedMS[index].state = "error";
      }
      setMicroServices(updatedMS);
    }
  };

  const createNewMessage = async (ms: MicroService) => {
    try {
      console.log(`POST to ${ms.name}`);

      await fetch(`http://localhost:${ms.port}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage()),
      });

      console.log(`POST response from ${ms.name}`);

      setNewMessage({
        id: "",
        data: "",
        color: "",
      });
      // Fetch all messages again to update the list
      fetchMessages(microServices()[MSIndex()]);
    } catch (error) {
      console.error("Error creating new message:", error);
    }
  };

  return (
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <h1>Benchmark</h1>
      <div style="display: flex; align-items: center; gap: 12px;">
        {microServices().map((ms, index) => (
          <button
            onclick={() => setMSIndex(index)}
            style={{
              "background-color":
                ms.state === "error"
                  ? "#733"
                  : ms.state === "success"
                  ? "#373"
                  : "#333",
            }}
          >
            Use {ms.name} on port {ms.port}
          </button>
        ))}
      </div>
      <button onClick={() => fetchMessages(microServices()[MSIndex()])}>
        Fetch Messages from ms {microServices()[MSIndex()].name}
      </button>
      <ul>
        {messages().map((message) => (
          <li>
            <div>ID: {message.id}</div>
            <div>Data: {message.data}</div>
            <div>Color: {message.color}</div>
          </li>
        ))}
      </ul>
      <h2>Create New Message from {microServices()[MSIndex()].name}</h2>
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
      <button onClick={() => createNewMessage(microServices()[MSIndex()])}>
        Create Message
      </button>
      <div>{microServices()[1].state}</div>
    </div>
  );
};

export default MessageComponent;
