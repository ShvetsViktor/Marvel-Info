import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import Skeleton from '../skeleton/Skeleton';

import './comicInfo.scss';
import banner from '../../resources/img/banner.png'

const ComicInfo = (props) => {

    const [comic, setComic] = useState(null);


    const { loading, error, getAComic, clearError } = useMarvelService();
    // console.log(comics.id) //  не хватает сервиса

    useEffect(() => {
        updateComic();
    }, [props.comicId])

    const updateComic = () => {
        const { comicId } = props;
        if (!comicId) {
            return;
        }

        clearError();
        getAComic(comicId)
            .then(onComicLoaded)
    }

    const onComicLoaded = (comic) => {
        setComic(comic);
    }

    const skeleton = comic || loading || error ? null : <Skeleton />;
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error || !comic) ? <View comic={comic} /> : null;

    return (
        <div className="single-comic">
            {skeleton}
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
                <div className="single-comic__price">{price}$</div>
            </div>
            <NavLink exact to="/comics"><a href="#" className="single-comic__back">Back to all</a></NavLink>
        </>
    )
}


export default ComicInfo;