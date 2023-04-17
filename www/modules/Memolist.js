// Yarn Modules
import { List, Map } from "immutable";
import { createAction, handleActions } from "redux-actions";

// User Components
import { getMemolist } from "api";
import { API_STATUS, PAGING_TYPE } from "meta";


// Initialize global State
const initialState = Map({
	// API Data
	data: Map({
		memolist: List([]),
		show: true,
		start_row: 0,
		offset: 10,
		prev: false,
		next: false
	}),
	// Metadata
	meta: Map({
		api_status: API_STATUS.INITIALIZATION
	})
})


// Declare Action Type
const _PREPARE = 'MEMOLIST/PREPARE';
const _SUCCESS = 'MEMOLIST/SUCCESS';
const _FAILRUE = 'MEMOLIST/FAILURE';
const _APPEAR = 'MEMOLIST/APPEAR';
const _APPEAR_ALL = 'MEMOLIST/APPEAR_ALL';
const _PAGING = 'MEMOLIST/PAGING';
export const MEMOLIST_PREPARE = createAction(_PREPARE);
export const MEMOLIST_SUCCESS = createAction(_SUCCESS);
export const MEMOLIST_FAILRUE = createAction(_FAILRUE);
export const MEMOLIST_APPEAR = createAction(_APPEAR);
export const MEMOLIST_APPEAR_ALL = createAction(_APPEAR_ALL);
export const PAGING = createAction(_PAGING);


// Create Action Handler
export default handleActions({
	// Prepare of call API
	[_PREPARE]: (state,action) => {
		return state.setIn(["meta","api_status"],API_STATUS.PREPARING);
	},
	// Success Call API
	[_SUCCESS]: (state,action) => {
		let { memo, meta } = action.payload.data.data.memolist[0];

		// Add client properties
		let memolist = memo.map((item) => {
			item["appear"] = state.getIn(["data","show"]);
			return item;
		});
		return state.setIn(["data","memolist"],List(memolist))
					.setIn(["data","prev"],meta.prev)
					.setIn(["data","next"],meta.next)
					.setIn(["meta","api_status"],API_STATUS.SUCCESS);
	},
	// Fail Call API
	[_FAILRUE]: (state,action) => {
		return state.setIn(["meta","api_status"],API_STATUS.FAILURE);
	},
	// Appear & Disappear title & subtitle
	[_APPEAR]: (state,action) => {
		let originArray = state.getIn(["data","memolist"]).toJS();
		let newArray = [...originArray.slice(0,action.payload.idx),
						Object.assign({},originArray[action.payload.idx],{
							appear: !originArray[action.payload.idx]["appear"]
						}),
						...originArray.slice(action.payload.idx+1,originArray.length)];
		return state.setIn(["data","memolist"],List(newArray));
	},
	// Appear & Disappear all 
	[_APPEAR_ALL]: (state,action) => {
		// new State
		let show = !state.getIn(["data","show"]);
		let newArray = state.getIn(["data","memolist"]).toJS().map((item) => {
			item["appear"] = show;
			return item;
		});

		return state.setIn(["data","show"],show)
			        .setIn(["data","memolist"],List(newArray));
	},
	[_PAGING]: (state,action) => {
		let start_row = state.getIn(["data","start_row"]);
		switch(action.payload)
		{
			case PAGING_TYPE.PREV:
				start_row -= state.getIn(["data","offset"]);
				break;
			case PAGING_TYPE.NEXT:
				start_row += state.getIn(["data","offset"]);
				break;
		}

		return state.setIn(["data","start_row"],start_row);
	}
},initialState);


// Redux chunk middleware functions
export const paging = (type) => {
	return (dispatch,getState) => {
		return Promise.resolve(dispatch(PAGING(type)));
	}
}

// Get Memolist from API Server
export const getMemolistAsChunk = (params) => {
	return (dispatch,getState) => {
		params = params || {
			start_row: getState().memolist.getIn(["data","start_row"]),
			offset: getState().memolist.getIn(["data","offset"])
		};

		// Dispatch Preparing
		dispatch(MEMOLIST_PREPARE());

		// Call API
		return getMemolist(params)
		.then((response) => {
			dispatch(MEMOLIST_SUCCESS(response));
			return {
				message: '',
				code: API_STATUS.SUCCESS
			}
		})
		.catch((error) => {
			dispatch(MEMOLIST_FAILRUE(error));
			return {
				message: error.message,
				code: API_STATUS.FAILURE
			}
		});
	}
}

// Update Memolist when finished delete
export const updateMemolistAsChunk = (memolist) => {
	return (dispatch,getState) => {
		// Dispatch Preparing
		dispatch(MEMOLIST_PREPARE());

		// Update memolist
		try 
		{
			// Fit to Success Action Handler
			let params = {
				data: {
					data: {
						memolist: memolist
					}
				}
			}
			dispatch(MEMOLIST_SUCCESS(params));
		}
		catch(err)
		{
			dispatch(MEMOLIST_FAILRUE(err));
		}
		
	}
}