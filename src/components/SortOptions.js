import React from 'react';

const SortOptions = ({ handleSort }) => {
  return (
    <div className="sort-options">
      <button onClick={() => handleSort('priority')}>Sort by Priority (Desc)</button>
      <button onClick={() => handleSort('title')}>Sort by Title (Asc)</button>
    </div>
  );
};

export default SortOptions;