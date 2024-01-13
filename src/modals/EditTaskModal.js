import { React, useRef, useState, useEffect, useCallback } from "react";
import "./CreateTaskModal.scss";
import {
  FaGgCircle,
  FaCircle,
  FaCircleNotch,
  FaEllipsisH,
  FaFlag,
  FaComment,
  FaPaperclip,
  FaPlusCircle,
  FaCheckCircle,
} from "react-icons/fa";
import axios from "axios";
import { FiCheckCircle, FiCircle } from "react-icons/fi";
import { ImageConfig } from "../config/ImageConfig";
import { getAllUsers } from "../utility/getAllUsers";
import { useAuthContext } from "../context/AuthContext";
import AttachmentsAddSpace from "../components/AttachmentsAddSpace";

const EditTaskModal = ({ isOpen, modalHandlier }) => {
  const [subtasks, setSubtasks] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [previousFileList, setPreviousFileList] = useState([]); //
  const [initialFileList, setInitialFileList] = useState([]); // [
  const [projectName, setProjectName] = useState("");
  const [userProjects, setUserProjects] = useState(null);

  const { user } = useAuthContext();
  const [members, setMembers] = useState([user.username]);

  const selectMember = useRef(null);
  const taskTitle = useRef(null);
  const taskDescription = useRef(null);
  const subtaskInput = useRef(null);

  useEffect(() => {
    getUserProjects();
  }, []); // Empty dependency array means this effect runs once on mount

  const getUserProjects = async () => {
    try {
      const response = await fetch(
        `https://projects-server-api.onrender.com/user_projects/${user.id}`
      );
      const data = await response.json();
      setUserProjects(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getTaskInfo = useCallback(async () => {
    try {
      const res = await fetch(
        `https://projects-server-api.onrender.com/task/${isOpen.id}`
      );
      const data = await res.json();
      console.log(data);

      setProjectName(data.project_name);
      setMembers(data.members.map((member) => member.username));
      setSubtasks(data.subtasks);

      setInitialFileList(data.attachments);
      setPreviousFileList(data.attachments);
      taskTitle.current.value = data.name;
      taskDescription.current.value = data.description;
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    getTaskInfo();
  }, [isOpen]);

  const fileRemove = (file) => {
    const updatedFileList = [...fileList];
    updatedFileList.splice(fileList.indexOf(file), 1);
    setFileList(updatedFileList);
    // console.log(file,fileList,"file removeed list");
  };

  const onTaskStatusChange = (status, index) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].completed = status;
    setSubtasks(updatedSubtasks);
  };

  const onTaskUpdate = async () => {
    try {
      const formData = new FormData();

      formData.append("name", taskTitle.current.value);
      formData.append("description", taskDescription.current.value);
      formData.append("projectName", projectName);
      formData.append("date_created", new Date().toISOString());
      members.forEach((username, index) => {
        formData.append(`members[${index}]`, username);
      });
      formData.append("subtasks", JSON.stringify(subtasks));

      fileList.forEach((file) => {
        formData.append("files", file);
      });

      const deletedFiles = initialFileList.filter(
        (file) => !previousFileList.includes(file)
      );

      formData.append("deletedFiles", JSON.stringify(deletedFiles));

      const responce = await axios.put(
        `https://projects-server-api.onrender.com/task/${isOpen.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(responce);

      if (responce.status === 200) {
        alert("Task updated successfully");
        modalHandlier(false);
      }
    } catch (error) {
      alert("Task update failed");
      console.error(error);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="create-task-modal-container">
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
                <input
                  className="title-input"
                  type="text"
                  placeholder="Title"
                  ref={taskTitle}
                />
              </div>
              <div className="modal-body">
                <div className="modal-body-header">
                  <div className="tags">
                    <span>
                      <strong>ready</strong>
                    </span>
                    <span>
                      <select
                        className="project-select"
                        name=""
                        id=""
                        value={projectName}
                        onChange={(e) =>
                          setProjectName(
                            e.target.options[e.target.selectedIndex].text
                          )
                        }
                      >
                        {userProjects ? (
                          userProjects?.map((project) => (
                            <option value={project.name}>{project.name}</option>
                          ))
                        ) : (
                          <option value="">Choose a project</option>
                        )}
                      </select>
                    </span>
                  </div>
                  <span className="project-modal-date">
                    {new Date().toISOString().split("T")[0]}
                  </span>
                </div>
                <textarea
                  className="description-textarea"
                  name=""
                  id=""
                  rows="10"
                  placeholder="Description"
                  ref={taskDescription}
                ></textarea>
                <div className="members-container">
                  <div className="members-header">
                    <h3>Members </h3>
                    <select
                      className="add-member-select"
                      name=""
                      ref={selectMember}
                      onChange={(e) => {
                        const selectedMember = e.target.value;
                        if (
                          selectedMember !== "" &&
                          !members.includes(selectedMember)
                        ) {
                          const updatedMembers = [...members, selectedMember];
                          setMembers(updatedMembers);
                        }
                      }}
                    >
                      {userProjects &&
                        (!projectName
                          ? userProjects[0]?.members?.map((user) => {
                              return (
                                <option value={user.username}>
                                  {user.username}
                                </option>
                              );
                            })
                          : userProjects
                              .filter(
                                (projectFilter) =>
                                  projectFilter.name == projectName
                              )[0]
                              .members?.map((user) => {
                                return (
                                  <option value={user.username}>
                                    {user.username}
                                  </option>
                                );
                              }))}
                    </select>
                  </div>
                  <div className="members">
                    {members?.map((member, index) => {
                      let random_id = Math.floor(Math.random() * 100);
                      return (
                        <img
                          src={`https://randomuser.me/api/portraits/men/${random_id}.jpg`}
                          alt={member}
                          onClick={() => {
                            if (index == 0) return;
                            const updatedMembers = members.filter(
                              (memberFilter, indexFilter) =>
                                indexFilter != index
                            );
                            setMembers(updatedMembers);
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                <br />
                <div className="subtasks-container">
                  <h3>Subtasks</h3>
                  <div className="subtasks-list">
                    <li className="subtask-item">
                      <FiCircle className="icon" />
                      <input
                        type="text"
                        ref={subtaskInput}
                        onBlur={() => {
                          const newSubtask = {
                            text: subtaskInput.current.value.trimStart(),
                            completed: false,
                          };
                          if (newSubtask.text.length > 0) {
                            const updatedSubtasks = [...subtasks, newSubtask];
                            setSubtasks(updatedSubtasks);
                          }
                          subtaskInput.current.value = "";
                        }}
                      />
                    </li>
                    {subtasks?.map((subtask, index) => {
                      return (
                        <div className="subtask-item">
                          {!subtask.completed ? (
                            <FiCircle
                              className="icon"
                              onClick={() =>
                                onTaskStatusChange(!subtask.completed, index)
                              }
                            />
                          ) : (
                            <FaCheckCircle
                              className="icon"
                              onClick={() =>
                                onTaskStatusChange(!subtask.completed, index)
                              }
                              // style={{ color: "#2ecc71" }}
                            />
                          )}
                          <input
                            type="text"
                            value={subtask.text}
                            onChange={(e) => {
                              const updatedSubtasks = [...subtasks];
                              updatedSubtasks[index].text = e.target.value;
                              setSubtasks(updatedSubtasks);
                            }}
                          />
                          <span
                            className="subtask-del"
                            onClick={() => {
                              const updatedSubtasks = subtasks.filter(
                                (filterSubtask, filterIndex) =>
                                  filterIndex != index
                              );
                              setSubtasks(updatedSubtasks);
                            }}
                          >
                            &#10006;
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="task-modal-attachments">
                  <h3>Attachments</h3>
                  <div className="attachments-list">
                    {/* previous attachments */}
                    {previousFileList?.map((item, index) => {
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
                          <span
                            className="attachment-item-del"
                            onClick={() => {
                              const updatedPreviousFileList =
                                previousFileList.filter(
                                  (filterItem, filterIndex) =>
                                    filterIndex != index
                                );
                              setPreviousFileList(updatedPreviousFileList);
                            }}
                          >
                            &#10006;
                          </span>
                        </div>
                      );
                    })}

                    {/* new attachments */}

                    {fileList?.map((item, index) => {
                      return (
                        <div className="attachment-item" key={index}>
                          <img
                            src={
                              ImageConfig[item.type.split("/")[1]] ||
                              ImageConfig["default"]
                            }
                            alt=""
                          />
                          <div className="attachment-item-info">
                            <p>{item.name}</p>
                            <p>{item.size}B</p>
                          </div>
                          <span
                            className="attachment-item-del"
                            onClick={() => fileRemove(item)}
                          >
                            &#10006;
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {/* attacheent space here */}
                  <AttachmentsAddSpace
                    fileList={fileList}
                    setFileList={setFileList}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    className="modal-button"
                    onClick={() => {
                      modalHandlier(false);
                    }}
                  >
                    Close
                  </button>
                  <button
                    className="modal-button"
                    onClick={() => {
                      onTaskUpdate();
                      // modalHandlier(false);
                    }}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditTaskModal;
