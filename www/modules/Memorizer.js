// Yarn Modules
import { Map, List } from "immutable";
import { createAction, handleActions } from "redux-actions";

// User Components
import { putMemo, getMemolist } from "api";
import { API_STATUS } from "meta"; 


// Initialize Global State
const initialState = Map({
	meta: Map({
		api_status: API_STATUS.INITIALIZATION
	})
})


// Declare Action Types
const _PREPARING = "MEMORIZER/PREPARING";
const _SUCCESS = "MEMORIZER/SUCCESS";
const _FAILURE = "MEMORIZER/FAILURE";
export const MEMORIZER_PREPARING = createAction(_PREPARING);
export const MEMORIZER_SUCCESS = createAction(_SUCCESS);
export const MEMORIZER_FAILURE = createAction(_FAILURE);


// Create Action Handler
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


// Redux chunk middleware functions
// Insert or Update Memo
export const putMemoAsChunk = (params) => {
	return (dispatch,getState) => {
		dispatch(MEMORIZER_PREPARING());

		return putMemo(params)
		.then((response) => {
			dispatch(MEMORIZER_SUCCESS(response));
			return {
				code: API_STATUS.SUCCESS,
				memo_id: response.data.data.memo_id,
				message: response.data.message
			}
		})
		.catch((err) => {
			dispatch(MEMORIZER_FAILURE(err));
			return {
				code: API_STATUS.FAILURE,
				message: err.message	
			}
		});
	}
};

// Get Memo
export const getMemoAsChunk = (params) => {
	return (dispatch,getState) => {
		dispatch(MEMORIZER_PREPARING());

		return getMemolist(params)
		.then((response) => {
			dispatch(MEMORIZER_SUCCESS(response));
			return {
				code: API_STATUS.SUCCESS,
				message: '',
				data: response
			}
		})
		.catch((err) => {
			dispatch(MEMORIZER_FAILURE(err));
			return {
				code: API_STATUS.FAILURE,
				message: err.message,
				data: null
			}
		});
	}
}