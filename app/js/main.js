/**
 * Class that represents an HTML Quiz. Provides methods for checking answers, generating a score and providing visual feedback.
 *
 * See https://alpsquid.github.io/quizlib for usage
 *
 * @class Quiz
 * @constructor
 * @param {String} quizContainer ID of the quiz container element.
 * @param {Array} answers Array of correct answers using the input value. e.g. ['a', '7', ['a', 'b']].
 *        Can use nested arrays for multi-answers such as checkbox questions
 * @example
 * 		new Quiz('quiz-div', ['a', '7', ['c', 'd'], 'squids', ['a', 'b']]);
 */
var Quiz = function(quizContainer, answers, config) {
  /**
   * Enum containing classes used by QuizLib as follows:
   * - **QUESTION**: 'quizlib-question'
   *   - used to identify a question element
   * - **QUESTION_TITLE**: 'quizlib-question-title'
   *   - used to identify the question title element
   * - **QUESTION_WARNING**: 'quizlib-question-answers'
   *   - used to identify the element containing question answers
   * - **QUESTION_ANSWERS**: 'quizlib-question-warning'
   *   - used by the 'unanswered question warning' element. Removed by {{#crossLink "Quiz/clearHighlights:method"}}{{/crossLink}}
   * - **CORRECT**: 'quizlib-correct'
   *   - added to question titles to highlight correctly answered questions.
   *     Use freely to take advantage of {{#crossLink "Quiz/highlightResults:method"}}{{/crossLink}} and {{#crossLink "Quiz/clearHighlights:method"}}{{/crossLink}}
   * - **INCORRECT**: 'quizlib-incorrect'
   *   - added to question titles to highlight incorrectly answered questions.
   *     Use freely to take advantage of {{#crossLink "Quiz/highlightResults:method"}}{{/crossLink}} and {{#crossLink "Quiz/clearHighlights:method"}}{{/crossLink}}
   * - **TEMP**: 'quizlib-temp'
   *   - Add to any elements you want to be removed by {{#crossLink "Quiz/clearHighlights:method"}}{{/crossLink}} (called by {{#crossLink "Quiz/checkAnswers:method"}}{{/crossLink}}).
   *     For example, adding an element with the correct answer in your {{#crossLink "Quiz/clearHighlights:method"}}{{/crossLink}} callback and have it be removed automatically
   *
   * @property Classes
   * @type Object
   * @default See above
   * @final
   */

   

  var defaults = {
    onInit : function () {}
  };

  this.config = $.extend(defaults, config);

  this.Classes = Object.freeze({
    QUESTION: "qz-question",
    QUESTION_TITLE: "qz-question-title",
    QUESTION_ANSWERS: "qz-question-answers",
    QUESTION_WARNING: "qz-question-warning",
    CORRECT: "qz-correct",
    ELSE: "qz-else",
    MISSING: "qz-correct-missing",
    INCORRECT: "qz-incorrect",
    TEMP: "qz-temp"
  });

  /**
   * Warning displayed on unanswered questions
   *
   * @property unansweredQuestionText
   * @type String
   * @default 'Unanswered Question!'
   */
  this.unansweredQuestionText = 'Unanswered Question!';

  // Quiz container element
  this.container = document.getElementById(quizContainer);
  this.questions = [];
  /**
   * Quiz Result object containing quiz score information. See {{#crossLink "QuizResult"}}{{/crossLink}}
   *
   * @property result
   * @type QuizResult
   */
  this.result = new QuizResult();
  /**
   * User defined answers taken from constructor
   *
   * @property answers
   * @type Array
   */
  this.answers = answers;

  // Get all the questions and add element to the questions array
  for (var i=0; i < this.container.children.length; i++) {
    if (this.container.children[i].classList.contains(this.Classes.QUESTION)) {
      this.questions.push(this.container.children[i]);
    }
  }

  if (this.answers.length != this.questions.length) {
    throw new Error("Number of answers does not match number of questions!");
  }

  this.config.onInit.call(this);
};

Quiz.prototype.getQuestionNode = function (index) {
  if (this.hasQuestion(index)) {
    return this.questions[index];
  } else {
    return false;
  }
};

Quiz.prototype.hasQuestion = function (index) {
  return this.questions[index] !== undefined;
};

Quiz.prototype.getUserAnswer = function (index) {
  if (this.questions[index] === undefined)  {
    return false;
  }
  var question = this.questions[index],
    answer     = this.answers[index],
    userAnswer = [],
    userInputs = question.getElementsByClassName(this.Classes.QUESTION_ANSWERS)[0].getElementsByTagName('input'),
    input,
    i;

  for (i = 0; i < userInputs.length; i += 1) {
    input = userInputs[i];
    if (input.type === "checkbox" || input.type === "radio") {
      if (input.checked) userAnswer.push(input.value);
    } else if (input.value !== '') {
      userAnswer.push(input.value);
    }
  }
  // Remove single answer from array to match provided answer format
  if (userAnswer.length == 1 && !Array.isArray(answer)) {
    userAnswer = userAnswer[0];
  }
  return userAnswer;

};

