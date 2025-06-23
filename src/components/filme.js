import React, { useState, useEffect } from 'react'; // Importe useState e useEffect

export default function Filme({ el }) {
    // Estado local para controlar se o filme está favoritado neste componente
    // Inicializamos com base na verificação do localStorage
    const [isFavorited, setIsFavorited] = useState(false);

    const displayTitle = el?.title && el.title.length > 19
        ? `${el.title.substring(0, 19)}...`
        : el?.title || 'Título Desconhecido';

    const imageUrl = el?.poster_path
        ? `https://image.tmdb.org/t/p/w500${el.poster_path}`
        : 'https://via.placeholder.com/500x750?text=Sem+Imagem';

    // useEffect para verificar o localStorage quando o componente é montado ou 'el.id' muda
    useEffect(() => {
        const favoritos = JSON.parse(localStorage.getItem('filmesFavoritos')) || [];
        const favoritedStatus = favoritos.some(filme => filme.id === el.id);
        setIsFavorited(favoritedStatus);
    }, [el.id]); // Re-executa se o ID do filme mudar

    // Função para adicionar/remover o filme dos favoritos
    const handleFavoriteClick = () => {
        let favoritos = JSON.parse(localStorage.getItem('filmesFavoritos')) || [];

        const isCurrentlyFavorited = favoritos.some(filme => filme.id === el.id);

        if (!isCurrentlyFavorited) {
            // Adiciona o filme
            const novoFavorito = {
                id: el.id,
                title: el.title,
                poster_path: el.poster_path
            };
            favoritos.push(novoFavorito);
            alert(`${el.title} foi adicionado aos seus favoritos!`);
            setIsFavorited(true); // Atualiza o estado para preencher o coração
        } else {
            // Remove o filme
            favoritos = favoritos.filter(filme => filme.id !== el.id);
            alert(`${el.title} foi removido dos seus favoritos!`);
            setIsFavorited(false); // Atualiza o estado para contornar o coração
        }

        localStorage.setItem('filmesFavoritos', JSON.stringify(favoritos));
    };

    return (
        <li key={el.id}>
            {displayTitle}
            <img src={imageUrl} alt={el?.title || 'Filme'} />
            <button
                className={`botao-coracao ${isFavorited ? 'preenchido' : 'contorno'}`}
                onClick={handleFavoriteClick}
            >
                {/* Renderiza o ícone com base no estado isFavorited */}
                {isFavorited ? '❤️' : '♡'} {/* Ou use Font Awesome: <i class="fas fa-heart"></i> : <i class="far fa-heart"></i> */}
            </button>
        </li>
    );
}