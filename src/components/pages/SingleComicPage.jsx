import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './singleComicPage.scss';

const SingleComicPage = () => {
    const { comicId } = useParams();
    const navigate = useNavigate();

    const [comic, setComic] = useState(null);

    const { loading, error, getAComic, clearError } = useMarvelService();

    useEffect(() => {
        updateComic();
    }, [comicId])

    const updateComic = () => {

        clearError();
        getAComic(comicId)
            .then(onComicLoaded)
            .catch(() => navigate('/404'));
    }

    const onComicLoaded = (comic) => {
        setComic(comic);
    }

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error || !comic) ? <View comic={comic} /> : null;

    return (
        <div className="single-comic">
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
}

const View = ({ comic }) => {
    const { title, description, thumbnail, price, pages, languages } = comic;
    return (
        <>
            <img src={thumbnail} alt={title} className="single-comic__img" />
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">Total amount of pages: {pages}</p>
                <p className="single-comic__descr">Language: {languages}</p>
                <div className="single-comic__price">{price}</div>
            </div>
            <Link to="/comics" className="single-comic__back">Back to all</Link>
        </>
    )
}


export default SingleComicPage;




// import { useParams } from 'react-router-dom';

// import SingleComic from '../singleComic/SingleComic';
// import AppBanner from '../appBanner/AppBanner';
// import ErrorBoundary from "../errorBoundary/ErrorBoundary";


// const SingleComicPage = () => {

//     const { comicId } = useParams();

//     return (
//         <>
//             <AppBanner />
//             <ErrorBoundary>
//                 <SingleComic comicId={comicId} />
//             </ErrorBoundary>
//         </>
//     )
// }

// export default SingleComicPage;