// Yarn Modules
import { Map, List } from "immutable";
import { createAction, handleActions } from "redux-actions";

// User Component
import { MESSENGER_THEME } from "meta";


// Initialize Global State
const initialState = Map({
	show: false ,
	message: '' ,
	theme: MESSENGER_THEME.BASIC
});


// Declare Action Types
const _SHOW = "MESSENGER/SHOW";
const _HIDE = "MESSENGER/HIDE";
export const MESSENGER_SHOW = createAction(_SHOW);
export const MESSENGER_HIDE = createAction(_HIDE);


// Create Action Handler
export default handleActions({
	[_SHOW]: (state,action) => {
		return state.set("show",true)
					.set("message",action.payload.message)
					.set("theme",action.payload.theme);
	},
	[_HIDE]: (state,action) => {
		return state.set("show",false)
					.set("message",'')
					.set("theme",MESSENGER_THEME.BASIC);
	}
},initialState);