Quiz.prototype.getCorrectAnswer = function (index) {
  if (this.answers[index] === undefined) {
    return false;
  }
  return this.answers[index];
};

Quiz.prototype.checkAnswer = function(index, givenAnswer) {
  if (this.questions[index] === undefined || this.answers[index] === undefined) {
    return false;
  }
  var answer = this.getCorrectAnswer(index);
  return (answer === false) ? false : this.compareAnswers(answer, givenAnswer)
};

Quiz.prototype.compareAnswers = function (primaryAnswer, secondaryAnswer) {
  if (primaryAnswer === undefined || secondaryAnswer === undefined) {
    return false;
  }
  return Utils.compare(primaryAnswer, secondaryAnswer);
};

/**
 * Checks quiz answers against provided answers. Calls {{#crossLink "Quiz/clearHighlights:method"}}{{/crossLink}} for each question.
 *
 * @method checkAnswers
 * @param {Boolean} [flagUnanswered=true] Whether to ignore unanswered questions. If false, unanswered questions will not be flagged
 * @return {Boolean} True or if *flagUnanswered* is true: True if all questions have been answered. Otherwise false and unanswered questions are highlighted.
 */
Quiz.prototype.checkAnswers = function(flagUnanswered) {
  if (flagUnanswered === undefined) flagUnanswered = true;
  var unansweredQs = [];
  var questionResults = [];

  for (var i = 0; i < this.questions.length; i += 1) {
    var question = this.questions[i];
    var answer = this.answers[i];
    var userAnswer = [];

    this.clearHighlights(question);

    this.checkAnswer(i);

    // Get answers
    var answerInputs = question.getElementsByClassName(this.Classes.QUESTION_ANSWERS)[0].getElementsByTagName('input');
    var input;
    for (var k=0; k < answerInputs.length; k++) {
      input = answerInputs[k];
      if (input.type === "checkbox" || input.type === "radio") {
        if (input.checked) userAnswer.push(input.value);
      } else if (input.value !== '') {
        userAnswer.push(input.value);
      }
    }
    // Remove single answer from array to match provided answer format
    if (userAnswer.length == 1 && !Array.isArray(answer)) {
      userAnswer = userAnswer[0];
    } else if (userAnswer.length === 0) {
      unansweredQs.push(question);
    }

    questionResults.push(Utils.compare(userAnswer, answer));
  }

  if (unansweredQs.length === 0 || !flagUnanswered) {
    this.result.setResults(questionResults);
    return true;
  }
  else {
    // Highlight unanswered questions if set
    for (i=0; i < unansweredQs.length; i++) {
      var warning = document.createElement('span');
      warning.appendChild(document.createTextNode(this.unansweredQuestionText));
      warning.className = this.Classes.QUESTION_WARNING;
      unansweredQs[i].getElementsByClassName(this.Classes.QUESTION_TITLE)[0].appendChild(warning);
    }
  }
  return false;
};

/**
 * Clears highlighting for a question element (correct and incorrect classes), including unanswered question warnings and elements using the Classes.TEMP class
 *
 * @method clearHighlights
 * @param {HTMLDocument} question Question element to clear
 */
Quiz.prototype.clearHighlights = function(question) {
  // Remove question warning if it exists
  var questionWarnings = question.getElementsByClassName(this.Classes.QUESTION_WARNING);
  while (questionWarnings.length > 0) {
    questionWarnings[0].parentNode.removeChild(questionWarnings[0]);
  }

  // Remove highlighted elements
  var highlightedQuestions = [question.getElementsByClassName(this.Classes.CORRECT), question.getElementsByClassName(this.Classes.INCORRECT)];
  var highlightedElement;
  for (i=0; i < highlightedQuestions.length; i++) {
    while (highlightedQuestions[i].length > 0) {
      highlightedElement = highlightedQuestions[i][0];
      highlightedElement.classList.remove(this.Classes.CORRECT);
      highlightedElement.classList.remove(this.Classes.INCORRECT);
    }
  }

  // Remove temp elements
  var tempElements = question.getElementsByClassName(this.Classes.TEMP);
  while (tempElements.length > 0) {
    tempElements[0].parentNode.removeChild(tempElements[0]);
  }
};

