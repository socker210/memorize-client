import { Map } from "immutable";
import { createAction, handleActions } from "redux-actions";
import { startTest } from "api";
import { API_STATUS } from "meta";

const initializeState = Map({
	meta: Map({
		api_state: API_STATUS.INITIALIZATION
	})
});


// Declare Actions
const _PREPARE = "TESTTYPE/PREPARE";
const _SUCCESS = "TESTTYPE/SUCCESS";
const _FAILURE = "TESTTYPE/FAILURE";

// Create Actions
export const TESTYPE_PREPARE = createAction(_PREPARE);
export const TESTYPE_SUCCESS = createAction(_SUCCESS);
export const TESTYPE_FAILURE = createAction(_FAILURE);

// Handle Actions
export default handleActions({
	[_PREPARE]: (state,action) => {
		return state.setIn(["meta","api_state"],API_STATUS.PREPARING);
	},
	[_SUCCESS]: (state,action) => {
		return state.setIn(["meta","api_state"],API_STATUS.SUCCESS);
	},
	[_FAILURE]: (state,action) => {
		return state.setIn(["meta","api_state"],API_STATUS.FAILURE);
	}
},initializeState);

// Initialization Test
export const initializationTestAsChunk = (params) => {
	return (dispatch,getState) => {
		dispatch(TESTYPE_PREPARE());

		return startTest(params)
		.then((response) => {
			dispatch(TESTYPE_SUCCESS());
			return {
				state: API_STATUS.SUCCESS,
				message: response.data.message,
				code: response.data.code
			}
		})
		.catch((error) => {
			dispatch(TESTYPE_FAILURE());
			return {
				state: API_STATUS.FAILURE,
				message: error.message,
				code: response.data.code
			}
		});
	}
};