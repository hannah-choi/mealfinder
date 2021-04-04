import React from "react";

export default function SearchListItem({ item, getDataByID }) {
    return (
        <li className="thumb" data-id={item.idMeal}>
            <img
                src={item.strMealThumb}
                alt="img"
                onClick={() => getDataByID(item.idMeal)}
            />
            <span onClick={() => getDataByID(item.idMeal)}>{item.strMeal}</span>
        </li>
    );
}
