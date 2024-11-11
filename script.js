// TODOs hide the API for Github
//************** Import hidden API *********************//
import { api } from "./scripthide.js";
import { token } from "./scripthide.js";

//************** Variables *********************//
const actorsList = document.querySelector(".actor-result");
const actorCard = document.querySelector(".actor-card");
const searchInput = document.getElementById("search-input");
const moviesList = document.querySelector(".movies-list");
const containerList = document.querySelector(".actor-container");
const historicSearch = document.querySelector(".recent-research");
var countJson = 0;

//////********// fonction pour chercher les acteurs en fonction de ce qu'écrit l'utilisateur :
function fctInputResearch() {
  // ***** on attrape la valeur entrée par l'utilisateur :
  searchInput.addEventListener("input", () => {
    var inputresearch = searchInput.value; // on la stock dans la variable
    if (!searchInput.value) {
      // Si l'input est vide fait disparaitre les container :
      containerList.style.display = "none";
      actorCard.style.display = "none";
      moviesList.style.display = "none";
      actorsList.style.display = "none";
    } else {
      // sinon on raffiche les container container List et Actor list
      containerList.style.display = "flex";
      actorsList.style.display = "flex";
    }

    // On récupère la BDD de l'api TMDB
    fetch(
      `https://api.themoviedb.org/3/search/person?api_key=${api}&query="${inputresearch}"&language=fr&page=1`
    )
      .then((response) => response.json())
      .then((data) => {
        //////********//Ici on appelle la fonction pour afficher les actors en fct de la recherche :
        fctDisplayActorsList(data);
      })
      .then((response) => console.log(response + " //////fin"))
      .catch((err) => console.error(err));
  });
}
//_________________________________________________________________________________________________________________________________________________________
// ********** Fct display Actors ****/
function fctDisplayActorsList(actorsAPI) {
  let actorsName = actorsAPI.results;

  actorsList.innerHTML = ""; // on vide le résultat avant de recommencer.
  for (let i = 0; i < 5; i++) {
    let actorsDisplay = document.createElement("div"); // on créer la balise
    actorsDisplay.textContent = actorsName[i].name; //on ajoute le nom de l'acteur dans la var display
    actorsDisplay.classList.add("actor"); // on ajoute une class aux acteurs.
    if (actorsName[i].profile_path == null) {
      // Fct if si l'acteur n'a pas de photo
      var img = document.createElement("img"); // on crée l'élément img sur l'html
      img.src = "assets/unknowprofilpp.png"; // on attrape l'asset photo inconnu
      actorsList.appendChild(img); // on ajoute l'image à l'html
      actorsList.appendChild(actorsDisplay); // on ajoute le nom de l'acteur
      actorsDisplay.appendChild(img); // on ajoute l'image à l'html
    } else {
      var img = document.createElement("img"); // on crée l'élément img sur l'html
      img.src = "https://image.tmdb.org/t/p/w200/" + actorsName[i].profile_path;
      actorsList.appendChild(actorsDisplay); // on ajoute le nom de l'acteur
      actorsDisplay.appendChild(img); // on ajoute l'image à l'html
    }
    // TODO Nouvelle fonction a séparer 21/10
    actorsDisplay.addEventListener("click", () => {
      actorCard.innerHTML = ""; // ça vide le container de l'actor descrip
      moviesList.innerHTML = ""; // ça vide le container des films ou l'acteur joue
      actorCard.style.display = "flex"; // ça affiche le container de l'actor descrip
      moviesList.style.display = "flex"; // ça affiche lcontainer des films ou l'acteur joue
      historicActors(actorsDisplay, img);
      let id = actorsName[i].id; // on capte l'id d'un acteur dans une variable
      // 2nd fetch de l'api pour récupéré les informations de l'acteur
      fetch(
        `https://api.themoviedb.org/3/person/${id}?api_key=${api}&language=fr`
      )
        .then((response) => response.json())
        .then((data) => {
          fctActorInformation(data);
        })
        .then((response) => console.log(response + " //////finactorsearch"))
        .catch((err) => console.error(err));

      //3eme fetch pour récupérer les films dans lesquels l'acteur a joué
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      fetch(
        `https://api.themoviedb.org/3/person/${id}/movie_credits?language=fr-FR`,
        options
      )
        .then((response) => response.json())
        .then((data) => {
          fctMovieInformation(data);
        })
        .then((response) => console.log(response + " //////finmoviebyactorid"))
        .catch((err) => console.error(err));

      // Fct pour afficher les éléments de l'API actors et movies
      function fctActorInformation(actInfoApi) {
        let actName = actInfoApi.name;
        let actBirthDate = actInfoApi.birthday;
        let actBirthPlace = actInfoApi.place_of_birth;
        let actJob = actInfoApi.known_for_department;
        let actBio = actInfoApi.biography;

        let actorDesc = document.createElement("div");
        actorDesc.innerHTML =
          "<br> Nom: " +
          actName +
          "<br> Date de Naissance: " +
          actBirthDate +
          "<br> Lieu de naissance: " +
          actBirthPlace +
          "<br> Activité principale: " +
          actJob +
          "<br> Biographie: " +
          actBio;

        actorCard.appendChild(actorDesc);
        fctMovieInformation(movieInfoApi);
      }
      let actornewCard = document.createElement("div");
      actornewCard.textContent = actorsName[i].name;
      var actornewImg = document.createElement("img"); // on crée l'élément img sur l'html

      if (actorsName[i].profile_path == null) {
        actornewImg.src = "assets/unknowprofilpp.png"; // on attrape l'asset photo inconnu
      } else {
        actornewImg.src =
          "https://image.tmdb.org/t/p/w300/" + actorsName[i].profile_path;
      }
      actorCard.appendChild(actornewCard);
      actorCard.appendChild(actornewImg);
    });
  }
}
// ********** Fct display Movies ****/

