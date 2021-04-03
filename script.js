const form = document.querySelector("form");
const search = form.querySelector("input[type=text]");
const shuffleBtn = document.getElementById("shuffle");
const contentsDiv = document.querySelector(".contents");
const recipeCol = document.querySelector(".recipeCol");
const recipeUl = document.getElementById("recipeUl");
const randomDiv = document.querySelector(".random");

//get a list of meals matching with search input
const getData = input => {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`)
        .then(res => res.json())
        .then(result => {
            const searchResult = `<p>Search results for "${input}"</p>`;
            if (result.meals === null) {
                clearDom([randomDiv, recipeUl]);
                searchResult + `<p>No result, please try again</p>`;
            }
            const listItem = result.meals
                .map(
                    item =>
                        `<li class="thumb" data-id=${item.idMeal}>
                            <img src=${item.strMealThumb}>
                            <span>${item.strMeal}</span>
                         </li>
                        `
                )
                .join("");
            clearDom([randomDiv]);
            recipeUl.innerHTML = searchResult + listItem;
        });
};

//when click an item in the list, fetch the exact meal
const getDataById = id => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${+id}`)
        .then(res => res.json())
        .then(result => {
            if (result.meals) {
                const data = result.meals[0];
                addMealToDOM(data, "id");
            }
        });
};

//get a random meal
const getRandomMeal = () => {
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(result => {
            const data = result.meals[0];
            addMealToDOM(data, "random");
        });
};

//render recipe to the DOM
const addMealToDOM = (data, param) => {
    let ingredientsArr = [];
    for (let i = 1; i <= 20; i++) {
        if (data[`strIngredient${i}`]) {
            ingredientsArr.push({
                name: `${data[`strIngredient${i}`]}`,
                amount: `${data[`strMeasure${i}`]}`,
            });
        } else {
            break;
        }
    }

    const getIngredients = ingredientsArr
        .map(ing =>
            ing.amount !== null
                ? isNaN(ing.amount)
                    ? `<span>${ing.name} ${ing.amount}</span>`
                    : `<span>${ing.amount} ${ing.name}</span>`
                : `<span>${ing.name}</span>`
        )
        .join("");

    const instructions = data.strInstructions
        .split("\r\n")
        .map((item, i) => {
            if (item.length > 4) {
                return `<p>${item}</p>`;
            }
        })
        .join("");

    const recipe = `
                <h2>${data.strMeal}</h2>
                <h4>${data.strArea}</h4>
                <img src=${data.strMealThumb}>
                <div class="ingredients">${getIngredients}</div>
                <div class="instructions">${instructions}</div>
                `;

    //When it's from search result
    if (param === "id") {
        clearDom([randomDiv]);
        recipeCol.innerHTML = recipe;
    } else {
        //when it's from shuffle
        clearDom([recipeCol, recipeUl]);
        randomDiv.innerHTML = recipe;
    }
};

const clearDom = arr => {
    arr.forEach(item => (item.innerHTML = ""));
};

//events

shuffleBtn.addEventListener("click", e => {
    getRandomMeal();
});

form.addEventListener("submit", e => {
    e.preventDefault();
    if (!e.target.search.value) {
        alert("Type something");
        return;
    } else {
        getData(e.target.search.value);
        e.target.search.value = "";
    }
});

recipeUl.addEventListener("click", e => {
    getDataById(e.target.parentElement.dataset.id);
});
