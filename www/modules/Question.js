import { createAction, handleActions } from "redux-actions";
import { Map } from "immutable";
import { API_STATUS } from "meta";
import { fetchTest, saveQuestion, finishTest, stopTest } from "api";


// Initialize State
const initiaizeState = Map({
	test: {},
	meta: Map({
		api_state: API_STATUS.INITIALIZATION,
		api_state_save: API_STATUS.INITIALIZATION,
		api_state_finish: API_STATUS.INITIALIZATION,
		api_state_stop: API_STATUS.INITIALIZATION
	})
});

// Declare Actions 
const _PREPARE = "QUESTION/PREPARE";
const _SUCCESS = "QUESTION/SUCCESS";
const _FAILURE = "QUESTION/FAILURE";
const _SAVE_PREPARE = "QUESTION/SAVE_PREPARE";
const _SAVE_SUCCESS = "QUESTION/SAVE_SUCCESS";
const _SAVE_FAILURE = "QUESTION/SAVE_FAILURE";
const _FINISH_PREPARE = "QUESTION/FINISH_PREPARE";
const _FINISH_SUCCESS = "QUESTION/FINISH_SUCCESS";
const _FINISH_FAILURE = "QUESTION/FINISH_FAILURE";
const _STOP_PREPARE = "QUESTION/STOP_PREPARE";
const _STOP_SUCCESS = "QUESTION/STOP_SUCCESS";
const _STOP_FAILURE = "QUESTION/STOP_FAILURE";

// Create Actions
export const QUESTION_PREPARE = createAction(_PREPARE);
export const QUESTION_SUCCESS = createAction(_SUCCESS);
export const QUESTION_FAILURE = createAction(_FAILURE);
export const QUESTION_SAVE_PREPARE = createAction(_SAVE_PREPARE);
export const QUESTION_SAVE_SUCCESS = createAction(_SAVE_SUCCESS);
export const QUESTION_SAVE_FAILURE = createAction(_SAVE_FAILURE);
export const QUESTION_FINISH_PREPARE = createAction(_FINISH_PREPARE);
export const QUESTION_FINISH_SUCCESS = createAction(_FINISH_SUCCESS);
export const QUESTION_FINISH_FAILURE = createAction(_FINISH_FAILURE);
export const QUESTION_STOP_PREPARE = createAction(_STOP_PREPARE);
export const QUESTION_STOP_SUCCESS = createAction(_STOP_SUCCESS);
export const QUESTION_STOP_FAILURE = createAction(_STOP_FAILURE);

// Handle Actions
export default handleActions({
	// Fetch Question
	[_PREPARE]: (state,action) => {
		return state.setIn(["meta","api_state"],API_STATUS.PREPARING);
	},
	[_SUCCESS]: (state,action) => {
		return state.setIn(["meta","api_state"],API_STATUS.SUCCESS)
					.set("test",action.payload);
	},
	[_FAILURE]: (state,action) => {
		return state.setIn(["meta","api_state"],API_STATUS.FAILURE);
	},

	// Save Question
	[_SAVE_PREPARE]: (state,action) => {
		return state.setIn(["meta","api_state_save"],API_STATUS.PREPARING);
	},
	[_SAVE_SUCCESS]: (state,action) => {
		return state.setIn(["meta","api_state_save"],API_STATUS.SUCCESS);
	},
	[_SAVE_FAILURE]: (state,action) => {
		return state.setIn(["meta","api_state_save"],API_STATUS.FAILURE);
	},

	// Finish Test
	[_FINISH_PREPARE]: (state,action) => {
		return state.setIn(["meta","api_state_finish"],API_STATUS.PREPARING);
	},
	[_FINISH_SUCCESS]: (state,action) => {
		return state.setIn(["meta","api_state_finish"],API_STATUS.SUCCESS);
	},
	[_FINISH_FAILURE]: (state,action) => {
		return state.setIn(["meta","api_state_finish"],API_STATUS.FAILURE);
	},

	// Stop Test
	[_STOP_PREPARE]: (state,action) => {
		return state.setIn(["meta","api_state_fetch"],API_STATUS.PREPARING);
	},
	[_STOP_SUCCESS]: (state,action) => {
		return state.setIn(["meta","api_state_fetch"],API_STATUS.SUCCESS);
	},
	[_STOP_FAILURE]: (state,action) => {
		return state.setIn(["meta","api_state_fetch"],API_STATUS.FAILURE);
	}	
},initiaizeState);

// Call API
export const fetchTestAsChunk = () => {
	return (dispatch,getState) => {
		dispatch(QUESTION_PREPARE());

		return fetchTest()
		.then((response) => {
			dispatch(QUESTION_SUCCESS(response.data.data));
			
			return {
				code: response.data.code,
				message: response.data.message,
				state: API_STATUS.SUCCESS
			};
		})
		.catch((error) => {
			dispatch(QUESTION_FAILURE());
			return {
				code: 500,
				message: error.message,
				state: API_STATUS.FAILURE
			};
		});
	};
};

export const saveQuestionAsChunk = (params) => {
	return (dispatch,getState) => {
		dispatch(QUESTION_SAVE_PREPARE());

		return saveQuestion(params)
		.then((response) => {
			if (!response) throw {message: "Server Error!"};
			if (response.data.code !== 200) throw {message: response.data.message};
			dispatch(QUESTION_SAVE_SUCCESS());
			return {
				message: response.data.message,
				state: API_STATUS.SUCCESS
			};
		})
		.catch((error) => {
			dispatch(QUESTION_SAVE_FAILURE());
			return {
				message: error.message,
				state: API_STATUS.FAILURE
			};
		});
	};
};


export const finishTestAsChunk = () => {
	return (dispatch,getState) => {
		dispatch(QUESTION_FINISH_PREPARE());

		return finishTest()
		.then((response) => {
			if (!response) throw {message: "Server Error!"};
			if (response.data.code !== 200) throw {message: response.data.message};
			dispatch(QUESTION_FINISH_SUCCESS());
			return {
				message: response.data.message,
				state: API_STATUS.SUCCESS
			};
		})
		.catch((error) => {
			dispatch(QUESTION_FINISH_FAILURE());
			return {
				message: error.message,
				state: API_STATUS.FAILURE
			};
		});
	};
};

export const stopTestAsChunk = () => {
	return (dispatch,getState) => {
		dispatch(QUESTION_STOP_PREPARE());

		return stopTest()
		.then((response) => {
			if (!response) throw {message: "Server Error!"};
			if (response.data.code !== 200) throw {message: response.data.message};
			dispatch(QUESTION_STOP_SUCCESS());
			return {
				message: response.data.message,
				state: API_STATUS.SUCCESS
			};
		})
		.catch((error) => {
			dispatch(QUESTION_STOP_FAILURE());
			return {
				message: error.message,
				state: API_STATUS.FAILURE
			};
		});
	};
};