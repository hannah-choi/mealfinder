import React from "react";

export default function SubWrapper({ title, contents, recipe, condition }) {
    return (
        <div className="subWrapper">
            <h3>{condition === "search" ? title : ""}</h3>
            <div
                className={condition === "random" ? "random visible" : "random"}
            >
                {condition === "random" ? recipe : ""}
            </div>
            <div className="contentsCol">
                <div className="contents">
                    <ul id="recipeUl">
                        {condition === "search" ? contents : ""}
                    </ul>
                </div>
            </div>
            <div className="recipeCol">
                {condition === "search" ? recipe : ""}
            </div>
        </div>
    );
}
