import React ,{ useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charList.scss';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [charEnded, setCharEnded] = useState(false);
    const newItemLoading = useRef(false);
    const charEndedRef = useRef(false);

    const {loading, error, getAllCharacters} = useMarvelService();
    
    useEffect(() => {
        onRequest(offsetRef.current, true);

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [])
    
    const onRequest = (offset, initial) => {
        if (charEnded || newItemLoading.current) return;

        if (!initial) newItemLoading.current = true;

        getAllCharacters(offset)
            .then(onCharListLoaded)
            .finally(() => {
                newItemLoading.current = false;
            });
    }

    const onCharListLoaded = (newCharList) => {
        setCharList(prevCharList => {
            const existingIds = new Set(prevCharList.map(char => char.id));
            const filteredNewList = newCharList.filter(char => !existingIds.has(char.id));
  
            const updatedList = [...prevCharList, ...filteredNewList];
            offsetRef.current = updatedList.length;

            if (newCharList.length < 6) {
                setCharEnded(true);
                charEndedRef.current = true;
            }

            return updatedList;
        });
    }
    
    const itemRefs = useRef([]);
   
    const focusOnItem = (i) => {
        itemRefs.current.forEach((item) => item.classList.remove('char__item_selected'));
        itemRefs.current[i].classList.add('char__item_selected');
        itemRefs.current[i].focus();
    }
    
    const offsetRef = useRef(0);

    const handleScroll = () => {
        if (newItemLoading.current || charEndedRef.current) return;

        const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
        if (nearBottom) {
            onRequest(offsetRef.current, false);
        }
    }

    function renderItems(arr) {
        const items = arr.map((item, i) => {
            return (
                <li 
                    className="char__item"
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
                    key={item.id}
                    onClick={() => {
                        props.onCharSelected(item.id);
                        focusOnItem(i);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            props.onCharSelected(item.id);
                            focusOnItem(i); 
                        }
                    }}>
                        <img src={item.thumbnail} alt={item.name}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        })

        return(
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    const items = renderItems(charList);
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading.current ? <Spinner/> : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading.current}
                style={{'display' : charEnded ? 'none' : 'block'}}
                onClick={() => {
                    onRequest(offsetRef.current, false);
                }}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;