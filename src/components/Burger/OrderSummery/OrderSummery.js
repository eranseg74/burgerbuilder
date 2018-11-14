import React from 'react';
//import { Link } from 'react-router-dom';
import Aux from '../../../hoc/Aux/Aux';
import Button from '../../UI/Button/Button'

const orderSummery = (props) => {
	//This could be a functional component because all the checks are done in the modal class. We can delete the 'componentWillUpdate' here and turn it to a functional component
	// componentWillUpdate() {
	// 	console.log('[OrderSummery] WillUpdate');
	// }

	const ingredientSummery = Object.keys(props.ingredients)
	.map(igKey => {
		return (<li key={igKey}><span style={{textTransform: 'capitalize'}}>{igKey}</span>: {props.ingredients[igKey]}</li>);
	});

	return (
		<Aux>
			<h3>Your Order</h3>
			<p>A delicious burger with the following ingredients:</p>
			<ul>
				{ingredientSummery}
			</ul>
			<p><strong>Total Price: {props.price.toFixed(2)}</strong></p>
			<p>Continue to checkout?</p>
			<Button btnType="Danger" clicked={props.purchaseCanceled}>CANCEL</Button>
			<Button btnType="Success" clicked={props.purchaseContinued}>CONTINUE</Button>
		</Aux>
	);
}

export default orderSummery;