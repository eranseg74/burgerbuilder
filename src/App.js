import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import asyncComponent from './hoc/asyncComponent/asyncComponent';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
//import Checkout from './containers/Checkout/Checkout';
//import Orders from './containers/Orders/Orders';
//import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';
//Whenever we are importing somethisg we are telling the webpack to include this component or object to the project bundle. If we want Lazy Loading that is the oposite of what we want. We want to load the component dynamicly. Still, the webpack needs to be prepared to add the component when needed
const asyncCheckout = asyncComponent(() => {
	return import('./containers/Checkout/Checkout');
});

const asyncOrders = asyncComponent(() => {
	return import('./containers/Orders/Orders');
});

const asyncAuth = asyncComponent(() => {
	//this is a special dynamic import that tells us that whatever comes between the parenthasis is only imported when this function is executed. this function will only execute when we will render 'AsyncAuth' to the screen
	return import('./containers/Auth/Auth');
});

class App extends Component {

	componentDidMount() {
		this.props.onTryAutoSignup();
	}

  	render() {
  		let routes = (//the routing setup for unauthenticated users
  			<Switch>
	  			<Route path="/auth" component={asyncAuth} />
				<Route path="/" exact component={BurgerBuilder} />
				<Redirect to="/"/>
			</Switch>
		);

		if( this.props.isAuthenticated ) {
			routes = (//the routing setup for authenticated users
				<Switch>
					<Route path="/checkout" component={asyncCheckout} />
					<Route path="/orders" component={asyncOrders} />
				    <Route path="/logout" component={Logout} />
				    <Route path="/auth" component={asyncAuth} />
				    <Route path="/" exact component={BurgerBuilder} />
				    <Redirect to="/"/>
			    </Switch>
			);
		}
    	return (
      		<div>
       			<Layout>
			        {routes}
        		</Layout>
      		</div>
    	);
  	}
}

const mapStateToProps = state => {
	return {
		isAuthenticated: state.auth.token !== null
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onTryAutoSignup: () => dispatch(actions.authCheckState())
	};
};

//when wrapping our component with connect and also use routing, the component won't recieve the route. In this case we need to use the 'withRoute' high order component and wrap the connect with it like this:
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
//withRouter will enfource our props passed to the app component