const React = require('react');

const RecipeCreate = ({ title }) => (
    <div>
        <h1>{title}</h1>
        <form action="/" method="get">
            <button type="submit">Go to Main Page</button>
        </form>
        <p>Fill out the form below to create a custom recipe:</p>
        <form action="/recipeCreate" method="post">
            <input type="text" placeholder="Recipe Name" name="recipeName" id="recipeName"/><br/>
            <textarea id="description" placeholder="Recipe Description" name="description"></textarea><br/>

            <ul id="ingredients">
                <li>
                    <input class="ingredientAmount" placeholder="Amount" id="ingredientAmount1" name="ingredientAmount1"/>
                    <input class="ingredient" id="ingredient1" placeholder="Ingredient 1" name="ingredient1"/>
                </li>
                <li>
                    <input class="ingredientAmount" placeholder="Amount" id="ingredientAmount2" name="ingredientAmount2"/>
                    <input class="ingredient" id="ingredient2" placeholder="Ingredient 2" name="ingredient2"/>
                </li>
            </ul>

            <ol id="instructions">
                <li><input id="instruction1" placeholder="Instruction" name="instruction1"/></li>
                <li><input id="instruction2" placeholder="Instruction" name="instruction2"/></li>
           </ol>
 
            <ul id="recipeTags">
                <li><input id="tag1" placeholder="Recipe Tag" name="tag1"/></li>
                <li><input id="tag2" placeholder="Recipe Tag" name="tag2"/></li>
            </ul>

            <input type="submit" value="Submit"/>
        </form>
    </div>
);

module.exports = RecipeCreate;