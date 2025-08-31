const gridContainer = document.querySelector(".grid-container");
const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";
const selectCategorie = document.getElementById("categorieSelect");
const selectArea = document.getElementById("areaSelect");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.querySelector(".search-Btn");
const fav = JSON.parse(localStorage.getItem("fav")) || [];
const saveFavToLocalStorage = () => {
  localStorage.setItem("fav", JSON.stringify(fav));
};
const fetchMeals = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/${query}`);
    if (response.status !== 200) {
      throw new Error("failed to fetch data");
    }
    const data = await response.json();
    console.log(data);
    if (data) {
      return data || [];
    }
  } catch (e) {
    console.log(e);
    return [];
  }
};

const renderCategories = async () => {
  const { meals } = await fetchMeals("list.php?c=list");
  meals.forEach((categorie) => {
    const option = document.createElement("option");
    option.value = categorie.strCategory;
    option.textContent = categorie.strCategory;
    selectCategorie.append(option);
  });
};
const renderAreas = async () => {
  const { meals } = await fetchMeals("list.php?a=list");
  meals.forEach((area) => {
    const option = document.createElement("option");
    option.value = area.strArea;
    option.textContent = area.strArea;
    selectArea.append(option);
  });
};

const renderMealCard = (meal) => {
  const mealDiv = document.createElement("div");
  mealDiv.className =
    "meal-card bg-white shadow-md rounded-lg overflow-hidden drop-shadow-2xl flex flex-col items-center p-4 hover:scale-105 transition-transform duration-300";

  const btnContent = fav.some((f) => f.idMeal === meal.idMeal);

  mealDiv.innerHTML = `
    <img src="${meal.strMealThumb}" alt="${
    meal.strMeal
  }" class="w-full h-40 object-cover rounded-lg mb-4">
    <a href="#" class="text-xl card-title font-semibold mb-2 hover:text-blue-500">${
      meal.strMeal
    }</a>
    <button class="bg-blue-500 favBtn text-white px-4 py-2 rounded hover:bg-blue-600">
      ${btnContent ? "unsave" : "save"}
    </button>
  `;

  mealDiv.setAttribute("data-id", meal.idMeal);
  return mealDiv;
};

const renderMeals = async () => {
  const { meals } = await fetchMeals("filter.php?a=Canadian");
  gridContainer.innerHTML = "";

  meals.forEach((meal) => gridContainer.appendChild(renderMealCard(meal)));
};
const addToFav = (e) => {
  if (e.target.classList.contains("favBtn")) {
    const mealCard = e.target.closest(".meal-card");
    if (!mealCard) return;

    const thumb = mealCard.querySelector("img").getAttribute("src");
    const title = mealCard.querySelector(".card-title").textContent;
    const id = mealCard.getAttribute("data-id");

    const isElementExist = fav.some((m) => m.idMeal === id);

    const cardBody = {
      strMeal: title,
      strMealThumb: thumb,
      idMeal: id,
    };

    if (!isElementExist) {
      fav.push(cardBody);
      e.target.textContent = "unsave";
    } else {
      const index = fav.findIndex((m) => m.idMeal === id);
      if (index !== -1) fav.splice(index, 1);
      e.target.textContent = "save";
    }

    saveFavToLocalStorage();
  }
};

const liveSearch = async () => {
  const motSearch = searchInput.value.trim().toLowerCase();
  gridContainer.innerHTML = "";

  if (!motSearch) {
    renderMeals();
    return;
  }

  const { meals } = await fetchMeals(`search.php?s=${motSearch}`);

  if (!meals) {
    gridContainer.innerHTML =
      "<p class='text-red-500 text-2xl m-auto'>No results found</p>";
    return;
  }

  meals.forEach((meal) => gridContainer.appendChild(renderMealCard(meal)));
};

const searchByWord = async () => {
  const searchValue = searchInput.value.trim().toLowerCase();
  if (!searchValue) {
    gridContainer.innerHTML =
      "<p class='text-gray-500'>Please enter a search term.</p>";
    return;
  }

  const { meals } = await fetchMeals(`search.php?s=${searchValue}`);
  gridContainer.innerHTML = "";

  if (!meals) {
    gridContainer.innerHTML =
      "<p class='text-red-500 text-2xl m-auto'>No results found</p>";
    return;
  }

  meals.forEach((meal) => gridContainer.appendChild(renderMealCard(meal)));
};

searchInput.addEventListener("input", liveSearch);
searchBtn.addEventListener("click", searchByWord);

renderMeals();
renderCategories();
renderAreas();
gridContainer.addEventListener("click", addToFav);
