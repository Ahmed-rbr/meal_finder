const gridContainer = document.querySelector(".grid-container");
const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";
const selectCategorie = document.getElementById("categorieSelect");
const selectArea = document.getElementById("areaSelect");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.querySelector(".search-Btn");
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

const renderMeals = async () => {
  const { meals } = await fetchMeals("filter.php?a=Canadian");
  gridContainer.innerHTML = "";

  meals.forEach((meal) => {
    const mealDiv = document.createElement("div");
    mealDiv.classList.add(
      "meal-card",
      "bg-white",
      "shadow-md",
      "rounded-lg",
      "overflow-hidden",
      "drop-shadow-2xl",
      "flex",
      "flex-col",
      "items-center",
      "p-4",
      "hover:scale-105",
      "transition-transform",
      "duration-300"
    );

    mealDiv.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full h-40 object-cover rounded-lg mb-4">
      <a href="#" class="text-xl card-title font-semibold mb-2 hover:text-blue-500">${meal.strMeal}</a>
      <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save</button>
    `;

    gridContainer.appendChild(mealDiv);
  });
};
const liveSearch = async () => {
  const cards = await fetchMeals("filter.php?a=Canadian");
  const motSearch = searchInput.value.toLowerCase();
  gridContainer.innerHTML = "";

  cards.meals
    .filter((meal) => {
      const title = meal.strMeal.toLowerCase();

      return title.includes(motSearch);
    })
    .forEach((meal) => {
      const mealDiv = document.createElement("div");
      mealDiv.classList.add(
        "meal-card",
        "bg-white",
        "shadow-md",
        "rounded-lg",
        "overflow-hidden",
        "drop-shadow-2xl",
        "flex",
        "flex-col",
        "items-center",
        "p-4",
        "hover:scale-105",
        "transition-transform",
        "duration-300"
      );

      mealDiv.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full h-40 object-cover rounded-lg mb-4">
      <a href="#" class="text-xl card-title font-semibold mb-2 hover:text-blue-500">${meal.strMeal}</a>
      <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save</button>
    `;

      gridContainer.appendChild(mealDiv);
    });
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

  meals.forEach((meal) => {
    const mealDiv = document.createElement("div");
    mealDiv.className =
      "meal-card bg-white shadow-md rounded-lg overflow-hidden drop-shadow-2xl flex flex-col items-center p-4 hover:scale-105 transition-transform duration-300";

    mealDiv.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full h-40 object-cover rounded-lg mb-4">
      <a href="#" class="text-xl card-title font-semibold mb-2 hover:text-blue-500">${meal.strMeal}</a>
      <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save</button>
    `;

    gridContainer.appendChild(mealDiv);
  });
};

searchInput.addEventListener("input", liveSearch);
searchBtn.addEventListener("click", searchByWord);

renderMeals();
renderCategories();
renderAreas();
