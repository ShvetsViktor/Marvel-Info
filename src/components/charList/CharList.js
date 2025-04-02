import { Component } from 'react';

import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charList.scss';

class CharList extends Component {

    state = {
        charList: [],
        loading:true,
        error: false,
        newItemLoading: false,
        offset: 0,
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
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
        if(newCharList < 9){
            ended = true;
        }


        this.setState(({ offset, charList }) => {
            const existingIds = new Set(charList.map(char => char.id));
            const filteredNewChars = newCharList.filter(char => !existingIds.has(char.id));

            return {
                charList: [...charList, ...filteredNewChars],
                loading: false,
                newItemLoading: false,
                offset: offset + 9,
                charEnded: ended
            };
        });
    }

    onCharLoading = () => {
        this.setState({loading: true})
    }
    
    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    renderItems = (arr) => {
        const items = arr.map(item => {
            return (
                <li 
                    className="char__item"
                    key={item.id}
                    onClick={() => this.props.onCharSelected(item.id)}>
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
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;