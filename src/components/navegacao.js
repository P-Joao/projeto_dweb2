import React from 'react'
import { Link } from 'react-router-dom';

export default function Navegacao() {
  return (
    <ul className='navegacao'>
        <li><Link to="/minha-lista">Minha Lista</Link></li>
        <li><Link to="/encontrar-filmes">Encontrar Filmes</Link></li>
        <li><a href="#">Reviews</a></li>
        <li><a href="#">Amigos</a></li>
    </ul>
  )
}
