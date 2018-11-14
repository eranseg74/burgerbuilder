import React, { Component } from 'react';

const asyncComponent = (importComponent) => {
	return class extends Component {
		state = {
			component: null
		}

		componentDidMount() {
			importComponent()
				.then(cmp => {
					this.setState({component: cmp.default});//this relies heavily on 'create-react-app' setup and on the type of the the function that 'importComponent()' points to
				});
		}

		render() {
			const C = this.state.component;

			return C ? <C {...this.props} /> : null;
		}
	}
}

export default asyncComponent;