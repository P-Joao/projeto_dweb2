import React from 'react';
import './notFound.css';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <>
            <div className="card not-found-card">
                <h2>404 - Página Não Encontrada</h2>
                <p className="sub-title">A página que você está procurando não existe.</p>
                <p>Por favor, verifique o endereço ou use o menu de navegação.</p>
                <Link to="/">Voltar para a Home</Link>
            </div>
        </>
    );
}