import React from "react";

export default function SubWrapper({ title, contents }) {
    return (
        <div class="subWrapper">
            <h2>{title}</h2>
            <div class="random"></div>
            <div class="contentsCol">
                <div class="contents">
                    <ul id="recipeUl">{contents}</ul>
                </div>
            </div>
            <div class="recipeCol"></div>
        </div>
    );
}
