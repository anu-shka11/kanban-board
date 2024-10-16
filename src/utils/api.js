export const fetchTasks = async () => {
    const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
    const data = await response.json();
    return data; // Assuming tasks are inside the 'tasks' key of response
  };