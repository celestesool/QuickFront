import React from 'react';
import './UserPanel.css';

interface Props {
  email: string;
}

const UserPanel: React.FC<Props> = ({ email }) => {
  return (
    <div className="user-panel">
      <span className="user-email">{email}</span>
    </div>
  );
};

export default UserPanel;
