import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Direct Mapped</Link></li>
        <li><Link to="/fully-associative">Fully Associative</Link></li>
        <li><Link to="/set-associative">Set Associative</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
