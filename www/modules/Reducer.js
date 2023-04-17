// Yarn Modules
import { combineReducers } from "redux";

// User Modules
import Memolist from "./Memolist";
import Messenger from "./Messenger";
import Memorizer from "./Memorizer";
import MemoItem from "./MemoItem";
import Test from "./Test";
import TestType from "./TestType";
import Question from "./Question";
import TestResult from "./TestResult";


// Export list
export * from "./Memolist";
export * from "./Messenger";
export * from "./Memorizer";
export * from "./MemoItem";
export * from "./Test";
export * from "./TestType";
export * from "./Question";
export * from "./TestResult";


// Combine Reducers
export default combineReducers({
	memolist:Memolist,
	messenger:Messenger,
	memorizer:Memorizer,
	memoitem:MemoItem,
	test:Test,
	testtype:TestType,
	question: Question,
	testresult: TestResult
});