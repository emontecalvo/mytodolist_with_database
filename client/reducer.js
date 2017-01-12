//import * as actions from './actions';

const initial_state = {
	spam: 'ham',
	paula: 'brillant [sic]',
};

export default function reducer(state=initial_state, action={}) {
	switch (action.type) {
		case 'SPAMIFY_SPAM':
			return {...state, spam: 'spam'};
		default: break;
	}
	return state;
}
