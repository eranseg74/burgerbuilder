import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const addIngredient = (name) => {
	return {
		type: actionTypes.ADD_INGREDIENT,
		ingredientName: name
	};
};

export const removeIngredient = (name) => {
	return {
		type: actionTypes.REMOVE_INGREDIENT,
		ingredientName: name
	};
};

export const setIngredients = (ingredients) => {
	return {
		type: actionTypes.SET_INGREDIENTS,
		ingredients: ingredients
	};
};

export const fetchIngredientsFailed = () => {
	return {
		type: actionTypes.FETCH_INGREDIENTS_FAILED
	}
}

export const initIngredients = () => {
	return dispatch => {//here we return a function that recieves the dispatch function that we can use in the function body. Available only because of 'redux-thunk'!!!
		axios.get('https://react-my-burger-1299f.firebaseio.com/ingredients.json').then(response => {//this address comes without the '.json' from the firebase website. we have to add it in order to get the data from the database
			dispatch(setIngredients(response.data))
		}).catch(error => {
			dispatch(fetchIngredientsFailed())
		})
	};
};