// Yarn Modules
import axios from "axios";


// Create Base API
const _api = {
	memolist: "/memo",
	check_test: "/check_test",
	start_test: "/start_test",
	test: "/test",
	test_res: "test_res"
}
const _axios = axios.create({
	baseURL: "https://memorizeforkw-server.herokuapp.com/api/v1"
	// baseURL: "http://localhost:5000/api/v1"
});


// API
// Get Memolist from API Server
export const getMemolist = (params) => {
	return _axios.get(_api.memolist,{
		params: params
	});
};

// Insert or Update Memo to API Server
export const putMemo = (params) => {
	return _axios.post(_api.memolist,params);
};

// Delete Memo
export const deleteMemo = (params) => {
	return _axios.delete(_api.memolist,{
		data: params
	});
}

// Check Test
export const checkTest = () => {
	return _axios.get(_api.check_test);
}

// Start Test
export const startTest = (params) => {
	return _axios.post(_api.start_test,params);
}

// Fetch Test
export const fetchTest = () => {
	return _axios.get(_api.test);
}

// Finish Test
export const finishTest = () => {
	return _axios.delete(_api.test);
}

// Save Question
export const saveQuestion = (params) => {
	return _axios.post(_api.test,params);
}

// Stop Test
export const stopTest = () => {
	return _axios.put(_api.test);
}

// Test Result
export const getTestResult = () => {
	return _axios.get(_api.test_res);
}