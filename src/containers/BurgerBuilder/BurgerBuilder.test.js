import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { BurgerBuilder } from './BurgerBuilder';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

configure({adapter: new Adapter()});

describe('<BurgerBuilder />',() => {
	
	let wrapper;

	beforeEach(() => {
		//the <BurgerBuilder /> expects an onInitIngredients - since it is in the 'componentDidMount()' hook method. therefore we have to pass it. we are doing so as an empty function just to pass it
		wrapper = shallow(<BurgerBuilder onInitIngredients={() => {}}/>);
	});

	it('should render BuildControls when receicing ingredients', () => {
		wrapper.setProps({ings: {salad: 0}}); 
		expect(wrapper.find(BuildControls)).toHaveLength(1);
	});
});

