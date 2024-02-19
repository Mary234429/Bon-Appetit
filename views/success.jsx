import React from 'react';

const MainComponent = () => {
   return (
        <div>
            <h1>SNEAKY LOGIN</h1>
            <p>Welcome to the home page!</p>
            <form action="/dietTracker" method="get">
                <button type="submit">Go to Diet Tracker</button>
           </form>
           <form action="/recipeCreate" method="get">
                <button type="submit">Go to Recipe Create</button>
           </form>
           <form action="/contact" method="get">
               <button type="submit">Go to contact Page</button>
           </form>
           <form action="/dietPlanCreate" method="get">
               <button type="submit">Go to diet Plan Create</button>
           </form>
        </div>
    );
}

module.exports = MainComponent;