const image_Url = "https://image.tmdb.org/t/p/w500";



class Person {

    constructor(id, name, image) {this.id = id; this.name = name; this.image = image;
        request(`/person/${this.id}/movie_credits`).then(p => {
            this.movies = p.cast.map(mv => mv.original_title);
            this.movies = this.movies.concat(p.crew.map(mv => mv.original_title));
        });
    }

    find_movie(name) {
        return this.movies.find(n => n.toLowerCase() == name.toLowerCase());
    }

    html() {
        return `<div class="person">
        <h2>${this.name}</h2>
        <img src="${this.image}" alt="${this.name}">
        <form>
        <label for="${this.name}">Enter a movie in which the actor chosen has played.</label>
        <input type="text" name="${this.name}" id="${this.name}" class="personChoice" required>
        <button type=submit>Submit </button>
        </form>
        </div>`;
    }
}

class Movie {

    constructor(id, name, image, date) {this.id = id; this.name = name;this.image = image;this.date = date;
        request(`movie/${this.id}/credits`).then(a=> {
            this.persons = a.cast.map(mv => ({ id: mv.id , name: mv.name, image: mv.profile_path}));
            this.persons = this.persons.concat(a.crew.filter(mv => mv.job == "Director").map(mv => ({ id: mv.id , name: mv.name,  image: mv.profile_path})));
        });
    }

    html() {
        return `<div class="movie">
        <h1>${this.name}</h1>
        <img src="${this.image}" alt="${this.name}">
        <p><p>Date:</p>${this.date}</p>
        <form>
        <label for="${this.name}">Enter an actor's name or the director one of the movie </label>
        <input  name="${this.name}" id="${this.name}" type="text" class="movieChoice" required>
        <button type=submit>Submit </button>
        </form>
        </div>`
    }

    getPerson(name) {
        return this.persons.find(p => p.name.toLowerCase() == name.toLowerCase());
    }


}


async function getPerson(id) {
    const data = await request(`/person/${id}/movie_credits`);}

async function search_movie(name) {
    const data = await request("search/movie", { query: name });
    var dataMovie = data.results[0];
    return new Movie(dataMovie.id, dataMovie.original_title, image_Url + dataMovie.poster_path, dataMovie.release_date);}

    

async function request(i, parametres = {}) {
    const p = Object.entries(parametres).map(entry => {
        const [key, v] = entry;
        return `&${key}=${v}`;}).join('');
    try {
        const output = await fetch(`https://api.themoviedb.org/3/${i}?api_key=c910fcc4c511513f5bf309e34a7a5771${p}`);
        return await output.json();
    } catch (message) {
        return console.exception(message);
    }
}
function showError(preced, isd) {
    let sorry = document.createElement("div");
    sorry.classList.add("ERROR");
    sorry.innerHTML = `<p>${isd}</p>`;
    preced.insertBefore(sorry, preced.childNodes[0]);}




    


// main
async function main() {
    let actualMovie = await search_movie("Titanic");
    let actualPerson;
    document.body.innerHTML = document.body.innerHTML + actualMovie.html();
    let nameMovie = ["titanic"];
    let namesAD = [];
    document.addEventListener("submit", async h => {
        h.preventDefault();
        const input = h.target.getElementsByTagName("input")[0];
        const button = h.target.getElementsByTagName("button")[0];
        const v = input.v.toLowerCase();
        button.disabled = true;

        switch (input.className) {
            case "movieChoice":
                if(namesAD.includes(v)){
                    button.disabled = false;
                    showError(h.target, "Choose another person please.");}
                else{
                    const prs = actualMovie.getPerson(v)
                    if (prs) {
                        namesAD.push(v);
                        actualPerson = new Person(prs.id, prs.name, image_Url + prs.image);
                        document.body.innerHTML = document.body.innerHTML + actualIndividual.html();}
                    else {
                        button.disabled = false;
                        showError(h.target, "No director or actor called like this.");}
                }
                break;

            case "personChoice":
                if (nameMovie.includes(v)) {
                    button.disabled = false;
                    showError(h.target, "You can't enter the same movie name twice.");}
                else {
                    const movie = actualPerson.find_movie(v);
                    if(movie){
                        nameMovie.push(v);
                        actualMovie = await search_movie(v);
                        document.body.innerHTML= document.body.innerHTML + actualMovie.html();}
                    else{
                        button.disabled = false;
                        showError(h.target, "No such actor in the chosen movie.");}
                }
                break;

        }
    });
}

main();