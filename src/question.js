export default class Question {
    constructor(question, correctAnswer, wrongAnswers) {
        this.question = question;
        this.correctAnswer = correctAnswer;
        this.wrongAnswers = wrongAnswers;
        this.answers = [correctAnswer, ...wrongAnswers];
        this.answerIndex = 0;
    }
}