import { createAction, handleActions } from "redux-actions";
import { Map } from "immutable";
import { API_STATUS } from "meta";
import { checkTest } from "api";

const initializeState = Map({
	api: Map({
		continuous: false
	}),
	meta: Map({
		api_state: API_STATUS.INITIALIZATION
	})
});

// Declare Actions
const _PREPARE = "TEST/PREPARE";
const _SUCCESS = "TEST/SUCCESS";
const _FAILURE = "TEST/FAILURE";
const _CONTINUOUS = "TEST/_CONTINUOUS";

//Create Actions
export const TEST_PREPARE = createAction(_PREPARE);
export const TEST_SUCCESS = createAction(_SUCCESS);
export const TEST_FAILURE = createAction(_FAILURE);
export const TEST_CONTINUOUS = createAction(_CONTINUOUS);

// Handle Action
export default handleActions({
	[_PREPARE]: (state,action) => {
		return state.setIn(["meta","api_state"],API_STATUS.PREPARING);
	},
	[_SUCCESS]: (state,action) => {
		return state.setIn(["meta","api_state"],API_STATUS.SUCCESS)
					.setIn(["api","continuous"],action.payload.data.data.continuous);
	},
	[_FAILURE]: (state,action) => {
		return state.setIn(["meta","api_state"],API_STATUS.FAILURE);
	},
	[TEST_CONTINUOUS]: (state,action) => {
		return state.setIn(["api","continuous"],action.payload.continuous);
	}
},initializeState);

// Call Test Checker
export const checkTestStateASChunk = () => {
	return (dispatch,getState) => {
		dispatch(TEST_PREPARE());

		return checkTest()
		.then((response) => {
			dispatch(TEST_SUCCESS(response));
			return {
				state: API_STATUS.SUCCESS,
				message: ""
			}
		})
		.catch((error) => {
			dispatch(TEST_FAILURE());
			return {
				state: API_STATUS.FAILURE,
				message: error.message
			}
		});
	};
};