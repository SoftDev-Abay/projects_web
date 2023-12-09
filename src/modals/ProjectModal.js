import React from "react";
import "./ProjectModal.scss";

const ProjectModal = ({ isOpen, modalHandlier }) => {
  const { id, title, description, status, type, owner, members, date } = isOpen;
  return (
    <>
      {isOpen && (
        <div className="project-modal">
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
                <h1>{title}</h1>
              </div>
              <div className="modal-body">
                <div className="modal-body-header">
                  <div className="tags">
                    <span>
                      <strong>{status}</strong>
                    </span>
                    <span>
                      <strong>{type}</strong>
                    </span>
                  </div>
                  <span className="project-modal-date">{date}</span>
                </div>
                <p>{description}</p>
                <p>
                  <strong>Owner:</strong> {owner.username}
                </p>
                <div className="members">
                  {members.map((member, index) => {
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
                <button
                  className="modal-button close-modal"
                  onClick={() => {
                    modalHandlier(false);
                  }}
                >
                  Close!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectModal;
