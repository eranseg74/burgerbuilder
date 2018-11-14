import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
	return {
		type: actionTypes.AUTH_START
	};
};

export const authSuccess = (token, userId) => {
	return {
		type: actionTypes.AUTH_SUCCESS,
		idToken: token,
		userId: userId
	};
};

export const authFail = (error) => {
	return {
		type: actionTypes.AUTH_FAIL,
		error: error
	};
};

export const logout = () => {
	localStorage.removeItem('token');
	localStorage.removeItem('expirationDate');
	localStorage.removeItem('userId');
	return {
		type: actionTypes.AUTH_LOGOUT
	};
}

//this action gets the expiration time from firebase because the login is only for one hour. the 'expirationDate' is the time parameter that we get from firebase. then we set a time out so when the time ends we dispatch a syncronized action (the 'logout') to the reducer and there we will log the user out.
export const checkAuthTimeout = (expirationDate) => {
	return dispatch => {
		setTimeout(() => {
			dispatch(logout());
		}, expirationDate * 1000);//Important!!! the expiration time we get from firebase is in seconds and setTimout expects time in miliseconds. that is why we need to multiply it by 1000
	};
};

export const auth = (email, password, isSignup) => {
	return dispatch => {
		dispatch(authStart());
		const authData = {
			email: email,
			password: password,
			returnSecureToken: true//should always be true
		}
		//the address here is from the firebase website of the rest API. the key is given from my project on firebase -> authentication -> web setup
		let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyC7t3kflUvMlb-NkWNm7krBMyn_w9Q5w-0';
		if(!isSignup) {
			//this address is also given from 'firebase'. this endpoint is for signing in a user using email and password. the previous endpoint is for signup and not signin. this is for adjusting the url according to the mode (signup or signin)
			url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyC7t3kflUvMlb-NkWNm7krBMyn_w9Q5w-0';
		}
		axios.post(url, authData)
			.then(response => {
				//'expirationDate' - take the now time ('new Date().getTime()') and add the time to expire * 1000 because the time is in miliseconds. Wrap all of that in a 'new Date()' in order to turn it back to a date format!. new Date() without parameters gives us the current date while 'new Date()' with parameters gives us the date accourding to the date specified in the parameters 
				const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
				//localStorage is a local storage in the browser. we use it in order to keep our needed information so we will be able to use it even if the page is reloaded. without it, whenever we refresh the page all the data will be lost because it is like starting a whole new session of the application
				localStorage.setItem('token', response.data.idToken);
				localStorage.setItem('expirationDate',expirationDate);
				localStorage.setItem('userId',response.data.localId);
				dispatch(authSuccess(response.data.idToken, response.data.localId));
				dispatch(checkAuthTimeout(response.data.expiresIn));
			})
			.catch(err => {
				dispatch(authFail(err.response.data.error));
				//here we get the err object from firebase using axios. axios converts the json to jsx which contains the data. inside the data there is the error message
			})
	}
}

export const setAuthRedirectPath = (path) => {
	return {
		type: actionTypes.SET_AUTH_REDIRECT_PATH,
		path: path
	}
}

//this action is for executing/dispatching 'authSuccess' whenever we are logged in and also execut/dispatch 'checkAuthTimeout' and pass the 'expirationIn' amount to still have that functionality going
export const authCheckState = () => {
	return dispatch => {//this way is to run async code or multiple actions from within this action
		const token = localStorage.getItem('token');
		if(!token) {
			dispatch(logout());
		}else {
			const expirationDate = new Date(localStorage.getItem('expirationDate'));
			if(expirationDate <= new Date()) {//checks if the expirationDate is later then now. in that case we want to stay logged in
				dispatch(logout());
			}else {
				const userId = localStorage.getItem('userId');
				dispatch(authSuccess(token, userId));
				//checking how much time we have left in seconds -> we take the time when we will be logged out (future), turn it to seconds and then we subtract it with the current date (now) in seconds
				dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000 ));
			}
		}
	}
}