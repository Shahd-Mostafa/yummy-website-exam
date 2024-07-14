let recipeMenu = document.getElementById("recipeMenu");
let recipeDetails = document.getElementById("recipeDetails");
let searchBox = document.getElementById("searchBox");

let submitBtn,
  formName,
  formEmail,
  formAge,
  formPhone,
  formPassword,
  formRepassword;
let nameWarn, emailWarn, phoneWarn, ageWarn, passwordWarn, repasswordWarn;
let nameValid, emailValid, phoneValid, ageValid, passwordValid;

let nameReg = /^[a-zA-Z ]+$/;
let emailReg =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
let phoneReg = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
let ageReg = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/;
let passwordReg = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;

let nameActive = false;
let emailActive = false;
let ageActive = false;
let phoneActive = false;
let passwordActive = false;
let repasswordActive = false;

$(document).ready(() => {
  getSearchName("").then(() => {
    $(".loader-screen").fadeOut(500);
    document.body.style.overflow = "visible";
    searchBox.classList.add("d-none");
  });
});

// Side menu close and open
function CloseMenu() {
  $(".open-close-bars").addClass("fa-align-justify");
  $(".open-close-bars").removeClass("fa-x");
  let wid = $(".side-black").outerWidth();
  $(".side-menu").animate({ left: -wid }, 500);
  $(".items li").animate({ top: 300 }, 500);
}

function OpenMenu() {
  for (let i = 0; i < 5; i++) {
    $(".items li")
      .eq(i)
      .animate({ top: 0 }, (i + 5) * 100);
  }
  $(".open-close-bars").addClass("fa-x");
  $(".open-close-bars").removeClass("fa-align-justify");
  $(".side-menu").animate({ left: 0 }, 500);
}

// works the first time only
function CloseMenu2() {
  $(".open-close-bars").addClass("fa-align-justify");
  $(".open-close-bars").removeClass("fa-x");
  let wid = $(".side-black").outerWidth();
  $(".side-menu").animate({ left: -wid }, 100);
  $(".items li").animate({ top: 300 }, 500);
}
CloseMenu2();

$(".open-close-bars").click(function () {
  if ($(".side-menu").css("left") == "0px") {
    CloseMenu();
  } else {
    OpenMenu();
  }
});

function closeButton() {
  recipeDetails.classList.add("d-none");
  recipeMenu.classList.remove("d-none");
}

function closeButtonSearch() {
  recipeDetails.classList.add("d-none");
  recipeMenu.classList.remove("d-none");
  searchBox.classList.remove("d-none");
}

// all displays

// Display any meal
function displayMeals(meals) {
  recipeDetails.classList.add("d-none");
  let storage = "";
  for (let i = 0; i < meals.length; i++) {
    storage += `<div class="col-md-3">
                  <div
                    class="recipe-item position-relative overflow-hidden rounded-2" onclick="getDetails('${meals[i].idMeal}')"
                  >
                    <img src="${meals[i].strMealThumb}" alt="${meals[i].strMeal} picture" class="w-100" />
                    <div
                      class="recipe-bg position-absolute d-flex align-items-center p-2"
                    >
                      <h3 class="text-capitalize text-black">${meals[i].strMeal}</h3>
                    </div>
                  </div>
                </div>`;
  }
  recipeMenu.innerHTML = storage;
}

