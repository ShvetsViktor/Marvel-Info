import { useState } from "react";

import ComicsList from '../comicsList/ComicsList';
import AppBanner from '../appBanner/AppBanner';
import ErrorBoundary from "../errorBoundary/ErrorBoundary";

const ComicsPage = () => {

    const [selectedComics, setComics] = useState(null);

    const onComicsSelected = (id) => {
        setComics(id);
    }

    return (
        <>
            <AppBanner />
            <ErrorBoundary>
                <ComicsList onComicsSelected={onComicsSelected} />
            </ErrorBoundary>
        </>
    )
}

export default ComicsPage;