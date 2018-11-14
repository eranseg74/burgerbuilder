import React from 'react';
import classes from './NavigationItem.css';
import { NavLink } from 'react-router-dom';

const navigationItem = (props) => (
	<li className={classes.NavigationItem}>
		<NavLink 
			to={props.link}
			exact={props.exact}
			activeClassName={classes.active}//this line sets up the active claasName reffering to my active class as defined in my css file
		>{props.children}</NavLink>
	</li>
);

export default navigationItem;