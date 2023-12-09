import { React, useCallback, useRef, useState } from "react";
import "./TaskModal.scss";
import {
  FaGgCircle,
  FaCircle,
  FaCircleNotch,
  FaEllipsisH,
  FaFlag,
  FaComment,
  FaPaperclip,
  FaCheckCircle,
} from "react-icons/fa";
import Comments from "../components/Comments";

import { FiCircle } from "react-icons/fi";
import { ImageConfig } from "../config/ImageConfig";
import { useEffect } from "react";

const TaskModal = ({ isOpen, modalHandlier, handleDeleteTask }) => {
  const [task, setTask] = useState(null);

  const getTaskInfo = useCallback(async () => {
    try {
      const res = await fetch(
        `https://projects-server-api.onrender.com/task/${isOpen}`
      );
      const data = await res.json();
      setTask(data);
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    getTaskInfo();
  }, [isOpen]);

  if (!task) {
    return null;
  }

  const {
    id,
    name,
    project_name,
    description,
    status,
    members,
    date_created,
    attachments,
  } = task;

  return (
    <>
      {isOpen && (
        <div className="task-modal">
          <div className="modal">
            <div className="modal-sandbox"></div>
            <div className="modal-box">
              <div className="modal-header">
                <div
                  className="close-modal"
                  onClick={() => {
                    modalHandlier(false);
                  }}
                >
                  &#10006;
                </div>
                <h1>{name}</h1>
              </div>
              <div className="modal-body">
                <div className="modal-body-header">
                  <div className="tags">
                    <span>
                      <strong>{status}</strong>
                    </span>
                    <span>
                      <strong>{project_name}</strong>
                    </span>
                  </div>
                  <span className="project-modal-date">
                    {date_created.split("T")[0]}
                  </span>
                </div>
                <p>{description}</p>
                <div className="members">
                  {members?.map((member, index) => {
                    let random_id = Math.floor(Math.random() * 100);
                    return (
                      <img
                        src={
                          member.avatar_name != null
                            ? `https://projects-server-api.onrender.com/images/${member.avatar_name}`
                            : "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg"
                        }
                        alt={member}
                      />
                    );
                  })}
                </div>

                <br />
                <div className="subtasks-container">
                  <h3>Subtasks</h3>
                  <div className="subtasks-list">
                    {task?.subtasks?.map((subtask) => {
                      return (
                        <div className="subtask-item">
                          {!subtask.completed ? (
                            <FiCircle className="icon" />
                          ) : (
                            <FaCheckCircle
                              className="icon"
                              // style={{ color: "#2ecc71" }}
                            />
                          )}
                          <input type="text" value={subtask.text} />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {attachments.length > 0 && (
                  <div className="task-modal-attachments">
                    <h3>Attachments</h3>
                    <div className="attachments-list">
                      {attachments?.map((item, index) => {
                        return (
                          <div className="attachment-item" key={index}>
                            <img
                              src={
                                ImageConfig[item.file_name.split(".")[1]] ||
                                ImageConfig["default"]
                              }
                              alt=""
                            />
                            <div className="attachment-item-info">
                              <p>
                                {item.file_name.split(
                                  0,
                                  -(item.file_name.split(".")[1].length + 33)
                                )}
                              </p>
                              <p>20B</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {/* <Comments /> */}
                <button
                  className="modal-button close-modal"
                  onClick={() => {
                    modalHandlier(false);
                  }}
                >
                  Close!
                </button>
                <button
                  className="modal-button close-modal"
                  style={{ marginLeft: "20px" }}
                  onClick={() => {
                    handleDeleteTask(isOpen);
                    modalHandlier(false);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskModal;
