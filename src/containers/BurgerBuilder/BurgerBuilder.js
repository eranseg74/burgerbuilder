import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import axios from '../../axios-orders';
import OrderSummery from '../../components/Burger/OrderSummery/OrderSummery';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';

export class BurgerBuilder extends Component {//use export here only for test issues. we still exporting default 'BurgerBuilder' in the end of the file

	// constructor(props) { //this is also a way to define the state
	// 	super(props);
	// 	this.state = {...}
	// }

	state = {
		//totalPrice: 4,
		purchasing: false
	}

	componentDidMount() {
		this.props.onInitIngredients();
	}

	updatePurchaseState (ingredients) {
		const sum = Object.keys(ingredients).map(igKey => {
			return ingredients[igKey];
		}).reduce((sum, el) => {
			return sum + el;
		}, 0);
		return sum > 0;
	}
/*
	addIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type];
		const updatedCounted = oldCount + 1;
		const updatedIngredients = {//this will create a new
			...this.state.ingredients//object that will have the
		};//same values as the ingredients object so we will
		updatedIngredients[type] = updatedCounted;//not change
		//the original object itself!
		this.updatePurchaseState(updatedIngredients);
	}

	removeIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type];
		if (oldCount <= 0) {
			return;
		}
		const updatedCounted = oldCount - 1;
		const updatedIngredients = {//this will create a new
			...this.state.ingredients//object that will have the
		};//same values as the ingredients object so we will
		updatedIngredients[type] = updatedCounted;//not change
		//the original object itself!
		this.updatePurchaseState(updatedIngredients);
	}
*/
	purchaseHandler = () => {
		if(this.props.isAuthenticated) {
			this.setState({purchasing: true});
		}else {
			this.props.onSetAuthRedirectPath('/checkout');
			this.props.history.push('/auth');
		}
		
	}

	purchaseCancelHandler = () => {
		this.setState({purchasing: false});
	}

	//the below function is needed in order to pass the properties to the 'Checkout.js' container without 'Redux' using only 'queryParams'
/*
	purchaseContinueHandler = () => {
		//alert('You continue!');
		
		const queryParams = [];
		for(let i in this.state.ingredients) {
			//encodeURIComponent(i) - turns the expression 'i' to a valid url (turns spaces to %20 and so on...) in this for loop we are pushing 'salad=1' where 'salad' is the i expression and 1 is the value of that expression in the ingredients array
			queryParams.push(encodeURIComponent(i)+'='+encodeURIComponent(this.state.ingredients[i]))
		}
		queryParams.push('price=' + this.props.totalPrice);
		const queryString = queryParams.join('&');//turns the queryParams array to a string where values are seperated with the '&' sign as expected in a url

		this.props.history.push({
			pathname: '/checkout',
			search: '?'+queryString//needs to add the '?' sign so the browser will know where the search field begins
		});
	}
*/

	purchaseContinueHandler = () => {
		this.props.onInitPurchase();
		this.props.history.push('/checkout');
	}

	render() {
		const disabledInfo = {
			...this.props.ings
		};

		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0
		}//creates a new array -> {salad: true, meat: false...}

		let orderSummery = null;
		let burger = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

		if(this.props.ings) {
			burger = (
				<Aux>
					<Burger ingredients={this.props.ings} />
						<BuildControls 
							ingredientAdded = {this.props.onIngredientAdded} 
							ingredientRemoved = {this.props.onIngredientRemoved}
							disabled={disabledInfo}
							purchasable={this.updatePurchaseState(this.props.ings)}
							ordered={this.purchaseHandler}
							isAuth={this.props.isAuthenticated}
							price={this.props.totalPrice} />
				</Aux>
			);
			orderSummery = <OrderSummery 
						ingredients={this.props.ings}
						purchaseCanceled={this.purchaseCancelHandler}
						purchaseContinued={this.purchaseContinueHandler}
						price={this.props.totalPrice}/>;
		}
//with redux this if statement is not needed since we are not doing any async actions here, only in the action creators
		// if(this.state.loading) {
		// 	orderSummery = <Spinner />;
		// }

		return (
			<Aux>
				<Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
					{orderSummery}
				</Modal>
				{burger}
			</Aux>
		);
	}
}

const mapStateToProps = state => {
	return {
		ings: state.burgerBuilder.ingredients,
		totalPrice: state.burgerBuilder.totalPrice,
		error: state.burgerBuilder.error,
		isAuthenticated: state.auth.token !== null
	};
}

const mapDispatchToProps = dispatch => {
	return {
		onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
		onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
		onInitIngredients: () => dispatch(actions.initIngredients()),
		onInitPurchase: () => dispatch(actions.purchaseInit()),
		onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));