import Cookies from "js-cookie";
import { useState, useEffect, useRef } from "react";
import "./Home.css";
import { useParams } from "react-router-dom";
import Question from "./question";

// Helper to shuffle an array
function shuffleArray(array) {
	const arr = [...array];
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

// Helper to shuffle answers and update answerIndex
function shuffleAnswers(answers, answerIndex) {
	const arr = [...answers];
	const correctAnswer = arr[answerIndex];
	arr[answerIndex] = true;
	const shuffled = shuffleArray(arr);
	let newIndex = shuffled.findIndex(x => x === true);
	shuffled[newIndex] = correctAnswer;
	return [shuffled, newIndex];
}

export default function PracticeMenu() {
	const param = useParams()["set"];
	const savedLists = Cookies.get();
	const currentList = JSON.parse(savedLists["set:" + param]).questions;
	const [questionTitle, setTitle] = useState("");
	const [correctDisplay, setCorrect] = useState(0);
	const [incorrectDisplay, setIncorrect] = useState(0);

	const [questions, setQuestions] = useState(() => {
		return shuffleArray(currentList.map(q => {
			const [shuffledAnswers, newIndex] = shuffleAnswers(q.answers, q.answerIndex);
			return {
				...q,
				answers: shuffledAnswers,
				answerIndex: newIndex
			};
		}));
	});

	const [questionNum, setQuestionNum] = useState(0);

	const correctCountRef = useRef(0);
	const incorrectCountRef = useRef(0);

	const currentQuestion = questions[questionNum];

	function nextQuestion(reset = false) {
		if (reset) {
			const reshuffled = shuffleArray(questions.map(q => {
				const [shuffledAnswers, newIndex] = shuffleAnswers(q.answers, q.answerIndex);
				return {
					...q,
					answers: shuffledAnswers,
					answerIndex: newIndex
				};
			}));
			setQuestions(reshuffled);
			setQuestionNum(0);
		} else {
			setQuestionNum(qn => qn + 1);
		}
	}

	function correct() {
		setTitle("Correct");
		correctCountRef.current += 1;
		setCorrect(correctCountRef.current);
		const isLast = questionNum === questions.length - 1;
		setTimeout(() => {
			setTitle("");
			nextQuestion(isLast);
		}, 500);
	}

	function incorrect() {
		setTitle(`Incorrect - Answer: ${currentQuestion.answers[currentQuestion.answerIndex]}`);
		incorrectCountRef.current += 1;
		setIncorrect(incorrectCountRef.current);
		const isLast = questionNum === questions.length - 1;
		setTimeout(() => {
			setTitle("");
			nextQuestion(isLast);
		}, 2000);
	}

	return (
		<div className="app">
			<header>
				<div className="logo"></div>
				<nav>
					<ul className="nav-list">
						<li className="nav-button">
							<a href="/">
								<button className="button-3d grey">Home</button>
							</a>
						</li>
					</ul>
				</nav>
			</header>
			<div className="practiceMenuTitle">{param}</div>
			<ul className="nav-list">
				<li className="scoreCount">{correctDisplay}</li>
				<li className="scoreCount red">{incorrectDisplay}</li>
			</ul>
			<div className="question-box">
				<div className="question-text">
					{currentQuestion.question}
				</div>
				<div className="answer-grid">
					{currentQuestion.answers.map((ans, idx) => (
						<button
							key={idx}
							className="answer-button"
							onClick={() => {
								if (questionTitle === "Correct" || questionTitle.startsWith("Incorrect")) return;
								if (currentQuestion.answerIndex === idx) correct();
								else incorrect();
							}}
						>
							{ans}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