/**
 * Highlights correctly and incorrectly answered questions by:
 * - Adding the class 'quizlib-correct' to correctly answered question titles
 * - Adding the class 'quizlib-incorrect' to incorrectly answered question titles
 *
 * @method highlightResults
 * @param {Function} [questionCallback] Optional callback for each question with the following arguments:
 * 1. Element: the question element
 * 2. Number: question number
 * 3. Boolean: true if correct, false if incorrect.
 *
 * This allows you to further customise the handling of answered questions (and decouples the library from a specific HTML structure), for example highlighting the correct answer(s) on incorrect questions.
 * Use the Classes.TEMP ('quizlib-temp') class on added elements that you want removing when {{#crossLink "Quiz/checkAnswers:method"}}{{/crossLink}} is called
 *
 * @example
 * ```
 *    // Method Call
 *    quiz.highlightResults(handleAnswers);
 *
 *    // handleAnswers callback
 *    function handleAnswers(questionElement, questionNo, correctFlag) {
 *        ...
 *    }
 * ```
 */
Quiz.prototype.highlightResults = function(questionCallback) {
  var question;
  for (var i=0; i < this.questions.length; i++) {
    question = this.questions[i];
    if (this.result.results[i]) {
      question.getElementsByClassName(this.Classes.QUESTION_TITLE)[0].classList.add(this.Classes.CORRECT);
    }
    else {
      question.getElementsByClassName(this.Classes.QUESTION_TITLE)[0].classList.add(this.Classes.INCORRECT);
    }
    if (questionCallback !== undefined) questionCallback(question, i, this.result.results[i]);
  }
};


/**
 * Quiz Result class that holds score information
 *
 * @class QuizResult
 * @constructor
 */
var QuizResult = function() {
  /**
   * Array of booleans where the index is the question number and the value is whether the question was answered correctly. Updated by {{#crossLink "QuizResult/setResults:method"}}{{/crossLink}}
   * @property results
   * @type Array
   */
  this.results = [];
  /**
   * Total number of questions. Updated by {{#crossLink "QuizResult/setResults:method"}}{{/crossLink}}
   * @property totalQuestions
   * @type Number
   */
  this.totalQuestions = 0;
  /**
   * Number of questions answered correctly. Updated by {{#crossLink "QuizResult/setResults:method"}}{{/crossLink}}
   * @property score
   * @type Number
   */
  this.score = 0;
  /**
   * Percentage score between 0 and 1. Updated by {{#crossLink "QuizResult/setResults:method"}}{{/crossLink}}
   * @property scorePercent
   * @type Number
   */
  this.scorePercent = 0;
  /**
   * Formatted score percent that's more useful to humans (1 - 100). Percent is rounded down. Updated by {{#crossLink "QuizResult/setResults:method"}}{{/crossLink}}
   * @property scorePercentFormatted
   * @type Number
   */
  this.scorePercentFormatted = 0;
};

/**
 * Calculates score information from an array of question results and updates properties
 *
 * @method setResults
 * @param {Array} questionResults Array of question results where the index is the question number and the value is whether the question was answered correctly. e.g. [true, true, false]
 */
QuizResult.prototype.setResults = function(questionResults) {
  this.results = questionResults;
  this.totalQuestions = this.results.length;
  this.score = 0;
  for (var i=0; i < this.results.length; i++) {
    if (this.results[i]) this.score++;
  }
  this.scorePercent = this.score / this.totalQuestions;
  this.scorePercentFormatted = Math.floor(this.scorePercent * 100);
};


/**
 * Utils class that provides useful methods
 *
 * @class Utils
 */
var Utils = function() {};
/**
 * Compare two objects without coercion. If objects are arrays, their contents will be compared, including order.
 *
 * @method compare
 * @param {Object} obj1 main object
 * @param {Object} obj2 object to compare obj1 against
 * @return {boolean} True if objects are equal
 */
Utils.compare = function(obj1, obj2) {
  if (obj1.length != obj2.length) return false;

  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    for (var i=0; i < obj1.length; i++) {
      if (obj1[i] !== obj2[i]) return false;
    }
    return true;
  }
  return obj1 === obj2;
};

