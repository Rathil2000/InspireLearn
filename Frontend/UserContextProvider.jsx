// import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { UserProvider } from './UserContext';

const UserContextProvider = ({ children }) => {
  return (
    <UserProvider>
      {children}
    </UserProvider>
  );
};

// Prop validation for children
UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired, // Validate that children is a React node and required
};

// PropTypes validation for children
UserProvider.propTypes = {
  children: PropTypes.node.isRequired, // children prop must be passed and can be any renderable node
};

export default UserContextProvider;
