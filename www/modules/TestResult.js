import { createAction, handleActions } from "redux-actions";
import { Map } from "immutable";
import { getTestResult } from "api";
import { API_STATUS } from "meta";

// Declare State
const initializeState = Map({
	data: [],
	meta: Map({
		api_state: API_STATUS.INITIALIZATION
	})
});

// Declare Actions
const _PREPARE = "TEST_RESULT/PREPARE";
const _SUCCESS = "TEST_RESULT/SUCCESS";
const _FAILURE = "TEST_RESULT/FAILURE";

// Create ACtions
export const TEST_RESULT_PREPARE = createAction(_PREPARE);
export const TEST_RESULT_SUCCESS = createAction(_SUCCESS);
export const TEST_RESULT_FAILURE = createAction(_FAILURE);

// Handle Actions
export default handleActions({
	[_PREPARE]: (state,action) => {
		return state.setIn(["meta","api_states"],API_STATUS.PREPARING);
	},
	[_SUCCESS]: (state,action) => {
		return state.setIn(["meta","api_states"],API_STATUS.SUCCESS)
					.set("data",action.payload);
	},
	[_FAILURE]: (state,action) => {
		return state.setIn(["meta","api_states"],API_STATUS.FAILURE);
	}
},initializeState);

// Call API
export const getTestResultAsChunk = () => {
	return (dispatch,getState) => {
		dispatch(TEST_RESULT_PREPARE());

		return getTestResult()
		.then((response) => {
			if (!response) throw {message: "API Caller Error"};
			if (response.data.code !== 200) throw {message: response.data.message};

			dispatch(TEST_RESULT_SUCCESS(response.data.data));
			return {
				state: API_STATUS.SUCCESS,
				message: response.data.message
			}
		})
		.catch((error) => {
			dispatch(TEST_RESULT_FAILURE());
			return {
				state: API_STATUS.FAILURE,
				message: error.message
			}
		});
	};
};