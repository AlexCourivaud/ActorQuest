// TODOs hide the API for Github
//************** Import hidden API *********************//
import { api } from "./scripthide.js";

//************** Variables *********************//
const searchBar = document.querySelector(".search-bar");
const actorsList = document.querySelector(".actor-result");
const actorCard = document.querySelector(".actor-card");
const searchInput = document.getElementById("search-input");
// const actorResultList = document.querySelector(".actors");

// // let searchConsole = searchInput.innerText;
// // console.log(searchConsole);

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
        // console.log(data);
      })
      .then((response) => console.log(response + " //////fin"))
      .catch((err) => console.error(err));
  });
}
// ********** Fct display ****/
function fctDisplayActorsList(actorsAPI) {
  let actorsName = actorsAPI.results;
  //   console.log(actorsName);
  actorsList.innerHTML = ""; // on vide le résultat avant de recommencer.
  for (let i = 0; i < 20; i++) {
    //
    let actorsDisplay = document.createElement("div"); // on créer la balise
    actorsDisplay.textContent = actorsName[i].name; //on ajoute le nom de l'acteur dans la var display
    actorsDisplay.classList.add("actors"); // on ajoute une class aux acteurs.
    if (actorsName[i].profile_path == null) {
      // Fct if si l'acteur n'a pas de photo
      var img = document.createElement("img"); // on crée l'élément img sur l'html
      img.src = "assets/Unknown_person.jpg"; // on attrape l'asset photo inconnu
      actorsList.appendChild(img); // on ajoute l'image à l'html
      actorsList.appendChild(actorsDisplay); // on ajoute le nom de l'acteur
      actorsDisplay.appendChild(img); // on ajoute l'image à l'html
    } else {
      var img = document.createElement("img"); // on crée l'élément img sur l'html
      img.src = "https://image.tmdb.org/t/p/w500/" + actorsName[i].profile_path;
      actorsList.appendChild(actorsDisplay); // on ajoute le nom de l'acteur
      actorsDisplay.appendChild(img); // on ajoute l'image à l'html
    }
    actorsDisplay.addEventListener("click", () => {
      console.log(actorsName[i].name);
      actorCard.innerHTML = "";

      //   On veut appliquer les informations de l'acteur dans la zone actors CARD a droite
      let actornewCard = document.createElement("div");
      actornewCard.textContent = actorsName[i].name;
      var actornewImg = document.createElement("img"); // on crée l'élément img sur l'html

      actornewImg.src =
        "https://image.tmdb.org/t/p/w500/" + actorsName[i].profile_path;
      actorCard.appendChild(actornewCard);
      actorCard.appendChild(actornewImg);
    });
  }
}
fctInputResearch();


