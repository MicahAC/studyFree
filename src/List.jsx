import { useState, useEffect } from "react";
import "./Home.css";
import { Link, useParams } from "react-router-dom";
import Cookies from "js-cookie";

export default function List() {

  const [userInput, setUserInput] = useState("");
  const [title, setTitle] = useState("Title");
  const [questions, setQuestions] = useState([]); // State for the question list
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [answerCounts, setAnswerCounts] = useState([])
  const [questionAnswers, setQuestionAnswers] = useState([]);
  const [submitButton, setSubmitButton] = useState("Save");

  const savedLists = Cookies.get();
  const param = useParams()["set"];

  useEffect(() => {
    if (param && savedLists["set:" + param]) {
      const currentList = JSON.parse(savedLists["set:" + param]);

      let importedQuestions = currentList.questionList.map((question) => {
        return {
          question: question.question,
          correctAnswer: question.answers[0],
          wrongAnswers: question?.answers.slice(1),
          answerCount: question.answerCount || 4,
          answerIndex: 0,
        };
      });

      setQuestions(importedQuestions.map(q => q.question));
      setQuestionAnswers(importedQuestions.map(q => q.correctAnswer));
      setWrongAnswers(importedQuestions.map(q => q.wrongAnswers));
      setAnswerCounts(importedQuestions.map(q => q.answerCount));
      setTitle(param);
    }
  }, []);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleAddQuestion = () => {
    if (userInput.trim() !== "") {
      setQuestions([...questions, userInput.trim()]); // Add new question to the list
      setQuestionAnswers([...questionAnswers, ""]);
      setAnswerCounts([...answerCounts, 4]); // Default to 4 answers
      setWrongAnswers([...wrongAnswers, ["", "", ""]]);
      setUserInput(""); // Clear the input field
    }
  };

  const handleDeleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
    setQuestionAnswers(questionAnswers.filter((_, i) => i !== index));
    setAnswerCounts(answerCounts.filter((_, i) => i !== index));
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
            let questionList = []
            for (let i = 0; i < questions.length; i++) {
              questionList.push({
                question: questions[i],
                answers: [questionAnswers[i], ...wrongAnswers[i]],
                answerCount: answerCounts[i],
              });
            }
            Cookies.set("set:" + title, JSON.stringify({ title, questionList }));

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
            <button
              className="changeQuestionType"
              onClick={() => {
                setAnswerCounts((prev) => {
                  let newCounts = [...prev];
                  newCounts[index] = newCounts[index] == 4 ? 2 : 4
                  return newCounts;
                });
              }}
            >
              {answerCounts[index]} Answer Question
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
              />{(() => {
                if (answerCounts[index] == 4) return (
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
                  />)
              })()}

              {(() => {
                if (answerCounts[index] == 4) return (
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
                  />)
              })()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
