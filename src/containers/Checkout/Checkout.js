import React, { Component } from 'react';
import CheckoutSummery from '../../components/Order/CheckoutSummery/CheckoutSummery';
import { Route, Redirect } from 'react-router-dom';
import ContactData from './ContactData/ContactData';
import { connect } from 'react-redux';

class Checkout extends Component {
/*

/////state and componentWillMount is needed when not using 'redux'. this is how it is done without 'redux':
	state = {
		ingredients: null,
		totalPrice: 0
	}

	componentWillMount() {
		const query = new URLSearchParams(this.props.location.search) ;
		const ingredients = {};
		let price = 0;
		for(let param of query.entries()) {
			if(param[0] === 'price') {
				price = param[1];
			} else {
				ingredients[param[0]] = +param[1];//the '+' sign turns a string to a number
			}
		}
		this.setState({ingredients: ingredients, totalPrice: price});
	}
*/

	checkoutCancelledHandler = () => {
		this.props.history.goBack();
	}

	checkoutContinuedHandler = () => {
		this.props.history.replace('/checkout/contact-data');
	}

	render() {
		//the 'summary' variable handles a case where in the start we don't have any ingredients and when trying to load the summary page will cause an error. the way it is handled here is by redirecting to the main page. if there are no ingredients we will be redirecting to the main page. otherwise we will proceed to the summary page
		let summary = <Redirect to="/"/>
		if(this.props.ings) {
			const purchasedRedirect = this.props.purchased ? <Redirect to="/" /> : null;
			summary = 
				<div>
					{purchasedRedirect}
					<CheckoutSummery ingredients={this.props.ings} checkoutCancelled={this.checkoutCancelledHandler} checkoutContinued={this.checkoutContinuedHandler}/>
					<Route path={this.props.match.path + '/contact-data'} component={ContactData}/>
				</div>
		}
		return summary;
	}
}

const mapStateToProps = state => {
	return {
		ings: state.burgerBuilder.ingredients,
		purchased: state.order.purchased
	};
};

export default connect(mapStateToProps)(Checkout);