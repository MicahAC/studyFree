import Cookies from "js-cookie";
import { useState } from "react";
import "./Home.css";
import { useParams, Link } from "react-router-dom";

export default function Home() {
	const savedLists = Cookies.get();
	// const listNames = Object.keys(savedLists).filter(x=>x.startsWith("set:"))
	const [listNames, setListNames] = useState(
		Object.keys(savedLists).filter((x) => x.startsWith("set:")),
	);
	return (
		<div className="app">
			<header>
				<div className="logo"></div>
				<nav>
					<ul class="nav-list">
						<li class="nav-button">
							<a href="/">
								<button className="button-3d grey">Home</button>
							</a>
						</li>
					</ul>
				</nav>
			</header>
			<main className="button-container">
				<ul className="setList">
					{listNames.map((x) => {
						return (
							<li>
								<Link
									to={`/listEditor/${x.replace("set:", "")}`}
								>
									<button className="setButton">
										{x.replace("set:", "")}
									</button>
								</Link>
								<button
									className="setDeleteButton"
									onClick={() => {
										Cookies.remove(x);
										setListNames(
											Object.keys(Cookies.get()).filter(
												(x) => x.startsWith("set:"),
											),
										);
									}}
								>
									Delete
								</button>
							</li>
						);
					})}
				</ul>
			</main>
		</div>
	);
}
