import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
	ingredients: null,
	totalPrice: 4,
	error: false,
	building: false
};

const INGREDIENT_PRICES = {
	salad: 0.5,
	cheese: 0.4,
	meat: 1.3,
	bacon: 0.7
}

const setIngredients = (state, action) => {//a utility function to extract the code from the switch statement and thus making it cleaner. this can be implemented in all cases
	return updateObject(state,
		{ 
			ingredients: {
				salad: action.ingredients.salad,
				bacon: action.ingredients.bacon,
				cheese: action.ingredients.cheese,
				meat: action.ingredients.meat
			},
			totalPrice: 4,
			error: false,
			building: false
		}
	);
}

const fetchIngredientsFailed = (state, action) => {
	return updateObject(state, { error: true });
}

const reducer = (state = initialState, action) => {
	switch(action.type) {
		case actionTypes.ADD_INGREDIENT:
			return {
				...state,//creates a new object containing ingredients and totalPrice only
				ingredients: {
					...state.ingredients,//a new ingredient object with all the ingredients ('salad', 'bacon'...)
					[action.ingredientName]: state.ingredients[action.ingredientName] + 1//this line peaks an ingredient according to the ingredient name which we get as a payload in the action and then peaks the given ingredient in the ingredient array and sets the new value of that ingredient (-> +1)
				},
				totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
				building: true
			};
		case actionTypes.REMOVE_INGREDIENT:
		//an example of how to use the utilty function in order to reconstruct this function. The 'utility' function gets the old state and the new change (as an object) and returns a new object with both state and change:
			const updatedIngredient = { [action.ingredientName]: state.ingredients[action.ingredientName] - 1 }//must wrap the change in curley brackets because the utility function expects an object!
			const updatedIngredients = updateObject(state.ingredients, updatedIngredient);
			const updateState = {
				ingredients: updatedIngredients,
				totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName]
			}
			return updateObject(state, updateState);
		case actionTypes.SET_INGREDIENTS: return setIngredients(state, action);
		case actionTypes.FETCH_INGREDIENTS_FAILED: return fetchIngredientsFailed(state, action);
		default:
			return state;
	}
};

export default reducer;