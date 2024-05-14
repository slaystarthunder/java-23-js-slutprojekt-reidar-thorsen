import { getPopular, getTopRated, fetchMovies, BASE_URL, API_KEY } from './api.js';


function handleCheckbox(event) {
    var checkboxes = document.querySelectorAll('input[name="searchType"]');
    checkboxes.forEach(checkbox => {
        if (checkbox !== event.target) {
            checkbox.checked = false;
        }
    });
}



// function that first clears the search result and then fetches the movies from the API

async function searchMovie(e) {
    e.preventDefault();
    const text = document.querySelector('#search-movie-input').value;
    const searchResult = document.querySelector('#search-result');

    
    while (searchResult.firstChild) {
        searchResult.removeChild(searchResult.lastChild);
    }
    
    if (text.length === 0) {
        document.querySelector('.error').textContent = "Please write something to search.";
        return false;
    }

    const isMovieSearch = document.querySelector('#movieSearch').checked;
    const searchType = isMovieSearch ? "movie" : "person";  
    const url = `${BASE_URL}/3/search/${searchType}?api_key=${API_KEY}&query=${text}`;
    await fetchMovies(url, '#search-result', searchType);  

    return false;
}


// function to check if the search is for a movie or a person

function addEventListeners() {
    document.querySelectorAll('input[name="searchType"]').forEach(checkbox => {
        checkbox.addEventListener('click', handleCheckbox);
    });
    document.querySelector('#search-movie').addEventListener('submit', searchMovie);
}

function initPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');

    if (page === 'popular') {
        getPopular().catch(error => {
            document.querySelector('.error').textContent = error;
        });
    } else if (page === 'toprated') {
        getTopRated().catch(error => {
            document.querySelector('.error').textContent = error;
        });
    }
    addEventListeners();
}

initPage();
