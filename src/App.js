import React, { useState } from "react";
import "./App.css";
import Form from "./components/Form";
import SubWrapper from "./components/SubWrapper";
import SearchListItem from "./components/SearchListItem";

function App() {
    const [title, setTitle] = useState("");
    const [contents, setContents] = useState("");
    const [recipe, setRecipe] = useState("");
    const [condition, setCondition] = useState(null);

    const submitHandler = e => {
        e.preventDefault();
        if (!e.target.search.value) {
            alert("Type something");
            return;
        } else {
            setCondition("search");
            getData(e.target.search.value);
            e.target.search.value = "";
        }
    };

    const getData = input => {
        setRecipe("");
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`)
            .then(res => res.json())
            .then(result => {
                setTitle(`Search results for ${input}`);
                if (result.meals === null) {
                    setContents(<p>No result, please try again</p>);
                } else {
                    setContents(
                        result.meals.map(item => (
                            <SearchListItem
                                item={item}
                                key={item.idMeal}
                                getDataByID={getDataByID}
                            />
                        ))
                    );
                }
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
        setCondition("random");
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

        const getIngredients = ingredientsArr.map((ing, i) =>
            ing.amount !== null ? (
                isNaN(ing.amount) ? (
                    <span key={i}>
                        {ing.name} {ing.amount}
                    </span>
                ) : (
                    <span key={i}>
                        {ing.amount} {ing.name}
                    </span>
                )
            ) : (
                <span key={i}>{ing.name}</span>
            )
        );

        const instructions = data.strInstructions
            .split("\r\n")
            .map((item, i) => (item.length > 4 ? <p key={i}>{item}</p> : ""));

        const recipe = (
            <>
                <h2>{data.strMeal}</h2>
                <h4>{data.strArea}</h4>
                <img src={data.strMealThumb} alt={data.strMeal} />
                <div className="ingredients">{getIngredients}</div>
                <div className="instructions">{instructions}</div>
            </>
        );

        setRecipe(recipe);
    };

    return (
        <div className="App">
            <h1>Meal finder</h1>
            <Form submitHandler={submitHandler} getRandomMeal={getRandomMeal} />
            <SubWrapper
                title={title}
                contents={contents}
                recipe={recipe}
                condition={condition}
            />
        </div>
    );
}

export default App;
