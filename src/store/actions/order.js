import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

//this is a syncronized action
export const purchaseBurgerSuccess = (id, orderData) => {//'id' is the id of the newly created order
	return {
		type: actionTypes.PURCHASE_BURGER_SUCCESS,
		orderId: id,
		orderData: orderData
	};
};

//this is a syncronized action
export const purchaseBurgerFail = (error) => {
	return {
		type: actionTypes.PURCHASE_BURGER_FAIL,
		error: error
	};
};

//this is an async action
export const purchaseBurger = (orderData, token) => {
	return dispatch => {
		dispatch(purchaseBurgerStart());//this is because we want to dispatch this action right from the start
		axios.post('/orders.json?auth=' + token, orderData)
			.then(response => {
				dispatch(purchaseBurgerSuccess(response.data.name, orderData));
		})
		.catch(error => {
				dispatch(purchaseBurgerFail(error))
		});
	}
}

//this is a syncronized action
export const purchaseBurgerStart = () => {
	return {
		type: actionTypes.PURCHASE_BURGER_START
	};
};

//this is a syncronized action
export const purchaseInit = () => {
	return {
		type: actionTypes.PURCHASE_INIT
	};
};

export const fetchOrdersSuccess = (orders) => {
	return {
		type: actionTypes.FETCH_ORDERS_SUCCESS,
		orders: orders
	};
};

export const fetchOrdersFail = (error) => {
	return {
		type: actionTypes.FETCH_ORDERS_FAIL,
		error: error
	};
};

export const fetchOrdersStart = () => {
	return {
		type: actionTypes.FETCH_ORDERS_START
	};
};

export const fetchOrders = (token, userId) => {
	return dispatch => {
		dispatch(fetchOrdersStart());
		//setting up a query parameter that will be sent to the backend in order to get the desired data accourding to the userId. '&orderBy' is an expression that 'firebase' understands and that allows us to get only the data relevant to a specific user
		//after the 'orderBy' we need to put "userId" because we want to send it as a string. that goes to the userId we are passing which also needs to be wrapped in the '"' sign. the final queryParams that will be passed to the backend will look like: "?auth=(the token value)&orderBy=userId&equalTo(userId value as a string)"
		const queryParams = '?auth='+token+'&orderBy="userId"&equalTo="'+userId+'"';
		axios.get('/orders.json' + queryParams)
			.then(res => {
				const fetchedOrders = [];
				for(let key in res.data) {
					fetchedOrders.push({...res.data[key], id: key});
					//in order not to touch the 'res.data' we push a new element on every iteration. '...res.data[key]' creates a new object with the same properties as the 'res.data[key]' and we add the id on top of it
			}
			dispatch(fetchOrdersSuccess(fetchedOrders));
		}).catch(err => {
			dispatch(fetchOrdersFail(err));
		})
	};
};

