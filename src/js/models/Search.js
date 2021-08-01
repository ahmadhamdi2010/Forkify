import axios from 'axios';



export default class Search{
    constructor(query){
        this.query = query;
    }
    async getResaults(){
        try{
            const apiKey = '73fe510c1c664593a854ab2fab3d2b1f'
    
            const res = await axios(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${this.query}`);
            this.results = res.data.results
            //console.log(this.results)
            
        
        }catch(error){
            alert(error);
        }
    }
}