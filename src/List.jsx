import { useState, useEffect } from "react";
import "./Home.css";
import { Link, useParams } from "react-router-dom";
import Cookies from "js-cookie";

export default function List() {

  const [userInput, setUserInput] = useState("");
  const [title, setTitle] = useState("Title");
  const [questions, setQuestions] = useState([]); // State for the question list
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [questionAnswers, setQuestionAnswers] = useState([]);
  const [submitButton, setSubmitButton] = useState("Save");
  
  const savedLists = Cookies.get();
  const param = useParams()["set"];

  useEffect(() => {
    if (param && savedLists["list:" + param]) {
      const currentList = savedLists["list:" + param];
      const majorDivider = "}*&";
      const minorDivider = "{(#";
      const qDivider = "(#*";
      let importedQuestions = currentList.split(majorDivider).map((question) => {
        const questionParts = question.split(minorDivider);
        const questionText = questionParts[0];
        const answerText = questionParts[1].split(qDivider);
        const wrongAnswers = answerText.slice(1);
        const correctAnswer = answerText[0];
        return {
          question: questionText,
          correctAnswer: correctAnswer,
          wrongAnswers: wrongAnswers,
          answerIndex: 0,
        };
      });

      setQuestions(importedQuestions.map(q => q.question));
      setQuestionAnswers(importedQuestions.map(q => q.correctAnswer));
      setWrongAnswers(importedQuestions.map(q => q.wrongAnswers));
      setTitle(param);
    }
  }, [param, savedLists]);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };
  
  const handleAddQuestion = () => {
    if (userInput.trim() !== "") {
      setQuestions([...questions, userInput.trim()]); // Add new question to the list
      setQuestionAnswers([...questionAnswers, ""]);
      setWrongAnswers([...wrongAnswers, ["", "", ""]]);
      setUserInput(""); // Clear the input field
    }
  };

  const handleDeleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
    setQuestionAnswers(questionAnswers.filter((_, i) => i !== index));
    setWrongAnswers(wrongAnswers.filter((_, i) => i !== index));
  };

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
            {/* Add more nav buttons as needed */}
          </ul>
        </nav>
      </header>
      <div className="top-input-box">
        <input
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          value={title} // Display the current input value
        />
      </div>
      <div className="submit-button-container">
        <button
          className="button-base submitButton"
          onClick={() => {
            let savedText = "";
            const majorDivider = "}*&";
            const minorDivider = "{(#";
            const qDivider = "(#*";
            questions.forEach((q, i) => {
              savedText += q + minorDivider;
              savedText += questionAnswers[i] + qDivider;
              savedText += wrongAnswers[i][0] + qDivider;
              savedText += wrongAnswers[i][1] + qDivider;
              savedText += wrongAnswers[i][2];
              if (i != questions.length - 1) savedText += majorDivider;
            });
            // navigator.clipboard.writeText(savedText);
            Cookies.set("list:" + title, savedText);
            setSubmitButton("Flashcard set saved");
            setTimeout(() => {
              setSubmitButton("Save");
            }, 500);
          }}
        >
          {submitButton}
        </button>
      </div>
      <div className="input-box">
        Question:
        <input
          onChange={handleInputChange}
          value={userInput} // Display the current input value
          onKeyDown={(event) => {
            if (event.key == "Enter") handleAddQuestion();
          }}
        />
        <button onClick={handleAddQuestion}>Add</button>
      </div>
      <ul className="questionList">
        {" "}
        {/* Create a list to display the questions */}
        {questions.map((question, index) => (
          <li key={index}>
            <text className="questionItem">
              Q{index + 1}. {question}
            </text>
            <button
              className="deleteItem"
              onClick={() => {
                handleDeleteQuestion(index);
              }}
            >
              Delete
            </button>
            <div className="input-holder">
              <input
                className="input green"
                onChange={(event) => {
                  let a = [];
                  questionAnswers.forEach((x) => {
                    a.push(x);
                  });
                  let tempAnswers = a;
                  tempAnswers[index] = event.target.value;
                  setQuestionAnswers(tempAnswers);
                }}
                value={questionAnswers[index]}
              />
              <input
                className="input red"
                onChange={() => {
                  let a = [];
                  wrongAnswers.forEach((x) => {
                    a.push(x);
                  });
                  let tempAnswers = a;
                  tempAnswers[index][0] = event.target.value;
                  setWrongAnswers(tempAnswers);
                }}
                value={wrongAnswers[index][0] || ""}
              />
              <input
                className="input red"
                onChange={() => {
                  let a = [];
                  wrongAnswers.forEach((x) => {
                    a.push(x);
                  });
                  let tempAnswers = a;
                  tempAnswers[index][1] = event.target.value;
                  setWrongAnswers(tempAnswers);
                }}
                value={wrongAnswers[index][1] || ""}
              />
              <input
                className="input red"
                onChange={() => {
                  let a = [];
                  wrongAnswers.forEach((x) => {
                    a.push(x);
                  });
                  let tempAnswers = a;
                  tempAnswers[index][2] = event.target.value;
                  setWrongAnswers(tempAnswers);
                }}
                value={wrongAnswers[index][2] || ""}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
