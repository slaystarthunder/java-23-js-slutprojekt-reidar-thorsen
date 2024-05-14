// variables for API key and base URL
export const API_KEY = 'f3f9aab6f4f71f0c59912515eb952946';
export const BASE_URL = 'https://api.themoviedb.org';


// function to fetch the movies from the API, and put them in a list using the createMovieList function

async function fetchMovies(url, targetElementId, searchType) {
    try {
        const response = await fetch(url);
        console.log("Response status code:", response.status);
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("API Response JSON:", data);

        if (data.total_results === 0) {
            document.querySelector('.error').textContent = "No search results found.";
            return;
        }

        const searchResults = data.results;
        createMovieList(searchResults, targetElementId, searchType);
    } catch (error) {
        document.querySelector('.error').textContent = "Error fetching data. Please try again.";
        console.error("Fetch Error:", error);
    }
}


// functions to add in variables to the URL that is fetched, to get the popular and top rated movies

async function getPopular() {
    const url = `${BASE_URL}/3/movie/popular?api_key=${API_KEY}`;
    await fetchMovies(url, '#popular', 'movie');
}

async function getTopRated() {
    const url = `${BASE_URL}/3/movie/top_rated?api_key=${API_KEY}`;
    await fetchMovies(url, '#top-rated', 'movie');
}

// functions to fetch the images of a person, and to create an image element

async function fetchPersonImages(personId, targetElement) {
    const url = `${BASE_URL}/3/person/${personId}/images?api_key=${API_KEY}`;
    try {
        const response = await fetch(url);
        if (response.status !== 200) {
            console.log("Error fetching person images:", response);
            return;
        }

        const data = await response.json();
        console.log("Person Images:", data);
        if (data.profiles.length > 0) {
            const imgUrl = `https://image.tmdb.org/t/p/w500${data.profiles[0].file_path}`;
            createImageElement(imgUrl, targetElement);
        }
    } catch (error) {
        console.log("Error fetching person images:", error);
    }
}

// function to create a list of movies or people, depending on the search type or which link is clicked

function createMovieList(items, targetElementId, searchType) {
    const targetElement = document.querySelector(targetElementId);
    items.forEach(item => {
        const li = document.createElement('li');
        const p = document.createElement('p');
        const h3 = document.createElement('h3');
        h3.textContent = item.title || item.name;
        li.appendChild(h3);

        if (searchType === "person") {
            fetchPersonImages(item.id, li);
            
            const knownForList = document.createElement('ul');

            item.known_for.forEach(media => {
                const mediaLi = document.createElement('li');
                mediaLi.textContent = `${media.title || media.name} (${media.media_type})`;
                knownForList.appendChild(mediaLi);
            });

            
            p.textContent = `${item.known_for_department}`;
            li.appendChild(p);
            li.appendChild(knownForList);
        } else { 
            const img = document.createElement('img');
            const imgUrl = "https://image.tmdb.org/t/p/w500" + item.poster_path;
            img.src = imgUrl;
            li.appendChild(img);
            p.textContent = `Description: ${item.overview} Release date: ${item.release_date}`;
            li.appendChild(p);
        }

        targetElement.appendChild(li);
    });
}


function createImageElement(imgUrl, targetElement) {
    const img = document.createElement('img');
    img.src = imgUrl;
    targetElement.appendChild(img);
}

export { fetchMovies, getPopular, getTopRated, fetchPersonImages, createMovieList, createImageElement };