//display details
function displayDetails(meal) {
  recipeMenu.classList.add("d-none");
  searchBox.classList.add("d-none");
  recipeDetails.classList.remove("d-none");
  let ingredients = ``;
  let tagFilter = meal.strTags?.split(",");
  if (!tagFilter) {
    tagFilter = [];
  }
  let tags = "";
  for (let r = 0; r < tagFilter.length; r++) {
    tags += `
        <li class="alert alert-danger p-1 m-2">${tagFilter[r]}</li>`;
  }
  for (let k = 1; k <= 20; k++) {
    if (meal[`strIngredient${k}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${
        meal[`strMeasure${k}`]
      } ${meal[`strIngredient${k}`]}</li>`;
    }
  }
  let storage = `<div class="col-md-4">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="rounded-3 w-100" />
              <h2 class="text-capitalize text-white">${meal.strMeal}</h2>
            </div>
            <div class="col-md-8 d-flex">
              <div class="text">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex flex-wrap g-3">${ingredients}</ul>
                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex flex-wrap g-3">${tags}</ul>
                <a href="${meal.strSource}" class="btn btn-success source" target="_blank"
                  >Source</a
                >
                <a href="${meal.strYoutube}" class="btn btn-danger youtube" target="_blank"
                  >Youtube</a
                >
              </div>
                <button
                onclick="closeButton()"
                type="button"
                class="close-btn align-self-start ps-5"
                aria-label="Close"
              >
                <i class="fa-solid fa-x" style="color: #f9f6f6"></i>
              </button>
            </div>`;
  recipeDetails.innerHTML = storage;
}

// Display meals categories
function displayCategories(categories) {
  recipeMenu.innerHTML = "";
  recipeDetails.classList.add("d-none");
  searchBox.classList.add("d-none");
  let storage = "";
  for (let j = 0; j < categories.length; j++) {
    storage += `<div class="col-md-3">
                  <div
                    class="recipe-item position-relative overflow-hidden rounded-2" onclick="getCategoryMeals('${
                      categories[j].strCategory
                    }')"
                  >
                    <img src="${
                      categories[j].strCategoryThumb
                    }" alt="" class="w-100" />
                    <div class="recipe-bg position-absolute text-center p-2">
                      <h3 class="text-capitalize text-black">${
                        categories[j].strCategory
                      }</h3>
                      <p>${categories[j].strCategoryDescription
                        .split(" ")
                        .slice(0, 20)
                        .join(" ")}</p>
                    </div>
                  </div>
                </div>`;
  }
  recipeMenu.innerHTML = storage;
}

// display areas
function displayCuisines(areas) {
  let storage = "";
  for (let l = 0; l < areas.length; l++) {
    storage += `<div class="col-md-3">
              <div class="rounded-2 house text-center" onclick="getCuisineMeals('${areas[l].strArea}')">
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h3>${areas[l].strArea}</h3>
              </div>
            </div>`;
  }
  recipeMenu.innerHTML = storage;
}

// display ingredients menu
function displayIngredients(ing) {
  let storage = "";
  for (let s = 0; s < ing.length; s++) {
    storage += `<div class="col-md-3">
              <div class="rounded-2 ing text-center" onclick="getIngredientMeals('${
                ing[s].strIngredient
              }')">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3>${ing[s].strIngredient}</h3>
                <p>${ing[s].strDescription
                  .split(" ")
                  .slice(0, 20)
                  .join(" ")}</p>
              </div>
            </div>`;
  }
  recipeMenu.innerHTML = storage;
}

// Display search meals only
function displaySearchMeals(meals) {
  recipeDetails.classList.add("d-none");
  let storage = "";
  for (let i = 0; i < meals.length; i++) {
    storage += `<div class="col-md-3">
                  <div
                    class="recipe-item position-relative overflow-hidden rounded-2" onclick="getSearchDetails('${meals[i].idMeal}')"
                  >
                    <img src="${meals[i].strMealThumb}" alt="${meals[i].strMeal} picture" class="w-100" />
                    <div
                      class="recipe-bg position-absolute d-flex align-items-center p-2"
                    >
                      <h3 class="text-capitalize text-black">${meals[i].strMeal}</h3>
                    </div>
                  </div>
                </div>`;
  }
  recipeMenu.innerHTML = storage;
}

// display search meals details only
function displaySearchDetails(meal) {
  recipeMenu.classList.add("d-none");
  searchBox.classList.add("d-none");
  recipeDetails.classList.remove("d-none");
  let ingredients = ``;
  let tagFilter = meal.strTags?.split(",");
  if (!tagFilter) {
    tagFilter = [];
  }
  let tags = "";
  for (let r = 0; r < tagFilter.length; r++) {
    tags += `
        <li class="alert alert-danger p-1 m-2">${tagFilter[r]}</li>`;
  }
  for (let k = 1; k <= 20; k++) {
    if (meal[`strIngredient${k}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${
        meal[`strMeasure${k}`]
      } ${meal[`strIngredient${k}`]}</li>`;
    }
  }
  let storage = `<div class="col-md-4">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="rounded-3 w-100" />
              <h2 class="text-capitalize text-white">${meal.strMeal}</h2>
            </div>
            <div class="col-md-8 d-flex">
              <div class="text">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex flex-wrap g-3">${ingredients}</ul>
                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex flex-wrap g-3">${tags}</ul>
                <a href="${meal.strSource}" class="btn btn-success source" target="_blank"
                  >Source</a
                >
                <a href="${meal.strYoutube}" class="btn btn-danger youtube" target="_blank"
                  >Youtube</a
                >
              </div>
                <button
                onclick="closeButtonSearch()"
                type="button"
                class="close-btn align-self-start ps-5"
                aria-label="Close"
              >
                <i class="fa-solid fa-x" style="color: #f9f6f6"></i>
              </button>
            </div>`;
  recipeDetails.innerHTML = storage;
}

// display search results
function displaySearchResult() {
  searchBox.classList.remove("d-none");
  recipeDetails.classList.add("d-none");
  searchBox.innerHTML = `<div class="col-md-6">
              <input
                type="text"
                class="form-control bg-transparent text-white"
                placeholder="Search By Name"
                onkeyup="getSearchName(this.value)"
              />
            </div>
            <div class="col-md-6">
              <input
                type="text"
                class="form-control bg-transparent text-white"
                placeholder="Search By First Letter"
                onkeyup="getSearchLetter(this.value)"
                maxlength="1"
              />
            </div>`;
  recipeMenu.innerHTML = "";
}

// all api requests

// get meals details
async function getDetails(mealID) {
  CloseMenu();
  $(".second-loading").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  );
  let data = await response.json();
  displayDetails(data.meals[0]);
  $(".second-loading").fadeOut(300);
}

// get search meals details
async function getSearchDetails(mealID) {
  CloseMenu();
  recipeDetails.innerHTML = "";
  recipeDetails.classList.add("d-none");
  $(".second-loading").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  );
  let data = await response.json();
  displaySearchDetails(data.meals[0]);
  $(".second-loading").fadeOut(300);
}

