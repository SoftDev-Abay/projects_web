import { React, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./ChatsModal.scss";
import { getAllUsers } from "../utility/getAllUsers";
import { useAuthContext } from "../context/AuthContext";

const ChatsModal = ({ modalHandlier, setChat, activeChatId, userChats }) => {
  const [search, setSearch] = useState("");
  const { user } = useAuthContext();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchUsers();
  }, []); // Empty dependency array means this effect runs once on mount

  const createChat = async (users) => {
    const responce = await fetch(
      "https://projects-server-api.onrender.com/chats",
      {
        method: "POST",
        body: JSON.stringify({ users: [...users, user.username] }),
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await responce.json();
    setChat(data);
    if (data) {
      modalHandlier(false);
    }
  };
  return (
    <div className="chats-modal">
      <div className="modal" onClick={() => modalHandlier(false)}>
        <div className="modal-sandbox"></div>
        <div className="modal-box">
          <div className="modal-body" onClick={(e) => e.stopPropagation()}>
            <header>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </header>
            <ul className="chats-list">
              {userChats
                .filter((chat) => chat.members[0].username.includes(search))
                .map((chat) => (
                  <li
                    onClick={() => {
                      setChat(chat);
                      modalHandlier(false);
                    }}
                    className={activeChatId === chat.id && `active-chat-item`}
                  >
                    <img
                      src={
                        chat.members[0].avatar_name != null
                          ? `https://projects-server-api.onrender.com/images/${chat.members[0].avatar_name}`
                          : "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg"
                      }
                      alt=""
                    />
                    <div className="chat-info">
                      <div className="user-name">
                        {chat.members[0].username}
                      </div>
                      <div className="message">Last message here...</div>
                    </div>
                  </li>
                ))}
            </ul>
            {true ? (
              <div className="global-search-indicator">People you may know</div>
            ) : null}
            <ul className="chats-list">
              {users
                .filter(
                  (userFilter) =>
                    userFilter.username !== user.username &&
                    !userChats.some(
                      (chat) => chat.members[0].username === userFilter.username
                    ) &&
                    userFilter.username.includes(search)
                )
                .map((userIterator) => (
                  <li
                    className=""
                    onClick={() => {
                      createChat([userIterator.username]);
                    }}
                  >
                    <img
                      src={
                        userIterator.avatar_name != null
                          ? `https://projects-server-api.onrender.com/images/${userIterator.avatar_name}`
                          : "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg"
                      }
                      alt=""
                    />
                    <div className="chat-info">
                      <div className="user-name">{userIterator.username}</div>
                      <div className="message"></div>
                    </div>
                  </li>
                ))}
            </ul>
            {search.length > 0 ? (
              <div className="global-search-indicator">
                Global search results
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatsModal;
