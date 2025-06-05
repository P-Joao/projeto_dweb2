import { userParams } from 'react-router-dom';
import Filme from './filme';
import NotFound from './notFound';

const buscaFilmes = ({ filmes }) => {
    const {filmeSlug} = userParams();
    const filme = filmes.find((filme) => filme.slug === filmeSlug);

    return filme ? <Filme filme={filme} />  : <NotFound />;
}
export default buscaFilmes;