// get all categories
async function getCategories() {
  recipeMenu.innerHTML = "";
  recipeMenu.classList.remove("d-none");
  $(".second-loading").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  let data = await response.json();
  displayCategories(data.categories);
  $(".second-loading").fadeOut(300);
}

// get meals in each category
async function getCategoryMeals(category) {
  recipeMenu.innerHTML = "";
  $(".second-loading").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  let data = await response.json();
  displayMeals(data.meals.slice(0, 20));
  $(".second-loading").fadeOut(300);
}

// get cuisine
async function getCuisine() {
  recipeMenu.innerHTML = "";
  searchBox.innerHTML = "";
  recipeMenu.classList.remove("d-none");
  recipeDetails.classList.add("d-none");
  $(".second-loading").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  let data = await response.json();
  displayCuisines(data.meals);
  $(".second-loading").fadeOut(300);
}

// get meals of each cuisine
async function getCuisineMeals(area) {
  recipeMenu.innerHTML = "";
  searchBox.innerHTML = "";
  $(".second-loading").fadeIn(300);
  searchBox.classList.add("d-none");
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  let data = await response.json();
  displayMeals(data.meals.slice(0, 20));
  $(".second-loading").fadeOut(300);
}

// get ingredients menu
async function getIngredients() {
  recipeMenu.innerHTML = "";
  searchBox.innerHTML = "";
  recipeMenu.classList.remove("d-none");
  recipeDetails.classList.add("d-none");
  $(".second-loading").fadeIn(300);
  searchBox.classList.add("d-none");
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  let data = await response.json();
  displayIngredients(data.meals.slice(0, 20));
  $(".second-loading").fadeOut(300);
}

