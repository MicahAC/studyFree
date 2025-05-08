import "./Home.css";
import { Link } from "react-router-dom";

export default function Home() {
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
        <Link to="/listEditor" className="screensize">
          <button className="button-3d grey large-button">New List</button>
        </Link>
        <Link to="/list" className="screensize">
          <button className="button-3d grey large-button">Practice</button>
        </Link>
      </main>
    </div>
  );
}
