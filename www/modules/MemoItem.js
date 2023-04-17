// Yarn Modules
import { Map, List } from "immutable";
import { createAction, handleActions } from "redux-actions";

// User Function
import { deleteMemo } from "api";
import { API_STATUS } from "meta";

deleteMemo
 // Initialize Global State
const initialState = Map({
	meta: Map({
		api_status: API_STATUS.INITIALIZATION
	})
});


// Declare Action Types
const _PREPARING = "MEMOITEM/PREPARING";
const _SUCCESS = "MEMOITEM/SUCCESS";
const _FAILURE = "MEMOITEM/FAILURE";
export const MEMOITEM_PREPARING = createAction(_PREPARING);
export const MEMOITEM_SUCCESS = createAction(_SUCCESS);
export const MEMOITEM_FAILURE = createAction(_FAILURE);


// Handle Actions
export default handleActions({
	[_PREPARING]: (state,action) => {
		return state.setIn(["meta","api_status"],API_STATUS.PREPARING);
	},
	[_SUCCESS]: (state,action) => {
		return state.setIn(["meta","api_status"],API_STATUS.SUCCESS);
	},
	[_FAILURE]: (state,action) => {
		return state.setIn(["meta","api_status"],API_STATUS.FAILURE);
	}
},initialState);


// Redux Chunk Middleware functions
export const deleteMemoAsChunk = (params) => {
	return (dispatch,getState) => {
		dispatch(MEMOITEM_PREPARING());

		return deleteMemo(params)
		.then((response) => {
			dispatch(MEMOITEM_SUCCESS());
			return {
				code: API_STATUS.SUCCESS,
				message: response.data.message,
				data: response.data.data.memolist
			}
		})
		.catch((error) => {
			dispatch(MEMOITEM_FAILURE());
			return {
				code: API_STATUS.FAILURE,
				message: error.message,
				data: {}
			}
		});
	}
}