(function ($, Quiz) {

  FB.init({
    appId: 111067065633348,
    version: 'v2.7'
  });

  var quiz = new Quiz('quiz__container', [
    "c","c","c","d","c","b","a","b","b","c","b","c","b","a","a",["a","c"]
  ], {
    // Automatically add question index
    onInit : function () {
      var questionsCount = this.questions.length;
      $.each(this.questions, function (index, node) {
        $(node).find('.qz-question-number').html((index + 1) + ' / ' + questionsCount);
      });
    }
  });

  $('#kquiz__score-button').click(function () {

    var message = '';
    if (quiz.checkAnswers()) {
      message += 'Correct answers: ' + quiz.result.score + '/' + quiz.result.totalQuestions;
      message += 'Percent correct: ' + quiz.result.scorePercentFormatted + '%';
    }

    // Alternatively, we can ignore unanswered questions by passing false
    quiz.checkAnswers(false);
    message += 'Correct answers: ' + quiz.result.score + '/' + quiz.result.totalQuestions;
    message += 'Percent correct: ' + quiz.result.scorePercentFormatted + '%';
    alert(message);
  });

  $('.qz-button-start').click(function () {
    var self = $(this),
      parent = self.closest('.qz-opener');
    parent.removeClass('active');
    $(quiz.getQuestionNode(0)).addClass('active');
  });

  function quizResult() {
    quiz.checkAnswers(false);
    var result = quiz.result.scorePercentFormatted;
    console.log(quiz.result.scorePercentFormatted);

    if (result < 33) {
      $('.qz-result-poor').addClass('active');
    }

    if (result >= 33 && result < 67) {
      $('.qz-result-normal').addClass('active');
    }

    if (result >= 67 && result < 93) {
      $('.qz-result-good').addClass('active');
    }

    if (result >= 93) {
      $('.qz-result-excelent').addClass('active');
    }
  }

  $('.qz-button-restart').click(function () {
    var self = $(this),
      inputs = self.closest('.qz__container').find('input');

    $.each(inputs, function (index, input) {
      var self = $(input);
      self.parent().removeClass(quiz.Classes.CORRECT).removeClass(quiz.Classes.INCORRECT).removeClass(quiz.Classes.MISSING).removeClass(quiz.Classes.ELSE);
      self.removeClass(quiz.Classes.CORRECT).removeClass(quiz.Classes.INCORRECT).removeClass(quiz.Classes.MISSING).removeClass(quiz.Classes.ELSE);
      self.prop('checked', false);
    });

    self.closest('.qz-result').removeClass('active');
    $('.qz-opener').addClass('active');
  });

  $.each($('.qz-answer-button > input'), function () {
    var self = $(this),
      questionNode = self.closest('.' + quiz.Classes.QUESTION),
      index        = questionNode.index('.' + quiz.Classes.QUESTION);

    if (quiz.hasQuestion(index)) {
      self.click(function () {
        var userAnswers = quiz.getUserAnswer(index),
          correctAnswers = quiz.getCorrectAnswer(index);

        if (userAnswers === false || correctAnswers === false) {
          return;
        }

        if (!(userAnswers instanceof Array)) {
          userAnswers = [userAnswers];
        }

        if (!(correctAnswers instanceof Array)) {
          correctAnswers = [correctAnswers];
        }

        questionNode.find('.qz-button-next').addClass('active');

        $.each(questionNode.find('input'), function (index, value) {
          var self = $(value);
          self.parent().addClass(quiz.Classes.ELSE)
          self.bind('click.quiz-events', function (event) {
            console.log('prevent');
            event.preventDefault();
          });
        });

        $.each(userAnswers, function (index, value) {
          var input = $(questionNode.find('input[value="' + value + '"]'));
          if ($.inArray(value, correctAnswers) !== -1) {
            input.parent().removeClass(quiz.Classes.ELSE);
            input.parent().addClass(quiz.Classes.CORRECT);
          } else {
            input.parent().removeClass(quiz.Classes.ELSE);
            input.parent().addClass(quiz.Classes.INCORRECT);
          }
        });

        $.each(correctAnswers, function (index, value) {
          var input = $(questionNode.find('input[value="' + value + '"]'));
          if ($.inArray(value, userAnswers) === -1) {
            input.parent().removeClass(quiz.Classes.ELSE);
            input.parent().addClass(quiz.Classes.MISSING);
          }
        });
      });
    }
  });

  $.each($('.qz-button-next'), function () {
    var self       = $(this),
      questionNode = self.closest('.' + quiz.Classes.QUESTION),
      index        = questionNode.index('.' + quiz.Classes.QUESTION);

    if (quiz.hasQuestion(index)) {

      self.click(function () {
        questionNode.find('input').unbind('click.quiz-events');

        if (quiz.hasQuestion(index + 1)) {
          $(quiz.getQuestionNode(index)).removeClass('active');
          $(quiz.getQuestionNode(index + 1)).addClass('active');
        } else {
          $(quiz.getQuestionNode(index)).removeClass('active');
          quizResult();
        }

      });
    }
  });

  $('.qz-button-fb').click(function() {
    var config = {
      method: "feed",
      link: window.location.href,
      caption: $(this).closest('.qz-result').find('h1').html(),
      description: $(this).closest('.qz-result').find('p').html(),
      picture: $(this).closest('.qz-result').find('.qz-result-pic').attr('src')
    };
    FB.ui(config);
  });

})($, Quiz);