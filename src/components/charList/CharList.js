import React ,{ Component } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charList.scss';

class CharList extends Component {

    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 0,
        charEnded: false
    }

    
    marvelService = new MarvelService();
    
    componentDidMount() {
        this.onRequest();
        window.addEventListener('scroll', this.handleScroll);
    }
    
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }
    
    handleScroll = () => {
        if (document.documentElement.scrollTop + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            this.onRequest(this.state.offset);
        }
    }
    
    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
        .then(this.onCharListLoaded)
        .catch(this.onError)
    }
    
    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }
    
    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }
        
        this.setState(({ offset, charList }) => {
            // Убираем дубли по ID
            const existingIds = new Set(charList.map(char => char.id));
            const filteredNewList = newCharList.filter(char => !existingIds.has(char.id));
            // 🔍 Разбор: 
            // charList.map(char => char.id) — создает массив всех ID уже загруженных персонажей.
            // new Set(...) — превращает этот массив в множество, где все значения уникальны.
            // existingIds — это теперь множество (Set) всех ID, которые уже есть в charList.
            // newCharList.filter(...) — фильтрует список новых персонажей, полученных из API.
            // !existingIds.has(char.id) — пропускает только тех, чьи ID еще не встречались в уже загруженном списке.
            
            return {
                charList: [...charList, ...filteredNewList],
                loading: false,
                newItemLoading: false,
                offset: offset + 9,
                charEnded: ended
            };
        });
    }
    
    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }
    
    myRef = React.createRef();
    
    refItems = [];

    setRef = (ref) => {
        this.refItems.push(ref);
    }

    focusOnItem = (i) => {
        this.refItems.forEach((item) => item.classList.remove('char__item_selected'));
        this.refItems[i].classList.add('char__item_selected');
        this.refItems[i].focus();
    }

    renderItems = (arr) => {
        const items = arr.map((item, i) => {
            return (
                <li 
                    className="char__item"
                    tabIndex={0}
                    ref={this.setRef}
                    key={item.id}
                    onClick={() => {
                        this.props.onCharSelected(item.id);
                        this.focusOnItem(i);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            this.props.onCharSelected(item.id);
                            this.focusOnItem(i); 
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

    render() {
        const {charList, loading, error, offset, newItemLoading, charEnded} = this.state;
        const items = this.renderItems(charList);
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !( loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display' : charEnded ? 'none' : 'block'}}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;