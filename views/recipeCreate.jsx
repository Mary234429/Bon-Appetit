const React = require('react');

const RecipeCreate = ({ title }) => (
    <div>
        <h1>{title}</h1>
        <form action="/" method="get">
            <button type="submit">Go to Main Page</button>
        </form>
        <p>Fill out the form below to create a custom recipe:</p>
        <form action="/recipeCreate" method="post">
            <input type="text" placeholder="Recipe Name" name="recipeName" id="recipeName"></input><br/>
            <textarea id="description" name="description" placeholder="Recipe Description"></textarea><br/>
            <ul id="ingredients">
                <li>
                    <input class="ingredientAmount" placeholder="Amount" id="ingredientAmount1" name="ingredientAmounts[]"></input>
                    <input class="ingredient" id="ingredient1" name="ingredients[]" placeholder="Ingredient 1"></input>
                </li>
                <li>
                    <input class="ingredientAmount" placeholder="Amount" id="ingredientAmount2" name="ingredientAmounts[]"></input>
                    <input class="ingredient" id="ingredient2" name="ingredients[]" placeholder="Ingredient 2"></input>
                </li>
            </ul>
            <ol id="instructions">
                <li><input id="instruction1" name="instructions[]" placeholder="Instruction"></input></li>
                <li><input id="instruction2" name="instructions[]" placeholder="Instruction"></input></li>
            </ol>
            <ul id="recipeTags">
                <li><input id="tag1" name="recipeTags[]" placeholder="Recipe Tag"></input></li>
                <li><input id="tag2" name="recipeTags[]" placeholder='Recipe Tag'></input></li>
            </ul>
            <input type="submit"></input>
        </form>
    </div>
);

module.exports = RecipeCreate;