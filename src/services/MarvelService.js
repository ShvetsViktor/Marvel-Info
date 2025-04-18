import {useHttp} from '../hooks/http.hook';


const useMarvelService = () => {
    const {loading, request, error, clearError} = useHttp();

    const _apiBase = 'https://marvel-server-zeta.vercel.app/';
    const _apiKey = 'apikey=d4eecb0c66dedbfae4eab45d312fc1df';
    const _baseOffset = 0; 

    let apiRequestCount = 0;

    const getAllCharacters = async (offset = _baseOffset) => {
        apiRequestCount++;
        console.log(`🔁 API Request #${apiRequestCount}: getAllCharacters (offset: ${offset})`);
    
        const res = await request(`${_apiBase}characters?limit=6&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        apiRequestCount++;
        console.log(`🔁 API Request #${apiRequestCount}: getCharacter (id: ${id})`);

        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    return {loading, error, clearError, getAllCharacters, getCharacter};
}


export default useMarvelService;