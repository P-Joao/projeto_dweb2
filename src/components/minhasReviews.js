import React, { useState, useEffect } from 'react';
import ReviewModal from './reviewModal';
import './minhasReviews.css'; 

export default function MinhasReviews() {
    const [allReviews, setAllReviews] = useState({}); // Objeto de reviews do localStorage
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentReviewData, setCurrentReviewData] = useState(null); // Armazena os dados do filme/review para edição

    // sortColumn: 'movieTitle', 'rating', 'timestamp' (para data)
    // sortDirection: 'asc' (ascendente) ou 'desc' (descendente)
    const [sortColumn, setSortColumn] = useState('timestamp'); // Padrão: ordenar por data
    const [sortDirection, setSortDirection] = useState('desc'); // Padrão: mais recente primeiro

    // Carrega as reviews do localStorage
    useEffect(() => {
        const storedReviews = JSON.parse(localStorage.getItem('filmesReviews')) || {};
        setAllReviews(storedReviews);

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleStorageChange = () => {
        const storedReviews = JSON.parse(localStorage.getItem('filmesReviews')) || {};
        setAllReviews(storedReviews);
    };

    const handleDeleteReview = (movieId, reviewTimestamp) => {
        if (window.confirm('Tem certeza que deseja excluir esta review?')) {
            const updatedReviews = { ...allReviews };
            if (updatedReviews[movieId]) {
                updatedReviews[movieId] = updatedReviews[movieId].filter(
                    review => review.timestamp !== reviewTimestamp
                );
                if (updatedReviews[movieId].length === 0) {
                    delete updatedReviews[movieId];
                }
                localStorage.setItem('filmesReviews', JSON.stringify(updatedReviews));
                setAllReviews(updatedReviews);
                alert('Review excluída com sucesso!');
            }
        }
    };

    const handleEditReview = (movieId, reviewToEdit) => {
        setCurrentReviewData({
            movieId: movieId,
            movieTitle: reviewToEdit.movieTitle,
            initialRating: reviewToEdit.rating,
            initialReviewText: reviewToEdit.reviewText,
            timestamp: reviewToEdit.timestamp
        });
        setIsModalOpen(true);
    };

    const handleSubmitReview = (reviewDataFromModal) => {
        const { movieId, movieTitle, rating, reviewText, timestamp } = reviewDataFromModal;
        const updatedReviews = { ...allReviews };

        if (currentReviewData && currentReviewData.timestamp) {
            updatedReviews[currentReviewData.movieId] = updatedReviews[currentReviewData.movieId].map(review =>
                review.timestamp === currentReviewData.timestamp
                    ? { movieId, movieTitle, rating, reviewText, timestamp }
                    : review
            );
        } else {
            if (!updatedReviews[movieId]) {
                updatedReviews[movieId] = [];
            }
            updatedReviews[movieId].push({ movieId, movieTitle, rating, reviewText, timestamp });
        }

        localStorage.setItem('filmesReviews', JSON.stringify(updatedReviews));
        setAllReviews(updatedReviews);
        alert('Review salva com sucesso!');
        setIsModalOpen(false);
        setCurrentReviewData(null);
    };

    // Converte o objeto de reviews em um array plano para mapear na tabela
    const reviewsToDisplay = Object.keys(allReviews).flatMap(movieId =>
        allReviews[movieId].map(review => ({
            ...review,
            movieId: movieId,
        }))
    );


    const sortedReviews = [...reviewsToDisplay].sort((a, b) => {
        let compareValue = 0;

        switch (sortColumn) {
            case 'movieTitle':
                compareValue = a.movieTitle.localeCompare(b.movieTitle);
                break;
            case 'rating':
                compareValue = a.rating - b.rating;
                break;
            case 'timestamp': // Ordena por data
                compareValue = new Date(a.timestamp) - new Date(b.timestamp);
                break;
            default:
                break;
        }

        return sortDirection === 'asc' ? compareValue : -compareValue;
    });

    // Função para lidar com o clique nos botões de ordenação
    const handleSort = (column) => {
        // Se a mesma coluna for clicada, inverte a direção
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // Se for uma nova coluna, define a coluna e a direção padrão (ascendente)
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    // Função auxiliar para exibir o ícone de direção de ordenação
    const getSortArrow = (column) => {
        if (sortColumn === column) {
            return sortDirection === 'asc' ? ' ▲' : ' ▼';
        }
        return '';
    };

    return (
        <>
            <div className="card">
                <h2>Minhas Reviews</h2>
                <p className='sub-title'>Gerencie suas avaliações e comentários de filmes.</p>
            </div>

            <div className="card">
                {sortedReviews.length > 0 ? (
                    <table className="reviews-table">
                        <thead>
                            <tr>
                                {/* Botões de ordenação nas colunas */}
                                <th onClick={() => handleSort('movieTitle')} className="sortable-header">
                                    Filme {getSortArrow('movieTitle')}
                                </th>
                                <th onClick={() => handleSort('rating')} className="sortable-header">
                                    Avaliação {getSortArrow('rating')}
                                </th>
                                <th>Review</th> {/* Não ordenável */}
                                <th onClick={() => handleSort('timestamp')} className="sortable-header">
                                    Data {getSortArrow('timestamp')}
                                </th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedReviews.map((review, index) => (
                                <tr key={`${review.movieId}-${review.timestamp || index}`}>
                                    <td data-label="Filme">{review.movieTitle}</td>
                                    <td data-label="Avaliação" className="star-rating-display">
                                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                    </td>
                                    <td data-label="Review">{review.reviewText || 'Nenhuma review escrita.'}</td>
                                    <td data-label="Data">{new Date(review.timestamp).toLocaleDateString('pt-BR')}</td>
                                    <td data-label="Ações">
                                        <button
                                            className="action-button edit"
                                            onClick={() => handleEditReview(review.movieId, review)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="action-button delete"
                                            onClick={() => handleDeleteReview(review.movieId, review.timestamp)}
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Você ainda não adicionou nenhuma review. Avalie seus filmes!</p>
                )}
            </div>

            <ReviewModal
                show={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setCurrentReviewData(null);
                }}
                onSubmit={handleSubmitReview}
                movieTitle={currentReviewData?.movieTitle || ''}
                movieId={currentReviewData?.movieId || ''}
                initialRating={currentReviewData?.initialRating || 0}
                initialReviewText={currentReviewData?.initialReviewText || ''}
            />
        </>
    );
}