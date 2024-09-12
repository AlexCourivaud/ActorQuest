// TODOs hide the API for Github
//************** Import hidden API *********************//
import { api } from "./scripthide.js";

//************** Variables *********************//
const searchBar = document.querySelector(".search-bar");
const actorList = document.querySelector(".actor-result");
const actorCard = document.querySelector(".actor-card");
const searchInput = document.getElementById("search-input");

// // let searchConsole = searchInput.innerText;
// // console.log(searchConsole);

function fctInputResearch() {
  // ***** on attrape la valeur entrée par l'utilisateur :
  searchInput.addEventListener("input", () => {
    var inputresearch = searchInput.value; // on la stock dans la variable
    // fctDisplayActorsList(inputresearch); // on appelle la fct display avec le parametre de l'input
    // console.log(inputresearch);
    // return inputresearch;

    fetch(
      `https://api.themoviedb.org/3/search/person?api_key=${api}&query=${inputresearch}&language=fr&page=1`
    )
      .then((response) => response.json())
      .then((data) => {
        fctApiActors(data);
        // console.log(data);
      })
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
  });
}

// //TODO fetch de data from the movie DB

// ********** Fct display ****/

// //************** Fetch API themovieDB */

function fctApiActors(actorsApi) {
  let actors = actorsApi.results;
  for (let a in actors) {
    let actor = actors[a];
    // console.log(actor.name);
    fctDisplayActorsList(actor);
  }
}

function fctDisplayActorsList(actorsName) {
  console.log(actorsName);
  actorList.innerHTML = ""; // on vide le résultat avant de recommencer.
  let actorsDisplay = document.createElement("p"); // on créer la balise
  //   actorsDisplay.className("actor");

  //   for (let i = 0; i < actorsName.length; i++) {
  actorsDisplay.textContent = actorsName.name; //on ajoute le nom de l'acteur dans la var display
  console.log(actorsDisplay);
  actorsDisplay.classList.add("actors"); // on ajoute une class aux acteurs.
  actorList.appendChild(actorsDisplay);
  //   }
}
fctInputResearch();

//         actorsDisplay.textContent = actor; //on ajoute le nom de l'acteur dans la var display
// actorsDisplay.classList.add("actors"); // on ajoute une class aux acteurs.
// actorList.appendChild(actorsDisplay);
