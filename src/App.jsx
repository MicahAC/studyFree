import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./Home";
import List from "./List";
import Practice from "./Practice";
import PracticeMenu from "./PracticeMenu";
import EditList from "./EditList";

const Main = () => {
	return (
		<Routes>
			<Route exact path="/" element={<Home />}></Route>
			<Route exact path="/listEditor" element={<List />}></Route>
			<Route path="/list" element={<Practice />}></Route>
			<Route path="/practice/:set" element={<PracticeMenu />}></Route>
			<Route path="/listEditor/:set" element={<List />}></Route>
			<Route path="/importEditor" element={<EditList />}></Route>
		</Routes>
	);
};

export default Main;
