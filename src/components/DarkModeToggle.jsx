// src/components/DarkModeToggle.js
import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  background: ${(props) => (props.darkMode ? 'black' : 'white')};
  color: ${(props) => (props.darkMode ? 'white' : 'black')};
  border: none;
  padding: 10px;
  cursor: pointer;
`;

const DarkModeToggle = ({ darkMode, toggleDarkMode }) => (
  <Button darkMode={darkMode} onClick={toggleDarkMode}>
    {darkMode ? 'Light Mode' : 'Dark Mode'}
  </Button>
);

export default DarkModeToggle;