// get ingredients meals
async function getIngredientMeals(mainIng) {
  recipeMenu.innerHTML = "";
  searchBox.innerHTML = "";
  $(".second-loading").fadeIn(300);
  searchBox.classList.add("d-none");
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${mainIng}`
  );
  let data = await response.json();
  displayMeals(data.meals.slice(0, 20));
  $(".second-loading").fadeOut(300);
}

// get search by name
async function getSearchName(name) {
  recipeDetails.innerHTML = "";
  CloseMenu();
  recipeMenu.classList.remove("d-none");
  recipeDetails.classList.add("d-none");
  searchBox.classList.remove("d-none");
  $(".second-loading").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
  );
  let data = await response.json();
  if (data.meals) {
    displaySearchMeals(data.meals);
  } else {
    displaySearchMeals([]);
  }
  $(".second-loading").fadeOut(300);
}

// get search by letter
async function getSearchLetter(letter) {
  recipeMenu.innerHTML = "";
  recipeDetails.innerHTML = "";
  CloseMenu();
  recipeMenu.classList.remove("d-none");
  recipeDetails.classList.add("d-none");
  searchBox.classList.remove("d-none");
  $(".second-loading").fadeIn(300);
  if (letter == "") {
    letter = "a";
  }
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
  );
  let data = await response.json();
  if (data.meals) {
    displaySearchMeals(data.meals);
  } else {
    displaySearchMeals([]);
  }
  $(".second-loading").fadeOut(300);
}

// form
function displayContacts() {
  searchBox.innerHTML = "";
  searchBox.classList.add("d-none");
  recipeMenu.classList.remove("d-none");
  recipeMenu.innerHTML = "";
  recipeMenu.innerHTML = `<div
              class="d-flex justify-content-center align-items-center min-vh-100"
            >
              <div class="container w-75 text-center">
                <div class="row g-4">
                  <div class="col-md-6">
                    <input
                      type="text"
                      class="form-control"
                      id="formName"
                      placeholder="Enter Your Name"
                    /><div id="nameWarn" class="d-none alert alert-danger mt-2 w-100">
                      Special characters and numbers not allowed
                    </div>
                  </div>
                  <div class="col-md-6">
                    <input
                      type="email"
                      class="form-control"
                      id="formEmail"
                      placeholder="Enter Your Email"
                    /><div id="emailWarn" class="d-none alert alert-danger mt-2 w-100">
                      Email not valid *example@yyy.zzz
                    </div>
                  </div>
                  <div class="col-md-6">
                    <input
                      type="tel"
                      class="form-control"
                      id="formPhone"
                      placeholder="Enter Your Phone"
                    /><div id="phoneWarn" class="d-none alert alert-danger mt-2 w-100">
                      Enter valid Phone Number
                    </div>
                  </div>
                  <div class="col-md-6">
                    <input
                      type="number"
                      class="form-control"
                      id="formAge"
                      placeholder="Enter Your Age"
                    /><div id="ageWarn" class="d-none alert alert-danger mt-2 w-100">
                      Enter valid age
                    </div>
                  </div>
                  <div class="col-md-6">
                    <input
                      type="password"
                      class="form-control"
                      id="formPassword"
                      placeholder="Enter Your Password"
                    /><div id="passwordWarn" class="d-none alert alert-danger mt-2 w-100">
                      Enter valid password *Minimum eight characters, at least one letter and one number:*
                    </div>
                  </div>
                  <div class="col-md-6">
                    <input
                      type="password"
                      class="form-control"
                      id="formRepassword"
                      placeholder="Repassword"
                    /><div id="repasswordWarn" class="d-none alert alert-danger mt-2 w-100">
                      Enter valid repassword
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  class="btn btn-outline-danger mt-3 px-2"
                  disabled
                  id="submitBtn"
                >
                  Submit
                </button>
              </div>
            </div>`;

  submitBtn = document.getElementById("submitBtn");
  formName = document.getElementById("formName");
  formEmail = document.getElementById("formEmail");
  formAge = document.getElementById("formAge");
  formPhone = document.getElementById("formPhone");
  formPassword = document.getElementById("formPassword");
  formRepassword = document.getElementById("formRepassword");
  nameWarn = document.getElementById("nameWarn");
  emailWarn = document.getElementById("emailWarn");
  phoneWarn = document.getElementById("phoneWarn");
  ageWarn = document.getElementById("ageWarn");
  passwordWarn = document.getElementById("passwordWarn");
  repasswordWarn = document.getElementById("repasswordWarn");

  formName.addEventListener("keyup", validate);
  formEmail.addEventListener("keyup", validate);
  formAge.addEventListener("keyup", validate);
  formPhone.addEventListener("keyup", validate);
  formPassword.addEventListener("keyup", validate);
  formRepassword.addEventListener("keyup", validate);

  activeTyping();
}

function activeTyping() {
  formName.addEventListener("focus", () => {
    nameActive = true;
  });
  formEmail.addEventListener("focus", () => {
    emailActive = true;
  });
  formAge.addEventListener("focus", () => {
    ageActive = true;
  });
  formPhone.addEventListener("focus", () => {
    phoneActive = true;
  });
  formPassword.addEventListener("focus", () => {
    passwordActive = true;
  });
  formRepassword.addEventListener("focus", () => {
    repasswordActive = true;
  });
}

function validate() {
  nameValid = nameReg.test(formName.value);
  emailValid = emailReg.test(formEmail.value);
  phoneValid = phoneReg.test(formPhone.value);
  ageValid = ageReg.test(formAge.value);
  passwordValid = passwordReg.test(formPassword.value);
  if (nameActive) {
    if (nameValid) {
      nameWarn.classList.remove("d-block");
      nameWarn.classList.add("d-none");
    } else {
      nameWarn.classList.add("d-block");
      nameWarn.classList.remove("d-none");
    }
  }
  if (emailActive) {
    if (emailValid) {
      emailWarn.classList.remove("d-block");
      emailWarn.classList.add("d-none");
    } else {
      emailWarn.classList.add("d-block");
      emailWarn.classList.remove("d-none");
    }
  }
  if (phoneActive) {
    if (phoneValid) {
      phoneWarn.classList.remove("d-block");
      phoneWarn.classList.add("d-none");
    } else {
      phoneWarn.classList.add("d-block");
      phoneWarn.classList.remove("d-none");
    }
  }
  if (ageActive) {
    if (ageValid) {
      ageWarn.classList.remove("d-block");
      ageWarn.classList.add("d-none");
    } else {
      ageWarn.classList.add("d-block");
      ageWarn.classList.remove("d-none");
    }
  }
  if (passwordActive) {
    if (passwordValid) {
      passwordWarn.classList.remove("d-block");
      passwordWarn.classList.add("d-none");
    } else {
      passwordWarn.classList.add("d-block");
      passwordWarn.classList.remove("d-none");
    }
  }
  if (repasswordActive) {
    if (formPassword.value == formRepassword.value) {
      repasswordWarn.classList.remove("d-block");
      repasswordWarn.classList.add("d-none");
    } else {
      repasswordWarn.classList.add("d-block");
      repasswordWarn.classList.remove("d-none");
    }
  }
  if (
    nameValid &&
    emailValid &&
    phoneValid &&
    ageValid &&
    passwordValid &&
    formPassword.value == formRepassword.value
  ) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", true);
  }
}
