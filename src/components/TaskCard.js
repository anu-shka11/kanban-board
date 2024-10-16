import React from 'react';
import './TaskCard.css';

const TaskCard = ({ task }) => {
  return (
    <div className="task-card">
      <h3>{task.title}</h3>
      <p>User: {task.user}</p>
      <p>Status: {task.status}</p>
      <p>Priority: {task.priority}</p>
    </div>
  );
};

export default TaskCard;