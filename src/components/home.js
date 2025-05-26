import React from 'react'

export default function Home() {
    return (
        <>
            <div class="card">
                <h2>Bem-vindo ao Watch List!</h2>
                <p className='sub-title'>Adicione seus filmes e séries favoritos, acompanhe o que você já assistiu e descubra novos títulos para ver.</p>
            </div>

            <div class="card">
                <h2>Destaques da Semana</h2>
                <ul>
                    <li>
                        The Batman
                        <img src='https://m.media-amazon.com/images/M/MV5BMmU5NGJlMzAtMGNmOC00YjJjLTgyMzUtNjAyYmE4Njg5YWMyXkEyXkFqcGc@._V1_SX300.jpg'/>
                    </li>
                    <li>
                        Stranger Things
                        <img src='https://m.media-amazon.com/images/M/MV5BMjg2NmM0MTEtYWY2Yy00NmFlLTllNTMtMjVkZjEwMGVlNzdjXkEyXkFqcGc@._V1_SX300.jpg'/>
                    </li>
                    <li>
                        Duna
                        <img src='https://m.media-amazon.com/images/M/MV5BMGJlMGM3NDAtOWNhMy00MWExLWI2MzEtMDQ0ZDIzZDY5ZmQ2XkEyXkFqcGc@._V1_SX300.jpg'/>
                    </li>
                    <li>
                        Breaking Bad
                        <img src='https://m.media-amazon.com/images/M/MV5BMzU5ZGYzNmQtMTdhYy00OGRiLTg0NmQtYjVjNzliZTg1ZGE4XkEyXkFqcGc@._V1_SX300.jpg'/>
                    </li>
                </ul>
            </div>
        </>
    )
}
