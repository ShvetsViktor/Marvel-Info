import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import banner from '../../resources/img/banner.png'
import './comicsList.scss';

const ComicsList = (props) => {
    const [comicsList, setComicsList] = useState([]);
    const newItemLoading = useRef(false);
    const [comicsEnded, setComicsEnded] = useState(false);
    const comicsEndedRef = useRef(false);
    const offsetRef = useRef(0);
    const itemRefs = useRef([]);

    const { loading, error, getAllComics } = useMarvelService();

    useEffect(() => {
        onRequest(offsetRef.current, true);

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [])

    const onRequest = (offset, initial) => {
        if (comicsEnded || newItemLoading.current) return;

        if (!initial) newItemLoading.current = true;

        getAllComics(offset)
            .then(onComicsListLoaded)
            .finally(() => {
                newItemLoading.current = false;
            });
    }

    const onComicsListLoaded = (newComicsList) => {
        setComicsList(prevComicsList => {
            const existingIds = new Set(prevComicsList.map(comics => comics.id));
            const filteredNewList = newComicsList.filter(comics => !existingIds.has(comics.id));

            const updatedList = [...prevComicsList, ...filteredNewList];
            offsetRef.current = updatedList.length;

            if (newComicsList.length < 6) {
                setComicsEnded(true);
                comicsEndedRef.current = true;
            }

            return updatedList;
        });
    }

    const focusOnItem = (i) => {
        itemRefs.current.forEach((item) => item.classList.remove('comics__item_selected'));
        itemRefs.current[i].classList.add('comics__item_selected');
        itemRefs.current[i].focus();
    }

    const handleScroll = () => {
        if (newItemLoading.current || comicsEndedRef.current) return;

        const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
        if (nearBottom) {
            onRequest(offsetRef.current, false);
        }
    }

    function renderItems(comicsList) {
        const items = comicsList.map((item, i) => {
            return (
                <li
                    className="comics__item"
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
                    key={item.id}
                    onClick={() => {
                        props.onComicsSelected(item.id);
                        focusOnItem(i);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            props.onComicsSelected(item.id);
                            focusOnItem(i);
                        }
                    }}>

                    <NavLink exact to="/comics/comic"><img src={item.thumbnail} alt={item.title} /></NavLink>
                    <div className="comics__name">{item.title}</div>
                    <div className="comics__price">{item.price}$</div>
                </li>
            )
        });

        return (
            <ul className='comics__grid'>
                {items}
            </ul>
        )
    }

    const items = renderItems(comicsList);
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;

    return (
        <div className='comics__list'>
            {errorMessage}
            {spinner}
            {items}
            <button
                disabled={newItemLoading.current}
                style={{ 'display': comicsEnded ? 'none' : 'block' }}
                className="button button__main button__long"
                onClick={() => { onRequest(offsetRef.current, false); }}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}



export default ComicsList;