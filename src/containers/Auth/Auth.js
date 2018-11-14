import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';
import { updateObject, checkValidity } from '../../shared/utility';
import classes from './Auth.css';

class Auth extends Component {
	state = {
		controls: {
			email: {
				elementType: 'input',
				elementConfig: {
					type: 'email',
					placeholder: 'Mail Address'
				},
				value: '',
				validation: {
					required: true,
					isEmail: true
				},
				valid: false,
				touched: false
			},
			password: {
				elementType: 'input',
				elementConfig: {
					type: 'password',
					placeholder: 'Password'
				},
				value: '',
				validation: {
					required: true,
					minLength: 6
				},
				valid: false,
				touched: false
			}
		},
		isSignup: true
	}

	componentDidMount() {
		if(!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
			this.props.onSetAuthRedirectPath();
		}
	}

	inputChangedHandler = (event, controlName) => {
	//Creating a new object based on the 'controls' object in the state. '[controlName]' points to the variable or object that has the name of the 'controlName' parameter that we recieved. this is first level deep cloning and that is the way to reach the 'value' and 'valid' which are properties inside the 'email' and 'password' which are the objects inside the 'controls' object
		const updateControls = updateObject(this.state.controls, {
			[controlName]: updateObject(this.state.controls[controlName], {
					value: event.target.value,
					valid: checkValidity(event.target.value, this.state.controls[controlName].validation),
					touched: true//whenever this function is executed it is because the user did something so it is definitely touched
			})
		});
		this.setState({controls: updateControls})
	}

	submitHandler = (event) => {
		event.preventDefault();//this is to prevent the reloading of the page whenever the form is submitted
		this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup);
	}

	switchAuthModeHandler = () => {
		this.setState(prevState => {
			return {isSignup: !prevState.isSignup};
		})
	}

	render() {
		const formElemetsArray = [];
		for(let key in this.state.controls) {
			formElemetsArray.push({
				id: key,
				config: this.state.controls[key]
			});
		}

		let form = formElemetsArray.map(formElement => (
			<Input 
				key={formElement.id}
				eType={formElement.id}
				elementType={formElement.config.elementType}
				elementConfig={formElement.config.elementConfig}
				value={formElement.config.value}
				invalid={!formElement.config.valid}
				shouldValidate={formElement.config.validation}
				touched={formElement.config.touched}
				changed={(event) => this.inputChangedHandler(event, formElement.id)}
			/>
		));

		if (this.props.loading) {
			form = <Spinner />
		}

		let errorMessage = null;

		if(this.props.error) {
			errorMessage = (
				<p>{this.props.error.message}</p>
				//this is possible bacause firebase gives us an error message! this might not allways be the case so we will have to adjust it according to the backend capabilities and our needs
			)
		}

		let authRedirect = null;
		if (this.props.isAuthenticated) {
			authRedirect = <Redirect to={this.props.authRedirectPath}/>
		}

		return (
			<div className={classes.Auth}>
				{authRedirect}
				{errorMessage}
				<form onSubmit={this.submitHandler}>
					{form}
					<Button btnType="Success">SUBMIT</Button>
				</form>
				<Button
					clicked={this.switchAuthModeHandler}
					btnType="Danger">SWITCH TO {this.state.isSignup ? 'SIGNIN' : 'SIGNUP'}</Button>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		loading: state.auth.loading,
		error: state.auth.error,
		isAuthenticated: state.auth.token !== null,
		buildingBurger: state.burgerBuilder.building,
		authRedirectPath: state.auth.authRedirectPath
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
		onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);