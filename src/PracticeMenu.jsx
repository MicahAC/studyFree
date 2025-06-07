import Cookies from "js-cookie";
import { useState } from "react";
import "./Home.css";
import { useParams, Link } from "react-router-dom";

let questionNum = 0;
let questions;
let firstRun = true;
let correctCount = 0;
let incorrectCount = 0;

export default function PracticeMenu() {

	const [incorrectDisplay,setIncorrect] = useState(0);
	const [correctDisplay,setCorrect] = useState(0);

	const savedLists = Cookies.get();
	const param = useParams()["set"];
	const currentList = savedLists["set:" + param];
	const [questionTitle, setTitle] = useState("")
	const [debugQuestionNum, setDebug] = useState(0)

	const majorDivider = "}*&";
	const minorDivider = "{(#";
	const qDivider = "(#*";

	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}
	function shuffleAnswers(answers, answerIndex) {
		const correctAnswer = answers[answerIndex];
		// Remove the correct answer from the array
		const wrongAnswers = answers.slice(0, answerIndex).concat(answers.slice(answerIndex + 1));
		// Shuffle the wrong answers
		const shuffledWrongAnswers = shuffleArray(wrongAnswers);
		// Insert the correct answer at a random index
		const newAnswerIndex = Math.floor(Math.random() * (shuffledWrongAnswers.length + 1));
		const shuffledAnswers = [
			...shuffledWrongAnswers.slice(0, newAnswerIndex),
			correctAnswer,
			...shuffledWrongAnswers.slice(newAnswerIndex)
		];
		return [shuffledAnswers, newAnswerIndex];
	}

	function correct() {
		setTitle("Correct")
		correctCount++;
		setCorrect(correctCount)
		if (questionNum == questions.length - 1) {
			questionNum = 0;
			questions = shuffleArray(questions)
			questions.forEach(question=>{
				let answers = question.answers
				let answerIndex;
				const correctAnswer = `${answers[question.answerIndex]}`
				answers[question.answerIndex] = true
				answers = shuffleArray(answers)
				answers.forEach((x,index)=>{
					if(x === true) {
						answers[index] = correctAnswer
						answerIndex = index
					}
				})
				question.answerIndex = answerIndex
			})
		}
		else {
			questionNum += 1;
			setDebug(questionNum)
		}


		setTimeout(() => {
			setTitle('')
			setQuestion(questions[questionNum])
		}, 500)
	}

	function incorrect() {
		setTitle(`Incorrect - Answer: ${currentQuestion.answers[currentQuestion.answerIndex]}`)
		incorrectCount++;
		setIncorrect(incorrectCount)
		if (questionNum == questions.length - 1) {
			questionNum = 0;
			setDebug(questionNum)
			questions = shuffleArray(questions)
		}
		else {
			questionNum += 1;
			setDebug(questionNum)
		}


		setTimeout(() => {
			setTitle('')
			setQuestion(questions[questionNum])
		}, 2000)
	}

	if(firstRun) {
		const currentList = JSON.parse(savedLists["set:" + param]);

		let importedQuestions = currentList.questionList.map((question) => {
			return {
			question: question.question,
			correctAnswer: question.answers[0],
			wrongAnswers: question.answers.slice(1).filter(x=>!!x),
			answerIndex: 0,
			answerCount: question.answerCount || 4 // Default to 4 answers if not specified
			};
		});

		questions = importedQuestions.map(q => {
			const answers = [q.correctAnswer, ...q.wrongAnswers];
			console.log(answers)
			const answerIndex = 0; // Assuming the first answer is always correct
			const [shuffledAnswers, newAnswerIndex] = shuffleAnswers(answers, answerIndex);
			console.log(shuffledAnswers)
			return {
				title: q.question,
				answers: shuffledAnswers,
				answerIndex: newAnswerIndex,
				answerCount: q.answerCount
			};
		})
	}
	if (firstRun) questions = shuffleArray(questions)
	firstRun = false;

	const [currentQuestion, setQuestion] = useState(questions[questionNum]);

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
			<div className="practiceMenuTitle">{param}</div>
			<ul className="nav-list">
				<li className="scoreCount">{correctDisplay}</li>
				<li className="scoreCount red">{incorrectDisplay}</li>
			</ul>
			<div className="question-box">
				<div className="question-text">
					{questionTitle || currentQuestion.title}
				</div>
				<div className="answer-grid">
					<button className="answer-button" onClick={() => {
						if(questionTitle == "Correct" || questionTitle.startsWith("Incorrect")) return;
						if (currentQuestion.answerIndex == 0) correct()
						else incorrect()
					}}>{currentQuestion.answers[0]}</button>
					<button className="answer-button" onClick={() => {
						if(questionTitle == "Correct" || questionTitle.startsWith("Incorrect")) return;
						if (currentQuestion.answerIndex == 1) correct()
						else incorrect()
					}}>{currentQuestion.answers[1]}</button>
					{currentQuestion.answerCount == 4 && (<button className="answer-button" onClick={() => {
						if(questionTitle == "Correct" || questionTitle.startsWith("Incorrect")) return;
						if (currentQuestion.answerIndex == 2) correct()
						else incorrect()
					}}>{currentQuestion.answers[2]}</button>)}
					{currentQuestion.answerCount == 4 && (<button className="answer-button" onClick={() => {
						if(questionTitle == "Correct" || questionTitle.startsWith("Incorrect")) return;
						if (currentQuestion.answerIndex == 3) correct()
						else incorrect()
					}}>{currentQuestion.answers[3]}</button>)}
				</div>
			</div>
		</div>
	);
}
