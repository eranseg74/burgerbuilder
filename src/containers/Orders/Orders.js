import React, { Component } from 'react';
import { connect } from 'react-redux';
import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component {

	// state = {
	// 	orders: [],
	// 	loading: true
	// }

	componentDidMount() {//remember! -> this lifecycle hook function is the best for fetching data from the router. don't need to use 'componentDidUpdate' since after fetching this object will re-render anyway
/*
		axios.get('/orders.json')
			.then(res => {
				const fetchedOrders = [];
				for(let key in res.data) {
					fetchedOrders.push({...res.data[key], id: key});
					//in order not to touch the 'res.data' we push a new element on every iteration. '...res.data[key]' creates a new object with the same properties as the 'res.data[key]' and we add the id on top of it
				}
				this.setState({loading: false, orders: fetchedOrders});
			}).catch(err => {
				this.setState({loading: false});
			})
	*/
	//---------CODE WITH REDUX------------------
	this.props.onFetchOrders(this.props.token, this.props.userId);
	}

	render() {
		let orders = <Spinner />;
		if(!this.props.loading) {
			orders = this.props.orders.map(order => (
				<Order 
					key={order.id}
					ingredients={order.ingredients}
					price={order.price} />
			))
		}
		return (
			<div>
				{orders}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		orders: state.order.orders,
		loading: state.order.loading,
		token: state.auth.token,
		userId: state.auth.userId
	};
};

const mapDispatchToProps = dispach => {
	return {
		onFetchOrders: (token, userId) => dispach(actions.fetchOrders(token, userId))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));