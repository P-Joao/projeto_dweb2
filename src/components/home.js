import React from 'react';
import Filme from './filme';
import Pagination from './pagination';

export default function Home({ filmes, currentPage, totalPages, onPageChange }) {
    return (
        <>
            <div className="card">
                <h2>Bem-vindo ao Watch List!</h2>
                <p className='sub-title'>Adicione seus filmes e séries favoritos, acompanhe o que você já assistiu e descubra novos títulos para ver.</p>
            </div>

            <div className="card">
                <h2>Destaques da Semana</h2>
                <ul>
                    {filmes?.map(el => (
                        <Filme key={el.id} el={el} />
                    ))}
                </ul>

                {totalPages > 1 && ( // Renderiza a paginação apenas se houver mais de 1 página
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                )}
            </div>
        </>
    );
}