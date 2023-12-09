import React from "react";
import TaskCard from "./TaskCard";
import { FaEllipsisH } from "react-icons/fa";
import { Droppable } from "react-beautiful-dnd";

const TasksColumn = ({ status, tasks, id, modalHandlier }) => {
  return (
    <div className="tasks-ready-container">
      <div className="tasks-subtitle">
        <p>{status}</p>
        <FaEllipsisH className="icon" />
      </div>
      <Droppable droppableId={id}>
        {(provided, snapshot) => {
          return (
            <div
              className="tasks-cards-wrapper tasks-ready-wrapper"
              ref={provided.innerRef}
              // onDragEnd={snapshot.isDraggingOver}
              {...provided.droppableProps}
            >
              {tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.name}
                  // description={task.description}
                  // status={task.status}
                  // members={task.members}
                  date={task.date_created}
                  project={task.project_name}
                  attachments_count={task.attachments_count}
                  subtasksCount={task.subtasks_count}
                  modalHandlier={modalHandlier}
                  index={index}
                />
              ))}

              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
};

export default TasksColumn;
