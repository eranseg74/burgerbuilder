import React from 'react';

import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import Backdrop from '../../UI/Backdrop/Backdrop';
import Aux from '../../../hoc/Aux/Aux';

import classes from './SideDrawer.css';
//when we want to do something before returning JSX we should start with the '{}' sign. Otherwise it is ok just to start with '()'
const sideDrawer = (props) => {
	let attachedClasses = [classes.SideDrawer, classes.Close];
	if(props.open) {
		attachedClasses = [classes.SideDrawer, classes.Open];
	}
	return (
		<Aux>
			<Backdrop show={props.open} clicked={props.closed}/>
			<div className={attachedClasses.join(' ')} onClick={props.closed}>
				<div className={classes.Logo}>
					<Logo />
				</div>
				<nav>
					<NavigationItems isAuthenticated={props.isAuth}/>
				</nav>
			</div>
		</Aux>
	);
};

export default sideDrawer;