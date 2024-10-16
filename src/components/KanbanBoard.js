import React, { useEffect, useState } from 'react';
import { fetchTasks } from '../utils/api';
import TaskCard from './TaskCard';
import './KanbanBoard.css';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [displayOption, setDisplayOption] = useState(localStorage.getItem('displayOption') || 'name');
  const [sortOption, setSortOption] = useState(localStorage.getItem('sortOption') || 'priority');

  useEffect(() => {
    const getTasksAndUsers = async () => {
      const taskData = await fetchTasks();
      setTasks(taskData.tickets);
      setFilteredTasks(taskData.tickets);
      setUsers(taskData.users);
    };
    getTasksAndUsers();
  }, []);

  useEffect(() => {
    localStorage.setItem('displayOption', displayOption);
    localStorage.setItem('sortOption', sortOption);
  }, [displayOption, sortOption]);

  const getUserNameById = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : 'Unknown';
  };

  const handleDisplayChange = (e) => {
    const option = e.target.value;
    setDisplayOption(option);
    let sortedTasks = [...tasks];

    switch (option) {
      case 'name':
        // No need to sort, we'll group by name
        break;

      case 'priority':
        // No need to sort here, we'll group by priority
        break;

      case 'status':
        sortedTasks = tasks.filter(
          (task) => task.status === 'Todo' || task.status === 'In progress' || task.status === 'Backlog'
        );
        break;

      default:
        break;
    }
    setFilteredTasks(sortedTasks);
  };

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);
    let sortedTasks = [...filteredTasks];

    if (option === 'priority') {
      sortedTasks.sort((a, b) => b.priority - a.priority); // Sort by priority descending
    } else if (option === 'title') {
      sortedTasks.sort((a, b) => a.title.localeCompare(b.title)); // Sort by title ascending
    }

    setFilteredTasks(sortedTasks);
  };

  // Group tasks by status
  const groupTasksByStatus = () => {
    const statuses = ['Todo', 'In progress', 'Backlog'];
    const grouped = statuses.reduce((acc, status) => {
      acc[status] = filteredTasks.filter((task) => task.status === status);
      return acc;
    }, {});
    return grouped;
  };

  // Group tasks by priority
  const groupTasksByPriority = () => {
    const priorities = [4, 3, 2, 1, 0]; // Priority levels from 4 to 0
    const grouped = priorities.reduce((acc, priority) => {
      acc[priority] = filteredTasks.filter((task) => task.priority === priority);
      return acc;
    }, {});
    return grouped;
  };

  // Group tasks by user
  const groupTasksByUser = () => {
    const grouped = users.reduce((acc, user) => {
      acc[user.name] = filteredTasks.filter((task) => task.userId === user.id);
      return acc;
    }, {});
    return grouped;
  };

  const groupedTasksByStatus = groupTasksByStatus();
  const groupedTasksByPriority = groupTasksByPriority();
  const groupedTasksByUser = groupTasksByUser();

  return (
    <div className="kanban-board">
      <div className="options">
        {/* Dropdown for display options */}
        <div className="dropdown">
          <label htmlFor="display">Display By: </label>
          <select id="display" value={displayOption} onChange={handleDisplayChange}>
            <option value="name">User Name</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
        </div>

        {/* Dropdown for sort options */}
        <div className="dropdown">
          <label htmlFor="sort">Sort By: </label>
          <select id="sort" value={sortOption} onChange={handleSortChange}>
            <option value="priority">Priority (Descending)</option>
            <option value="title">Title (Ascending)</option>
          </select>
        </div>
      </div>

      {/* Task columns based on display option */}
      <div className="board-columns">
        {displayOption === 'status' ? (
          // Display by status in separate columns
          Object.keys(groupedTasksByStatus).map((status) => (
            <div key={status} className="board-column">
              <h2>{status}</h2>
              {groupedTasksByStatus[status].map((task) => (
                <TaskCard
                  key={task.id}
                  task={{
                    ...task,
                    user: getUserNameById(task.userId),
                  }}
                />
              ))}
            </div>
          ))
        ) : displayOption === 'priority' ? (
          // Display by priority in separate columns
          Object.keys(groupedTasksByPriority).map((priority) => (
            <div key={priority} className="board-column">
              <h2>Priority {priority}</h2>
              {groupedTasksByPriority[priority].map((task) => (
                <TaskCard
                  key={task.id}
                  task={{
                    ...task,
                    user: getUserNameById(task.userId),
                  }}
                />
              ))}
            </div>
          ))
        ) : (
          // Display by name in separate columns
          Object.keys(groupedTasksByUser).map((userName) => (
            <div key={userName} className="board-column">
              <h2>{userName}</h2>
              {groupedTasksByUser[userName].map((task) => (
                <TaskCard
                  key={task.id}
                  task={{
                    ...task,
                    user: userName, // Directly use the userName as it's already grouped by user
                  }}
                />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanBoard;