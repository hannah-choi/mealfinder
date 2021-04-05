import React from "react";

export default function Form({ submitHandler, getRandomMeal }) {
    return (
        <form className="search" onSubmit={e => submitHandler(e)}>
            <input type="text" name="search" />
            <input type="submit" value="Search" />
            <input
                type="button"
                id="shuffle"
                value="Shuffle"
                onClick={getRandomMeal}
            />
        </form>
    );
}
