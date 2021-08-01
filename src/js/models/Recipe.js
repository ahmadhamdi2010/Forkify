import axios from 'axios';



export default class Recipe{
    constructor(id){
        this.id = id;
    }
    async getResaults(){
        try{
            const apiKey = '73fe510c1c664593a854ab2fab3d2b1f'
    
            const res = await axios(`https://api.spoonacular.com/recipes/${this.id}/information?apiKey=${apiKey}`);
            this.title = res.data.title;
            this.source = res.data.sourceName;
            this.instructions = res.data.instructions;
            this.img = res.data.image;
            this.url = res.data.sourceUrl;
            this.cookingTime = res.data.readyInMinutes;
            this.servings = res.data.servings ;
            this.ingredients = res.data.extendedIngredients.map(x=>x.original);
            //console.log(this.results)
            console.log(res);
        
        }catch(error){
            alert(error);
        }
    }

    parseIngeredients(){

        const oldUnits = ['tablespoons','tablespoon','ounces','ounce','teaspoons','teapoon','cups','pounds'];
        const newUnits = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];
        const unitext = [...newUnits, 'kg','g'];

        const  newIngredients = this.ingredients.map(el =>{

            //uniform units 
            let  ingredient = el.toLowerCase();
            oldUnits.forEach((unit, i)=>{
                ingredient = ingredient.replace(unit, newUnits[i]);
            });
            //remove paranteses 
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //parse ingredients into count units and ingredients  ]

            const  ingArr = ingredient.split(' ');

            const  unitIndex = ingArr.findIndex(el2 => unitext.includes(el2));

            let ingObj;

            if (unitIndex > -1 ){

                const arrCount = ingArr.slice(0, unitIndex);
                let count;
                if(arrCount.length === 1){
                    count = eval(ingArr[0].replace('-','+'));
                }else {
                    // eval will preform  a calculation , after  joining  3 and 1/2 with a  + we have 3+1/2 and eval will return 3.5 
                    count = eval(ingArr.slice(0,unitIndex).join('+'))
                }
                ingObj = {
                    count,
                    unit : ingArr[unitIndex],
                    ingredient : ingArr.slice(unitIndex + 1 ).join(' ')
                };
            }else if (parseInt(ingArr[0],10)){
                ingObj = {
                    count : parseInt(ingArr[0],10),
                    unit : '',
                    ingredient : ingArr.slice(1).join(' ')
                }
            }else if(unitIndex === -1 ){
                ingObj = {
                    count : 1,
                    unit : '',
                    ingredient
                }
            }

            return ingObj;

        });

        this.ingredients = newIngredients;
    }

    updateServings(type){

        const newServings = type === 'dec' ? this.servings -1 : this.servings +1;

        this.ingredients.forEach(ing=>{

            ing.count *= (newServings/this.servings);

        });

        this.servings = newServings;
    }
}