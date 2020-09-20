import React, {useState, useEffect} from 'react';
import axios from 'axios';

const SearchBox = (props) => {
    const baseUrl = 'https://api.github.com';

    const [error, setError] = useState(false);
    const [results, setResults] = useState();
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
                setResults(data);
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
            handleSearch(document.location.pathname.split('/')[1], '');
        }

    },[]);


    return (
        <div className="container">
            {error && (
                <p className="error">ERROR</p>
            )}

            {/* if there is no username in the url, show the form with the input field */}
            {!results && (
                <div className="form">
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
                        className="btn btn--animated"
                        onClick={() => handleSearch(values.username, '')}
                    >search
                    </button>
                </div>
            )}

            {/* if there is a username in the url, show the results from the API inquiry */}
            {results && (
                <div className="result">
                    <h2 className="result__name">
                        {results.name}
                    </h2>

                    <h3 className="result__name">
                        {results.login}
                    </h3>

                    <img src={results.avatar_url} alt={results.login} className="results__image"/>


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

            )}

        </div>
        
    )
}

export default SearchBox;