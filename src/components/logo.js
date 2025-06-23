import React from 'react'
import { Link } from 'react-router-dom';
import { ReactComponent as YourSvg } from './watch_list_logo.svg';

export default function Logo() {
  return (
    <Link to="/">
      <h1 className='logo' style={{display:"flex", alignItems:"center"}}>
        <YourSvg style={{maxHeight:"80px"}}/>
        <span>Watch List</span>
      </h1>
    </Link>
  );
};
