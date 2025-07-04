import { useParams } from 'react-router-dom';

import SingleComic from '../singleComic/SingleComic';
import AppBanner from '../appBanner/AppBanner';
import ErrorBoundary from "../errorBoundary/ErrorBoundary";


const SingleComicPage = (props) => {

    const { comicId } = useParams();

    return (
        <>
            <AppBanner />
            <ErrorBoundary>
                <SingleComic comicId={comicId} />
            </ErrorBoundary>
        </>
    )
}

export default SingleComicPage;