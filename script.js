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
const historicSearch = document.querySelector(".recent-research");
var countJson = 0;

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
        fctDisplayActorsList(data);
      })
      .then((response) => console.log(response + " //////fin"))
      .catch((err) => console.error(err));
  });
}
// ********** Fct display ****/
function fctDisplayActorsList(actorsAPI) {
  let actorsName = actorsAPI.results;

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
      // quand on click sur un acteur :
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
        fctLastResearch(actorDesc);
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

function fctMovieInformation(movieInfoApi) {
  let listMovies = movieInfoApi.cast;

  for (let i = 0; i < listMovies.length; i++) {
    let movieCards = document.createElement("div");
    movieCards.classList.add("movie"); // on ajoute une class aux acteurs.

    movieCards.textContent = listMovies[i].original_title;
    let movieCardsImg = document.createElement("img");
    movieCardsImg.src = "https://image.tmdb.org/t/p/w400/" + listMovies[i].poster_path;
    if (listMovies[i].poster_path == null) {
      movieCardsImg.src = "assets/unknowprofilpp.png";
    }
    movieCardsImg.width = 200;
    movieCardsImg.height = 300;

    moviesList.appendChild(movieCards);
    movieCards.appendChild(movieCardsImg);
  }
}

fctInputResearch();

const jsonLaunch = document.getElementById("jsonBtn");

// function fctLastResearch(lastActors) {
//   jsonLaunch.addEventListener("click", () => {
//     alert("oui");
//   });
// }
// fctLastResearch();

// on récupère les derniers acteurs clické
function historicActors(actorCardClicked, picture) {
  let histoActors = document.createElement("div"); // on crée nouvel div
  histoActors.innerHTML = actorCardClicked.innerHTML; // on place le nom et l'image dans la nouvelle var
  histoActors.classList.add("actor"); // on utilise la meme classe que dans la zone de résultats
  historicSearch.appendChild(histoActors); // on ajoute les elements au html.
  //On compte les occurences de click et on veut limiter leur donner
  countJson++;
  if (countJson > 3) {
    countJson = 1;
  }
  var historicArray = [];
  historicArray.push(histoActors.innerHTML);
  localStorage.setItem(`key ${countJson}`, JSON.stringify(historicArray));
}

// si des notes sont stockées :
if (localStorage.getItem("notes")) {
  // on les récupère :
  let noteExistantes = localStorage.getItem("notes");
  console.log("les notes récupérées : " + noteExistantes);

  // on les parse :
  let noteParses = JSON.parse(noteExistantes);
  console.log("les notes après le parse : " + noteParses);

  // on les push dans le tableau

  noteParses.push(noteObject);
  console.log("le nouveau tableau : " + noteParses);
  localStorage.setItem("notes", JSON.stringify(noteParses));

  alert("on a un objet");
} else {
  var noteArrays = [];
  noteArrays.push(noteObject);
  localStorage.setItem("notes", JSON.stringify(noteArrays));

  alert("on pousse la note dans le tableau");
}
// on push l'ensemble dans le localStorage :

alert("vous avez ajouter la note " + title);

function displayNote() {
  const parseNote = JSON.parse(localStorage.getItem("notes"));

  console.log(parseNote);

  for (i = 0; i < parseNote.length; i++) {
    let ulCreate = document.createElement("ul");
    ulCreate.className = "note";
    ulCreate.innerHTML =
      `<h1> ${parseNote[i].title} </h1>` +
      `<p> ${parseNote[i].text} </p>` +
      `<button id="deleteBtn">Supprimer</button>`;
    notesListContainer.appendChild(ulCreate);
  }
}

displayNote();
