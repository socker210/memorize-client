// Yarn Packages
import React from "react";
import ReactDOM from "react-dom";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";

// User Components
import Wrapper from "./components/Wrapper";
import Reducer from "./modules/Reducer";

// CSS
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";


// Create Redux Store
// const store = createStore(Reducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(), applyMiddleware(thunk));
const store = createStore(Reducer, applyMiddleware(thunk));


// Rendering Wrapper Component to Browser
const container = document.getElementById("app");
ReactDOM.render(<Provider store={store}>
					<Wrapper />
				</Provider>, container);