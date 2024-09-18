// TODOs hide the API for Github
//************** Import hidden API *********************//
import { api } from "./scripthide.js";
import { token } from "./scripthide.js";

//************** Variables *********************//
const searchBar = document.querySelector(".search-bar");
const actorsList = document.querySelector(".actor-result");
const actorCard = document.querySelector(".actor-card");
const searchInput = document.getElementById("search-input");
const moviesList = document.querySelector(".movies-list");
const containerList = document.querySelector(".actor-container");

function fctInputResearch() {
  // ***** on attrape la valeur entrée par l'utilisateur :
  searchInput.addEventListener("input", () => {
    var inputresearch = searchInput.value; // on la stock dans la variable
    // On récupère la BDD de l'api TMDB
    fetch(
      `https://api.themoviedb.org/3/search/person?api_key=${api}&query="${inputresearch}"&language=fr&page=1`
    )
      .then((response) => response.json())
      .then((data) => {
        fctDisplayActorsList(data);
      })
      .then((response) => console.log(response + " //////fin"))
      .catch((err) => console.error(err));
  });
}
// ********** Fct display ****/
function fctDisplayActorsList(actorsAPI) {
  let actorsName = actorsAPI.results;
  containerList.style.display = "flex";

  actorsList.innerHTML = ""; // on vide le résultat avant de recommencer.
  for (let i = 0; i < 20; i++) {

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
    actorsDisplay.addEventListener("click", () => {
      actorCard.innerHTML = "";
      moviesList.innerHTML = "";

      actorCard.style.display = "flex";
      moviesList.style.display = "flex";

      let id = actorsName[i].id;
      fetch(
        `https://api.themoviedb.org/3/person/${id}?api_key=${api}&language=fr`
      )
        .then((response) => response.json())
        .then((data) => {
          fctActorInformation(data);
        })
        .then((response) => console.log(response + " //////finactorsearch"))
        .catch((err) => console.error(err));

      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
          `Bearer ${token}`,

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

      //   On veut appliquer les informations de l'acteur dans la zone actors CARD a droite
      function fctActorInformation(actInfoApi) {
        let actorInfos = document.createElement("div");
        actorInfos = actInfoApi;
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
        actornewImg.width = 400;
        actornewImg.height = 600;
      } else {
        actornewImg.src =
          "https://image.tmdb.org/t/p/w400/" + actorsName[i].profile_path;
      }
      actorCard.appendChild(actornewCard);
      actorCard.appendChild(actornewImg);
    });
  }
}

function fctMovieInformation(movieInfoApi) {
  let listMovies = movieInfoApi.cast;
  for (let i = 0; i < listMovies.length; i++) {
    let movieCards = document.createElement("div");
    movieCards.classList.add("movie"); // on ajoute une class aux acteurs.

    movieCards.textContent = listMovies[i].original_title;
    let movieCardsImg = document.createElement("img");
    movieCardsImg.src =
      "https://image.tmdb.org/t/p/w400/" + listMovies[i].poster_path;
      movieCardsImg.width = 200;
      movieCardsImg.height = 300;
    moviesList.appendChild(movieCards);
    movieCards.appendChild(movieCardsImg);
  }
}

fctInputResearch();
