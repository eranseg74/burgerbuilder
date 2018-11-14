//here we don't need enzyme because we are not testing any react components. we only testing normal javascript functions -> the reducer functions

import reducer from './auth';
import * as actionTypes from '../actions/actionTypes';

describe('auth reducer', () => {
	let wrapper;

	beforeEach(() => {

	});

	it('should return the initial state', () => {
		//here we execute the reducer we imported. we set the state to 'undefined' and an empty object as the action. we expect to get the initial state that is defined in the auth reducer in this case
		expect(reducer(undefined, {})).toEqual({
			token: null,
			userId: null,
			error: null,
			loading: false,
			authRedirectPath: '/'
		});
	});

	it('should store the token upon login', () => {
		expect(reducer({
			token: null,
			userId: null,
			error: null,
			loading: false,
			authRedirectPath: '/'
		}, {
			type: actionTypes.AUTH_SUCCESS,
			idToken: 'some-token',
			userId: 'some-user-id'
		})).toEqual({
			token: 'some-token',
			userId: 'some-user-id',
			error: null,
			loading: false,
			authRedirectPath: '/'
		})
	})
});