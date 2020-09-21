import React, {useState, useEffect} from 'react';
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

    const handleSearch = (username, endpoint) => {
        console.log("values = ", username);
        const request = '/users/' + username + endpoint;

        (async () => {

            try {
                const {data} = await axios.get(baseUrl + request);
                console.log('data from axios request to github API = ', data);
                setError(false);

                if (endpoint === '') {
                    setUser(data);
                } else {
                    setOption(endpoint);
                    setResults(data);
                }

            } catch(err) {
                console.log('error fetching information from github api: ', err);
                setError(true);
            }


        })();
    }

    useEffect(() => {

        // checks if the username is part of the pathname
        console.log('document = ', document.location.pathname.split('/')[1]);
        if (document.location.pathname !== '/') {
            setValues({
                ...values,
                'username': document.location.pathname.split('/')[1]
            });
            handleSearch(document.location.pathname.split('/')[1], '');
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
                        onClick={() => handleSearch(values.username, '')}
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
                                onClick={() => handleSearch(values.username, '/repos')}
                            >repos
                            </button>
                            
                            <button 
                                className="btn btn--animated"
                                onClick={() => handleSearch(values.username, '/starred')}
                            >starred
                            </button>
                        </div>


                    </div>

                )}

                {/* if repos or starred requests were made, show results */}
                {results && (
                    <div className="results">
                        <h3 className="results__title">results</h3>

                        {option && option==='/repos' && (
                            <div className="results__container">
                                {results.map(r => (
                                    <div className="results__item" key={r.id}>
                                        <a 
                                            href={r.html_url}            target="__blank" className="results__link"
                                        >{r.name}
                                        </a>
                                        
                                    </div>
                                ))}
                            </div>
                        )}

                        {option && option==='/starred' && (
                            <div className="results__container">
                                {results.map(r => (
                                    <div className="results__item" key={r.id}>
                                        <p className="results__repo">
                                            {r.full_name}
                                        </p>

                                        <div className="results__moreInfo">
                                            <p className="p results__moreInfo--login">{r.owner.login}</p>
                                            <img src={r.owner.avatar_url} alt={r.login} className="results__moreInfo--avatar"/>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}


                    </div>
                )}
            </div>



        </div>
        
    )
}

export default SearchBox;