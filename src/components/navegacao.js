import React from 'react'
import { Link } from 'react-router-dom';

export default function Navegacao() {
  return (
    <ul className='navegacao'>
        <li><Link to="/minha-lista">Minha Lista</Link></li>
        <li><Link to="/encontrar-filmes">Encontrar Filmes</Link></li>
        <li><Link to="/minhas-reviews">Reviews</Link></li>
        <li><Link to="/amigos">Amigos</Link></li>
    </ul>
  )
}