function fctMovieInformation(movieInfoApi) {
  let listMovies = movieInfoApi.cast;

  for (let i = 0; i < 5; i++) {
    // 20 === listMovies.length
    let movieCards = document.createElement("div");
    movieCards.classList.add("movie"); // on ajoute une class aux acteurs.

    movieCards.textContent = listMovies[i].original_title;
    let movieCardsImg = document.createElement("img");
    movieCardsImg.src =
      "https://image.tmdb.org/t/p/w400/" + listMovies[i].poster_path;
    if (listMovies[i].poster_path == null) {
      movieCardsImg.src = "assets/unknowprofilpp.png";
    }
    movieCardsImg.width = 200;
    movieCardsImg.height = 300;
    moviesList.appendChild(movieCards);
    movieCards.appendChild(movieCardsImg);
  }
}


// ********** Fct display historic before click ****/
function localActorsStorage() {
  if (localStorage.length > 0) {
    historicSearch.innerHTML = [];
    // Si on a quelque dans localstorage on l'affiche
    historicSearch.style.display = "flex";
    for (let i = 0; i <= localStorage.length; i++) {
      let lastActorsSeen = JSON.parse(localStorage.getItem(`key ${i}`));
      let histoActors = document.createElement("div"); // on crée nouvel div
      histoActors.innerHTML = lastActorsSeen; // on place le nom et l'image dans la nouvelle var
      histoActors.classList.add("actor"); // on utilise la meme classe que dans la zone de résultats
      historicSearch.appendChild(histoActors);
    }
  } else {
    // sinon on n'affiche pas l'historique
    historicSearch.style.display = "none";
  }
}

// ********** Fct display historic after click ****/
function historicActors(actorCardClicked) {
  // countJson++; // On place un compteur,
  // if(countJson > 3 ) {
  //   countJson = 1
  // }
  if (localStorage.length > 0) {
    //on verifie si ya un local storage ?
    if (localStorage.length <= 3 && localStorage.length >= 2) {
      // S'il y a3 éléments dans le LS
      // On récupère le LS :
      let jsonHistoricAct1 = JSON.parse(localStorage.getItem(`key ${1}`)); // 1er element du ls
      let jsonHistoricAct2 = JSON.parse(localStorage.getItem(`key ${2}`)); // 2nd Element du ls
      localStorage.setItem(`key ${2}`, JSON.stringify(jsonHistoricAct1)); // On remplace le 1 en 2
      localStorage.setItem(`key ${3}`, JSON.stringify(jsonHistoricAct2)); // On remplace le 2 en 3
      // On doit ajouter le click au 1er :
      let historicArray = []; // Nouvelle var pour stocker le click
      historicArray.push(actorCardClicked.innerHTML); // on met dans l'acteur cliqué dans l'array
      localStorage.setItem(`key ${1}`, JSON.stringify(historicArray)); // On place l'item dans le LS
    }
    if (localStorage.length == 1) {
      // S'il y a 1 element dans le LS
      let jsonHistoricAct1 = JSON.parse(localStorage.getItem(`key ${1}`)); // 1er element du ls
      localStorage.setItem(`key ${2}`, JSON.stringify(jsonHistoricAct1)); // On remplace le 1 en 2
      let historicArray = []; // Nouvelle var pour stocker le click
      historicArray.push(actorCardClicked.innerHTML); // on met dans l'acteur cliqué dans l'array
      localStorage.setItem(`key ${1}`, JSON.stringify(historicArray)); // On place l'item dans le LS
    }
  } else {
    // ya pas de LS donc on met le 1er ok classique IZY
    let historicArray = []; // Nouvelle var pour stocker le click
    historicArray.push(actorCardClicked.innerHTML); // on met dans l'acteur cliqué dans l'array
    localStorage.setItem(`key ${1}`, JSON.stringify(historicArray)); // On place l'item dans le LS
  }
  localActorsStorage(); // on réaffiche commme il faut l'histo
}


// Main Script //
fctInputResearch();
localActorsStorage();