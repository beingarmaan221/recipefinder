

    
    

const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const mealsGrid = document.getElementById("mealsGrid");
const status = document.getElementById("status");
const modal = document.getElementById("mealDetail");

let productData = [];


fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=noodles")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // productData = data.meals;
        
productData = data.meals;
displayMeals(productData)     
     

    })


    .catch(err =>{
        status.textContent = "Something went wrong!";
        console.log(err);
    });

    function displayMeals(meals) {
       if (!meals || meals.length === 0) {
            status.textContent = "No recipes found!";
            mealsGrid.innerHTML = "";
            return;

//             productData = data.meals;
// displayMeals(productData);
        }
        else {
            status.textContent = `Showing results for "${input.value}"`;
            mealsGrid.innerHTML = meals.map(meal => `
                <article class="card">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <div class="card-body">
                        <h3>${meal.strMeal}</h3>
                        <div class="badges">
                            <span class="badge">
                                ${meal.strCategory || "Recipe"}
                            </span>
                            <span class="badge badge-alt">
                                ${meal.strArea || "International"}
                            </span>
                        </div>
                        <button
                            class="btn"
                            onclick="getRecipeDetails('${meal.idMeal}')"
                        >
                            View Recipe
                        </button>
                    </div>
                </article>
            `).join("") } };
        


searchInput.addEventListener("input", function(e) {

    const query = input.value.trim();
    if (query) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(data => displayMeals(data.meals))
            .catch(err => console.log(err));
    } else {
        displayMeals(productData);
    }
})  




function getRecipeDetails(id) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];

            document.getElementById("detailImg").src = meal.strMealThumb;
            document.getElementById("detailTitle").textContent = meal.strMeal;




            document.getElementById("detailBadges").innerHTML = `
                <span class="badge">${meal.strCategory}</span>
                <span class="badge badge-alt">${meal.strArea}</span>
            `;

            let ingredients = "";

            for (let i = 1; i <= 20; i++) {
                const ingredient = meal[`strIngredient${i}`];
                const measure = meal[`strMeasure${i}`];

                if (ingredient && ingredient.trim() !== "") {
                    ingredients += `
                        <li>${measure} ${ingredient}</li>
                    `;
                }
            }

            document.getElementById("detailIngredients").innerHTML = ingredients;

            document.getElementById("detailInstructions").textContent =
                meal.strInstructions;

            document.getElementById("detailYoutube").href = meal.strYoutube;

            modal.classList.add("open");
        })
        .catch(err => {
            console.log(err);
        });
}


document.querySelector(".close").addEventListener("click", function() {
    modal.classList.remove("open");
});


document.querySelector(".modal-backdrop").addEventListener("click", function() {
    modal.classList.remove("open");
});

   
document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        modal.classList.remove("open");
    }
});
