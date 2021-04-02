const form = document.querySelector("form");
const search = form.querySelector("input[type=text]");
const shuffleBtn = document.getElementById("shuffle");
const contentsDiv = document.querySelector(".contents");
const recipeCol = document.querySelector(".recipeCol");
const recipeUl = document.getElementById("recipeUl");
const randomDiv = document.querySelector(".random");

form.addEventListener("submit", e => {
    e.preventDefault();
    getData(e.target.search.value);
    e.target.search.value = "";
});

const getData = input => {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`)
        .then(res => res.json())
        .then(result => {
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
            randomDiv.innerHTML = "";
            recipeUl.innerHTML = listItem;
        });
};

const getDataById = id => {
    fetch(
        `https://www.themealdb.com/api/json/v1/1/${
            id ? "lookup.php?i=" + id : "random.php"
        }`
    )
        .then(res => res.json())
        .then(result => {
            const data = result.meals[0];
            let ingredientsArr = [];
            for (let i = 0; i <= 20; i++) {
                if (data["strIngredient" + i]) {
                    ingredientsArr.push({
                        name: data["strIngredient" + i],
                        amount: data["strMeasure" + i],
                    });
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

            if (id) {
                randomDiv.innerHTML = "";
                recipeCol.innerHTML = recipe;
            } else {
                recipeCol.innerHTML = "";
                recipeUl.innerHTML = "";
                randomDiv.innerHTML = recipe;
            }
        });
};

shuffleBtn.addEventListener("click", e => {
    getDataById();
});

recipeUl.addEventListener("click", e => {
    getDataById(e.target.parentElement.dataset.id);
});
