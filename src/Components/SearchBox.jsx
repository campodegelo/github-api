import React, {Fragment, useState, useEffect} from 'react';
import axios from 'axios';

const SearchBox = (props) => {
    const baseUrl = 'https://api.github.com';

    const [error, setError] = useState(false);
    const [option, setOption] = useState();
    const [results, setResults] = useState();
    const [user, setUser] = useState();
    const [values, setValues] = useState();
    

    const handleChange = e => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        })
    }

    const handleSearch = (values, endpoint) => {
        let username;

        if (endpoint === 'url') {
            endpoint = '';
            username = document.location.pathname.split('/')[1];
        } else {
            if (values === undefined) {
                setError(true);
                return;
            } else {
                setError(false);
                username = values.username;
            }
        }

        const request = '/users/' + username + endpoint;

        (async () => {

            try {
                const {data} = await axios.get(baseUrl + request);
                // console.log('data from axios request to github API = ', data);
                setError(false);

                setOption(endpoint);
                if (endpoint === '') {
                    setUser(data);
                    setResults('');
                } else {
                    setResults(data);
                }

            } catch(err) {
                console.log('error fetching username from github api: ', err);
                // if username is set and the new one is not found 
                setError(true);
            }


        })();
    }

    useEffect(() => {

        // checks if the username is part of the pathname
        if (document.location.pathname !== '/') {
            setValues({
                ...values,
                'username': document.location.pathname.split('/')[1]
            });
            setOption('url');
            handleSearch(document.location.pathname.split('/')[1], 'url');
            // handleSearch(values, '');
        }

    },[]);


    return (
        <div className="container">
            {error && (
                <p className="error">ERROR! Please try again...</p>
            )}

            <div className="side-menu">
                <div className="form">
                    <h2 className="side-menu__title">Repositories</h2>
                    <div className="form__group">
                        <input
                            type="text"                            
                            name="username"
                            placeholder="Username to be searched"
                            className="form__input"
                            autoComplete="off"
                            onChange={e => handleChange(e)}
                        >
                        </input>
                        <label
                            htmlFor="username"
                            className="form__label"
                        >Username to be searched
                        </label>
                    </div>

                    <button
                        className="btn btn--animated btn--primary"
                        onClick={() => handleSearch(values, '')}
                    >search
                    </button>
                </div>
            </div>

            <div className="content">

                {/* if there is a username in the url, show the user information from the API inquiry */}
                {user && (
                    <div className="user">
                        <img src={user.avatar_url} alt={user.login} className="user__image"/>

                        <div className="user__info">
                            <h2 className="user__name">
                                {user.name}
                            </h2>

                            <h3 className="user__login">
                                {user.login}
                            </h3>
                        </div>

                        <div className="user__buttons">
                            <button 
                                className="btn btn--animated"
                                onClick={() => handleSearch(values, '/repos')}
                            >repos
                            </button>
                            
                            <button 
                                className="btn btn--animated"
                                onClick={() => handleSearch(values, '/starred')}
                            >starred
                            </button>
                        </div>


                    </div>

                )}

                {/* if repos or starred requests were made, show results */}
                {results && (
                    <div className="results">

                        {option && option==='/repos' && (
                            <Fragment>
                                <h3 className="results__title">Repositories</h3>
                                {results.map(r => (
                                    <div className="results__item" key={r.id}>
                                        <img src="/icon.png" alt="icon" className="results__item-icon"/>
                                        <a 
                                            href={r.html_url}            target="__blank" className="results__link"
                                        >{r.name}
                                        </a>
                                        
                                    </div>
                                ))}
                            </Fragment>
                        )}

                        {option && option==='/starred' && (
                            <Fragment>
                                <h3 className="results__title">Starred</h3>
                                {results.map(r => (
                                    <div className="results__item--individual" key={r.id}>

                                        <div className="results__moreInfo">
                                            <p className="results__moreInfo-title">
                                                {r.full_name}
                                            </p>
                                            <p className="p results__moreInfo-login">{r.owner.login}</p>
                                            <img src={r.owner.avatar_url} alt={r.login} className="results__moreInfo-avatar"/>

                                        </div>
                                    </div>
                                ))}
                            </Fragment>
                        )}


                    </div>
                )}
            </div>



        </div>
        
    )
}

export default SearchBox;