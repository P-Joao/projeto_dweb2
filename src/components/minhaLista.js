// components/MinhaLista.js (Exemplo de Paginação Manual)
import React, { useState, useEffect } from 'react';
import Filme from './filme';
import Pagination from './pagination'; // Importe o componente de paginação

const ITEMS_PER_PAGE = 10; // Defina quantos filmes por página você quer

export default function MinhaLista() {
    const [filmesFavoritos, setFilmesFavoritos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const carregarFavoritos = () => {
            const favoritosSalvos = JSON.parse(localStorage.getItem('filmesFavoritos')) || [];
            setFilmesFavoritos(favoritosSalvos);
            // Calcula o total de páginas
            setTotalPages(Math.ceil(favoritosSalvos.length / ITEMS_PER_PAGE));
            // Garante que a página atual não exceda o total de páginas se a lista diminuir
            if (currentPage > Math.ceil(favoritosSalvos.length / ITEMS_PER_PAGE)) {
                setCurrentPage(1); // Volta para a primeira página se necessário
            }
        };

        carregarFavoritos();
        window.addEventListener('storage', carregarFavoritos);
        return () => {
            window.removeEventListener('storage', carregarFavoritos);
        };
    }, [currentPage]); // Adicione currentPage como dependência para recarregar se mudar

    // Calcula os filmes a serem exibidos na página atual
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const filmesParaExibir = filmesFavoritos.slice(startIndex, endIndex);

    return (
        <>
            <div className="card">
                <h2>Minha Lista</h2>
                <p className='sub-title'>Aqui estão os filmes que você favoritou.</p>
            </div>

            <div className="card">
                {filmesFavoritos.length > 0 ? (
                    <>
                        <ul>
                            {filmesParaExibir.map(filme => (
                                <Filme key={filme.id} el={filme} />
                            ))}
                        </ul>
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </>
                ) : (
                    <p>Você ainda não favoritou nenhum filme. Adicione alguns!</p>
                )}
            </div>
        </>
    );
}