import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
	orders: [],
	loading: false,
	purchased: false
};

const purchaseInit = (state, action) => {
	return updateObject(state, { purchased: false });
}

const purchaseSuccess = (state, action) => {
	const newOrder = updateObject(action.orderData, { id: action.orderId });
	return updateObject(state, {
		loading: false,
		purchased: true,
		orders: state.orders.concat(newOrder)
	});
}

const purchaseFail = (state, action) => {
	return updateObject(state, { loading: false }); 
}

const purchaseStart = (state, action) => {
	return updateObject(state, { loading: true }); 
}

const fetchOrdersStart = (state, action) => {
	return updateObject(state, { loading: true }); 
}

const fetchOrdersSuccess = (state, action) => {
	return updateObject(state, {
		loading: false,
		orders: action.orders
	}); 
}

const fetchOrdersFail = (state, action) => {
	return updateObject(state, { loading: false }); 
}

const reducer = (state=initialState, action) => {
	//using the 'utility' function in all the cases of the 'switch' statement.
	//the way without the 'utility' is commented. Be aware of the notes in the
	//code that was commented!!!!
	switch (action.type) {
		case actionTypes.PURCHASE_INIT: return purchaseInit(state, action);
		case actionTypes.PURCHASE_BURGER_SUCCESS: return purchaseSuccess(state, action);
		case actionTypes.PURCHASE_BURGER_FAIL: return purchaseFail(state, action);
		case actionTypes.PURCHASE_BURGER_START: return purchaseStart(state, action);
		case actionTypes.FETCH_ORDERS_START: return fetchOrdersStart(state, action);
		case actionTypes.FETCH_ORDERS_SUCCESS: return fetchOrdersSuccess(state, action);
		case actionTypes.FETCH_ORDERS_FAIL: return fetchOrdersFail(state, action);
		default: return state;
	}
/*
	switch (action.type) {
		case actionTypes.PURCHASE_INIT:
			return {
				...state,
				purchased: false
			}
		case actionTypes.PURCHASE_BURGER_SUCCESS:
			const newOrder = {//the action gives us the orderData and the order id (see: order.js in the actions). here we merge them into one object and add it to the 'orders' array using 'concat'
				...action.orderData,
				id: action.orderId
			}
			return {
				...state,
				loading: false,
				purchased: true,
				orders: state.orders.concat(newOrder) 
			};
		case actionTypes.PURCHASE_BURGER_FAIL:
			return {//we are not handeling the error here because we handle
				...state,//the eror with the 'withErrorHandler' high order
				loading: false,//function that wraps the 'order' container
			};
		case actionTypes.PURCHASE_BURGER_START:
			return {
				...state,
				loading: true
			}
		case actionTypes.FETCH_ORDERS_START:
			return {
				...state,
				loading: true
			}
		case actionTypes.FETCH_ORDERS_SUCCESS:
			return {
				...state,
				loading: false,
				orders: action.orders
			}
		case actionTypes.FETCH_ORDERS_FAIL:
			return {
				...state,
				loading: false
			}
		default:
			return state;
	}
*/
};

export default reducer;