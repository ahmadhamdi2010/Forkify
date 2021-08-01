import { element } from './base';


export const getInput = () => element.searchInput.value;
export const clearInputValue = () => {element.searchInput.value =''};
export const clearResults = () => {
    element.resultsList.innerHTML ='';
    element.searchResPages.innerHTML ='' 
};


export const limitTitle = (title, limit=17)=>{
    const newTitle = [];
    if(title.length>limit){

        title.split(' ').reduce((acc, cur)=>{
            if(acc + cur.length <= limit){
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        return `${newTitle.join(' ')} ...`; 
    }
    return title;
}

const renderSingleRecipe = recipe =>{

    const html = 
    `
        <li>
            <a class="results__link " href="#${recipe.id}">
                <figure class="results__fig">
                    <img src="${recipe.image}" alt="Test">
                </figure>
                <div class="results__data">
                    <h4 alt="${recipe.title}" class="results__name">${limitTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.id}</p>
                </div>
            </a>
        </li>
    
    `;

    element.resultsList.insertAdjacentHTML('beforeend',html);

};

const creatBtn = (page,type)=>`

    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page -1 : page +1}>
        <span>Page ${type === 'prev' ? page -1 : page +1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
    `;

const renderButtons = (page, numResults, resPerPage)=>{
    const pages = Math.ceil(numResults/resPerPage) ;
    let button;
    if(page===1 && pages>1){
        button = creatBtn(page,'next');
    }else if(page <= pages){
        button = `
            ${creatBtn(page,'prev')}
            ${creatBtn(page,'next')}
         `;

    }else if(page===pages && pages>1 ){

        button = creatBtn(page,'prev');

    }

    element.searchResPages.insertAdjacentHTML('afterbegin', button);

};

export const renderResults = (recipes, page = 1,resPerPage = 5) => {
    const start = (page-1)*resPerPage;
    const end = page*resPerPage;
    recipes.slice(start,end).forEach(el => renderSingleRecipe(el));
    renderButtons(page, recipes.length,resPerPage);
};


