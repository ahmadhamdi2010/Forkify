import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { element, renderLoader , clearLoader} from './views/base';

const state = {};
window.state = state;

// Search Controller 

const controlSearch = async () =>{

    // get the search query from the interface
    //const query = document.querySelector('body > div > header > form > input').value
    const query = searchView.getInput();
    console.log(query);

    // check if the query is empty 
    if(query){

        // create new search objest with our query and add it to the state object
        state.search = new Search(query);

        try {

            // prepare the Ui for the resaults 
            searchView.clearInputValue();
            searchView.clearResults();
            renderLoader(element.searchRes);

            // preform the search 
            await state.search.getResaults();

            clearLoader();


            // display the resaults on UI 
            searchView.renderResults(state.search.results);

        } catch (error) {
            alert('search Error');
            clearLoader();

        }
    }
}

element.searchForm.addEventListener('submit', e=>{
    e.preventDefault();
    controlSearch();
});

element.searchResPages.addEventListener('click', e =>{

    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.results, goToPage);
        
    }
    //console.log(btn);

});


// Recipe Controller 

const controlRecipe = async ()=>{
    const id = window.location.hash.replace('#','');
    console.log(id);
    if(id){

        // prepare UI
        recipeView.clearRecipe();
        renderLoader(element.recipe);
        // Create new recipe 
        state.recipe = new Recipe(id);

        
        
        try {

            // get recipe data 
            await state.recipe.getResaults();
            state.recipe.parseIngeredients();
            //render recipe 
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
                );

        } catch (error) {
            alert("error procesing recipe : " + error);
            console.log(error)
        }
    }
};

window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe);

const controlList = ()=>{
    if(!state.list) state.list = new List();
    state.recipe.ingredients.forEach(el =>{
        const item = state.list.addItem(el.count,  el.unit, el.ingredient);
        listView.renderItem(item);
    });
}


element.shopping.addEventListener('click', e=>{

    const id = e.target.closest('.shopping__item').dataset.itemid;

    if(e.target.matches('.shopping__delete, .shopping__delete * ')){

        state.list.deleteItem(id);

        listView.deleteItem(id);

    }else if(e.target.matches('.shopping__count-value')){

        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);

    }

});





const controlLike = () => {

    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    if(!state.likes.isLiked(currentID)){

        const newLike = state.likes.addLike(

            currentID,
            state.recipe.title,
            state.recipe.source,
            state.recipe.img
        );

        likesView.toggleLikeBtn(true);

        likesView.renderLike(newLike);

    }else {

        state.likes.deleteLike(currentID);

        likesView.toggleLikeBtn(false);

        likesView.deleteLike(currentID);

    }

    likesView.toggleLikeMenue(state.likes.getNumLikes());

};

window.addEventListener('load', ()=>{

    state.likes = new Likes();

    state.likes.readStorage();

    likesView.toggleLikeMenue(state.likes.getNumLikes());

    state.likes.likes.forEach(like => likes.likesView.renderLike(like));

});

element.recipe.addEventListener('click', e=>{

    if(e.target.matches('.btn-decrease, .btn-decrease * ')){


        if(state.recipe.servings > 1){

            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }

        
    }else if(e.target.matches('.btn-increase, .btn-increase * ')){
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }else if (e.target.matches('.recipe__btn--add, .recipe__btn--add * ')){

        controlList();

    }else if (e.target.matches('.recipe__love, .recipe__love * ')){

        controlLike();

    }
    console.log(state.recipe);

});

window.l = new List();

