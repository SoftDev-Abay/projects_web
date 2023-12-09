import { React, useState, useEffect, useRef } from "react";
// import "./Chat.scss";
import { FaEllipsisV, FaPaperPlane } from "react-icons/fa";
import ChatsModal from "../modals/ChatsModal";
// import { messages } from "../assets";
import { useAuthContext } from "../context/AuthContext";
import socketIO from "socket.io-client";
// import {
//   Chat,
//   Channel,
//   ChannelHeader,
//   ChannelList,
//   MessageInput,
//   MessageList,
//   Window,
//   // Thread,
// } from "stream-chat-react";
import "./ChatPage.scss";
// import "stream-chat-react/dist/css/index.css";

const socket = socketIO.connect("https://projects-server-api.onrender.com");

const ChatPage = () => {
  const [activeChat, setActiveChat] = useState(null);
  const { user } = useAuthContext();
  const [messages, setMessages] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [chatsModalOpen, setChatsModalOpen] = useState(false);
  const [userChats, setUserChats] = useState([]);
  const dummyMessageLastRef = useRef(null);
  console.log(activeChat);
  const getUserChats = async () => {
    try {
      const response = await fetch(
        `https://projects-server-api.onrender.com/user_chatrooms/${user.id}`
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch user chats. Status: ${response.status}`
        );
      }
      const data = await response.json();
      setUserChats(data);
    } catch (error) {
      console.error("Error fetching user chats:", error);
    }
  };

  const getMessages = async () => {
    try {
      const response = await fetch(
        "https://projects-server-api.onrender.com/chats/messages",
        {
          method: "POST",
          body: JSON.stringify({ chatID: activeChat.id, userID: user.id }),
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch messages. Status: ${response.status}`);
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getUserChats();
      // Set the activeChat to the first chat in userChats
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    setActiveChat(userChats[0]);
  }, [userChats]);

  useEffect(() => {
    // Fetch messages only when activeChat is set
    if (activeChat) {
      getMessages();
      scrollToBottom();
    }
  }, [activeChat]);

  const scrollToBottom = () => {
    dummyMessageLastRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const messageListener = (data) => {
      if (data?.chatroom_id !== activeChat?.id) {
        return;
      }
      const updatedMessages = [...messages, data];
      setMessages(updatedMessages);
      scrollToBottom();
    };

    socket.on("messageResponse", messageListener);

    return () => {
      // Cleanup: Remove the listener when the component unmounts
      socket.off("messageResponse", messageListener);
    };
  }, [socket, messages]);

  const [message, setMessage] = useState("");

  const storeMessageOnDb = async () => {
    const responce = await fetch(
      "https://projects-server-api.onrender.com/messages",
      {
        method: "POST",
        body: JSON.stringify({
          chatroom_id: activeChat.id,
          sender_id: user.id,
          text: message,
          date: new Date().toISOString(),
        }),
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await responce.json();
  };

  const handleSendMessage = () => {
    storeMessageOnDb();
    // console.log(socket.id, " socket.id");

    socket.emit("message", {
      chatroom_id: activeChat.id,
      sender_id: user.id,
      text: message,
      date: new Date().toISOString(),
      id: `${socket.id}${Math.random()}`,
      socketID: socket.id,
    });

    setMessage("");
  };

  const getDateToDisplay = (date) => {
    const today = new Date();
    const messageDate = new Date(date);
    if (
      today.getFullYear() === messageDate.getFullYear() &&
      today.getMonth() === messageDate.getMonth() &&
      today.getDate() === messageDate.getDate()
    ) {
      return "Today";
    }
    const messageDateDay = messageDate.getDate();
    const messageDateMonth = messageDate.toLocaleString("default", {
      month: "long",
    });
    return messageDateDay + " " + messageDateMonth;
  };
  const getChatBodyContent = () => {
    let prevDay = new Date(message.date).getDay();
    const content = messages.map((message) => {
      if (prevDay !== new Date(message.date).getDay()) {
        prevDay = new Date(message.date).getDay();

        return (
          <>
            <div className="date-container">
              <div className="date-line"></div>
              <span className="date">{getDateToDisplay(message.date)}</span>
              <div className="date-line"></div>
            </div>
            <div
              className={`message-wrapper ${
                message.sender_id == user.id
                  ? "message-sent"
                  : "message-recieved"
              }`}
            >
              <div className="message">
                <div className="message-content">{message.text}</div>
                <span className="message-time">
                  {message?.date.split("T")[1].slice(0, 5)}
                </span>
              </div>
            </div>
          </>
        );
      } else if (prevDay === new Date(message.date).getDay()) {
        prevDay = new Date(message.date).getDay();

        return (
          <>
            <div
              className={`message-wrapper ${
                message.sender_id == user.id
                  ? "message-sent"
                  : "message-recieved"
              }`}
            >
              <div className="message">
                <div className="message-content">{message.text}</div>
                <span className="message-time">
                  {message?.date.split("T")[1].slice(0, 5)}
                </span>
              </div>
            </div>
          </>
        );
      }
    });
    return content;
  };

  return (
    <>
      {chatsModalOpen && (
        <ChatsModal
          modalHandlier={setChatsModalOpen}
          setChat={setActiveChat}
          userChats={userChats}
          activeChatId={activeChat?.id}
        />
      )}
      <div className="chat-container">
        {activeChat != null ? (
          <>
            <div className="header">
              <div className="user-info-wrapper">
                <img
                  src={
                    activeChat.members[0].avatar_name != null
                      ? `https://projects-server-api.onrender.com/images/${activeChat.members[0].avatar_name}`
                      : "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg"
                  }
                  alt=""
                />
                <div>
                  <p className="user-name">
                    {activeChat ? activeChat.members[0].username : "Dummy user"}
                  </p>
                  <p className="user-role">
                    {activeChat ? "Full Stack Developer" : "Dummy Vacansy"}
                  </p>
                </div>
              </div>
              <div className="settings-wrapper">
                <FaEllipsisV
                  className="icon"
                  onClick={() => {
                    setIsDropdownOpen(!isDropdownOpen);
                  }}
                />

                {isDropdownOpen && (
                  <div className="settings-dropdown">
                    <div
                      className="settings-item"
                      onClick={() => {
                        setChatsModalOpen(true);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <span>💬</span>
                      <span>Chats</span>
                    </div>
                    <div className="settings-item">
                      <span>🗑️</span>
                      <span>Clear Chat</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="body">
              {getChatBodyContent()}

              <div ref={dummyMessageLastRef}></div>
            </div>
            <div className="footer">
              <input
                type="text"
                placeholder="Write message..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              />
              <button type="button" className="btn" onClick={handleSendMessage}>
                <FaPaperPlane className="icon-send" /> <span>Send</span>
              </button>
            </div>
          </>
        ) : (
          <div className="empty-chat">
            <div
              className="text-wrapper"
              onClick={() => {
                setChatsModalOpen(true);
              }}
            >
              Select a chat to start messaging
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatPage;
