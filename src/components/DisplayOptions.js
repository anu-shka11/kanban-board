import React from 'react';

const DisplayOptions = ({ handleDisplayChange }) => {
  return (
    <div className="display-options">
      <button onClick={() => handleDisplayChange('name')}>By Name</button>
      <button onClick={() => handleDisplayChange('priority')}>By Priority</button>
      <button onClick={() => handleDisplayChange('status')}>By Status</button>
    </div>
  );
};

export default DisplayOptions;