import React from 'react';

import { configure, shallow } from 'enzyme';//importing enzyme lets us render a component without having to render the whole page.
//shallow is a function that renders the component and all of its content, but the content is not deeply rendered
import Adapter from 'enzyme-adapter-react-16';//this adapter is the connector of react to enzyme. we can call it whatever we like

import NavigationItems from './NavigationItems';
import NavigationItem from './NavigationItem/NavigationItem';


configure({adapter: new Adapter()});//here we are connecting react to enzyme

//describe is a test function in the create-react-app that gets two parameters: one is the description of the the test that will be shown in the results, and the other one is the function where we define the test.
//this function always starts with 'it' (individual test) and it also gets two parameters - the description as a string that will apear in the console. usually it used to comlete the sentence. The strings are not parsed and they are only a utility to tell us what the test and the results are all about. we can write there whatever we want
describe('<NavigationItems>', () => {
	let wrapper;
	//if we have a case like here when we want to test the same component we can use that function
	beforeEach(() => {//beforeEach takes a function as an argument that will be executed before each test
		wrapper = shallow(<NavigationItems />);//shallow accepts JSX
	});

	it('should render two <NavigationItem /> elements if not authenticated', () => {//our actual testing logic
		expect(wrapper.find(NavigationItem)).toHaveLength(2);
	});

	it('should render three <NavigationItem /> elements if authenticated', () => {
		//wrapper = shallow(<NavigationItems isAuthenticated/>)//passing 'isAuthenticated' like this will always pass it as true. in order to use the beforeEach and add the is Authenticated we write:
		wrapper.setProps({isAuthenticated: true});
		expect(wrapper.find(NavigationItem)).toHaveLength(3);
	});

	it('should render <NavigationItem link="/logout" /> elements if authenticated', () => {
		wrapper.setProps({isAuthenticated: true});
		expect(wrapper.contains(<NavigationItem link='/logout'>Logout</NavigationItem>)).toEqual(true);
	});
});