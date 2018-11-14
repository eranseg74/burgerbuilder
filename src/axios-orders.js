import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://react-my-burger-1299f.firebaseio.com/'
});

export default instance;