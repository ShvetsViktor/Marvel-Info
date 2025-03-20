class MarvelService {
    getResource = async (url) => {

        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, response status: ${res.status}`)
        }

        return await res.json();
    }

    getAllCharacters = () => {
        return this.getResource();
    }



https://gateway.marvel.com:443/v1/public/characters?apikey=c5d6fc8b83116d92ed468ce36bac6c62


}