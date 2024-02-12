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
            <textarea id="description" placeholder="Recipe Description"></textarea><br/>
            <ul id="ingredients">
                <li><input className="ingredientAmount" placeholder="Amount" id="ingredientAmount1"></input><input className="ingredient" id="ingredient1" placeholder="Ingredient 1"></input></li>
                <li><input className="ingredientAmount" placeholder="Amount" id="ingredientAmount2"></input><input className="ingredient" id="ingredient2" placeholder="Ingredient 2"></input></li>
            </ul>
            <ol id="instructions">
                <li><input id="instruction1" placeholder="Instruction"></input></li>
                <li><input id="instruction2" placeholder="Instruction"></input></li>
            </ol>
            <ul id="recipeTags">
                <li><input id="tag1" placeholder="Recipe Tag"></input></li>
                <li><input id="tag2" placeholder='Recipe Tag'></input></li>
            </ul>
            <input type="submit"></input>
        </form>
    </div>
);

module.exports = RecipeCreate;