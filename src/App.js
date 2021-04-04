import React, { useState, useEffect } from "react";
import "./App.css";
import Form from "./components/Form";
import SubWrapper from "./components/SubWrapper";
import SearchListItem from "./components/SearchListItem";

function App() {
    const [title, setTitle] = useState("");
    const [contents, setContents] = useState("");

    const submitHandler = e => {
        e.preventDefault();
        if (!e.target.search.value) {
            alert("Type something");
            return;
        } else {
            getData(e.target.search.value);
            e.target.search.value = "";
        }
    };

    const getData = input => {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`)
            .then(res => res.json())
            .then(result => {
                setTitle(`Search results for ${input}`);
                result.meals === null
                    ? //clearDom([randomDiv, recipeUl]);
                      setContents(<p>No result, please try again</p>)
                    : setContents(
                          result.meals.map(item => (
                              <SearchListItem
                                  item={item}
                                  key={item.idMeal}
                                  getDataByID={getDataByID}
                              />
                          ))
                      );
                // clearDom([randomDiv]);
                // recipeUl.innerHTML = searchResult + listItem;
            });
    };

    //when click an item in the list, fetch the exact meal
    const getDataByID = id => {
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
    };

    return (
        <div className="App">
            <h1>Meal finder</h1>
            <Form submitHandler={submitHandler} />
            <SubWrapper title={title} contents={contents} />
        </div>
    );
}

export default App;
