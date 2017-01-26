<template>
    <div class="qz__container" style="width: 100vw;">
        <div class="qz-opener active" v-show="questionIndex === 0">
            <div class="qz-cover" v-bind:style="{ backgroundImage: 'url(' + quiz.image + ')' }">
                <h1>{{ quiz.title }}</h1>
                <p v-html="quiz.introtext"></p>
                <button class="qz-button qz-button-start" type="button" v-on:click='next'>Начать тест</button>
            </div>

            <div class="qz-introtext">
                <p v-html="quiz.article"></p>
            </div>
        </div>

        <div v-for="(question, index) in quiz.questions">
            <div class="qz-question" v-show="index === questionIndex - 1">

                <div class="qz-cover" v-bind:style="{ backgroundImage: 'url(' + question.image + ')' }">
                    <span class="qz-question-number"> {{ index + 1 }} <span class="spacer">/</span> {{ quiz.questions.length }}</span>
                    <h2 class="qz-question-title" v-html="question.title"></h2>
                    <span class="qz-question-warning" v-if="getQuestionType(question, index) !== 'radio'">несколько правильных ответов</span>
                </div>

                <div class="qz-question-answers">
                    <ul>
                        <li v-for="(response, responseIndex) in question.responses">
                            <div class="qz-answer-button"
                                 v-bind:class="{
								 	'qz-checked': response.checked === true,
								 	'qz-correct': response.status === 'correct',
								 	'qz-incorrect': response.status === 'error',
								 	'qz-correct-missing': response.status === 'missing',
								 	'qz-skip': response.status === 'skip',
								 	'qz-radio': getQuestionType(question) === 'radio',
								 	'qz-checkbox': getQuestionType(question) === 'checkbox'
									}">

                                <template v-if="getQuestionType(question) === 'radio'">
                                    <input type="radio" v-bind:name="responseIndex" v-bind:value="responseIndex" v-bind:id="index + '_' + responseIndex">
                                </template>
                                <template v-else>
                                    <input type="checkbox" v-bind:name="responseIndex" v-bind:value="responseIndex" v-bind:id="index + '_' + responseIndex">
                                </template>

                                <label
                                        v-bind:for="index + '_' + responseIndex"
                                        v-on:click="handleResponseClick(question, response)">
                                    <span></span>{{ response.text }}
                                </label>
                            </div>
                            <p class="qz-hint" v-html="getResponseHint(response)"></p>
                        </li>
                    </ul>
                    <button class="qz-button qz-button-confirm" type="button"
                            v-show="(question.confirmed === false) && (getQuestionType(question) === 'checkbox')"
                            v-on:click="confirmCheckboxResponse(question)">
                        Ок</button>
                    <button class="qz-button qz-button-next" type="button"
                            v-on:click="next"
                            v-show="question.confirmed === true">Дальше</button>
                </div>
            </div>
        </div>

        <div class="qz-result qz-result-normal" v-show="questionIndex === questionsLength + 1">

            <div class="qz-cover" v-bind:style="{ backgroundImage: 'url(' + score.image + ')' }">
                <h2>{{ score.correct }} / {{ score.total }}</h2>
                <h1>{{ score.title }}</h1>
                <p>{{ score.text }}</p>
                <button class="qz-button qz-button-restart" type="button" v-on:click="restart">Пройти заново</button>

                <share v-bind:requires="'vkontakte, facebook, odnoklassniki'"
                       v-bind:url="quiz.url"
                       v-bind:image="score.shareImage"
                       v-bind:title="score.title"
                       v-bind:text="score.text">
                </share>
            </div>
        </div>
    </div>
</template>

<script>
  /* Config example
  {
    title: 'Quiz title',
    url: 'some.host',
    introtext: 'Some intro text...',
    article: 'Some sample article content with <b>Html inside</b>',
    image: 'http://lorempixel.com/800/600/business',

    questions: [
      {
        title: "Question 1",
        text: "Question 1 text",
        image: 'http://lorempixel.com/800/600/business',

        responses: [
          { text: 'Right.',
            correct: true,
            hint: {
              'missing': 'How did yoy forget!',
              'correct': 'Wow, you are awesome!'
            }
          },
          {text: 'Not even close...',
            hint: {
              'error': 'You gotta be kidding me!',
            }
          },
        ]
      }, {
        title: "Question 2",
        text: "Question 2 text",
        image: 'http://lorempixel.com/800/600/business',

        responses: [
          {text: 'Right.', correct: true},
          {text: 'Wrong one'},
          {text: 'Right also!', correct: true},
          {text: 'Naa-a'},
        ]
      }, {
        title: "Question 3",
        text: "Question 3 text",
        image: 'http://lorempixel.com/800/600/business',

        responses: [
          {text: 'Wrong, too bad.'},
          {text: 'Right!', correct: true},
        ]
      },
    ],
    results : [
      {
        entry: 0,
        title: 'Your score is very low',
        text: 'Try another day',
        image: 'http://lorempixel.com/800/600/business',
        shareImage: 'http://lorempixel.com/800/600/business'
      },
      {
        entry: 2,
        title: 'Your score is ok',
        text: 'Nothing to worry about',
        image: 'http://lorempixel.com/800/600/business',
        shareImage: 'http://lorempixel.com/800/600/business'},
      {
        entry: 3,
        title: 'Your score is perfect',
        text: 'P-E-R-F-E-C-T',
        image: 'http://lorempixel.com/800/600/business',
        shareImage: 'http://lorempixel.com/800/600/business'
      }
    ]
  }*/

  let _ = require('underscore');

  module.exports = {
    data () {
      let data = JSON.parse(this.contents);

      _.each(data.questions, function (question) {
        question.confirmed = false;
        _.each(question.responses, function (response) {
          response.checked = false;
          response.status = false;
        });
      });

      return {
        quiz: data,
        questionIndex: 0,
        questionsLength: data.questions.length
      }
    },

    beforeCreate () {

    },

    components: {
      'share' : require('../social/buttons-share.vue')
    },

    props: {
      contents: {
        type: String,
        required: true
      }
    },

    computed: {
      // a computed getter
      score: function () {
        let scoreData = this.getQuizScore();

        let resultIndex = _.findIndex(this.quiz.results, function (result) {
          return (scoreData.correct <= result.entry);
        });

        if (resultIndex !== 0 && resultIndex !== this.quiz.results.length - 1 && scoreData.correct !== this.quiz.results[resultIndex].entry) resultIndex -= 1;
        let result = this.quiz.results[resultIndex];

        return {
          title: result.title,
          text: result.text,
          image: result.image,
          shareImage: result.shareImage,
          correct: scoreData.correct,
          total: scoreData.total,
        }
      }
    },

    methods: {
      // Go to next question
      next: function () {
        this.questionIndex++;
      },

      // Go to previous question
      prev: function () {
        this.questionIndex--;
      },

      // Go to quiz start
      restart: function () {
        this.resetConfig();
        this.questionIndex = 0;
      },

      resetConfig: function () {
        let quiz = this.quiz;
        _.each(quiz.questions, function (question) {
          question.confirmed = false;
          _.each(question.responses, function (response) {
            response.checked = false;
            response.status = false;
          });
        });
      },

      handleResponseClick: function (question, response) {
        if (question.confirmed === true) return false;

        if (this.getQuestionType(question) === 'radio') {
          response.checked = true;
          this.confirmQuestion(question, function (question) {
            this.checkResponses(question);
          });
        } else {
          response.checked = !response.checked;
        }
      },

      setConfirmStatus: function (question, status) {
        question.confirmed = status;
      },

      checkResponses : function (question) {
        const correctStatus = 'correct';
        const missingStatus = 'missing';
        const errorStatus = 'error';
        const skipStatus = 'skip';

        let self = this;

        _.each(question.responses, function (response) {
          if (response.checked === true) {
            if (response.correct === true) {
              self.setResponseStatus(response, correctStatus);
            } else {
              self.setResponseStatus(response, errorStatus);
            }
          } else {
            if (response.correct === true) {
              self.setResponseStatus(response, missingStatus);
            } else {
              self.setResponseStatus(response, skipStatus);
            }
          }
        });
      },

      setResponseStatus: function (response, status) {
        response.status = status;
      },

      confirmQuestion: function (question, callback) {
        this.setConfirmStatus(question, true);
        if (_.isFunction(callback)) {
          callback.call(this, question);
        }
      },

      confirmCheckboxResponse: function (question) {
        this.confirmQuestion(question, function (question) {
          this.checkResponses(question);
        });
      },

      /**
       * Get question type: is it a single select or multi select question.
       * @param {Object} question - Object containing question data.
       * @return {String} String definition of question type.
       */
      getQuestionType: function (question) {
        const defaultType = 'radio';
        const multiType = 'checkbox';

        if (!_.has(question, 'type')) {
          if (!_.has(question, 'responses')) return defaultType;

          let correct = 0;
          _.each(question.responses, function (response) {
            if (response.correct === true) correct += 1;
          });

          if (correct > 1) return multiType;
          return defaultType;

        } else {
          return question.type;
        }
      },

      getResponseHint: function (response) {
        if (!response.status) return '';
        if (_.has(response, 'hint') && _.has(response.hint, response.status)) {
          return response.hint[response.status];
        }
        return '';
      },

      getQuizScore : function () {
        let totalCorrect = 0;

        _.each(this.quiz.questions, function (question) {
          let correct = false;
          _.each(question.responses, function (response) {
            if (response.status === 'correct') correct = true;
          });

          _.each(question.responses, function (response) {
            if (response.status === 'missing') correct = false;
          });

          _.each(question.responses, function (response) {
            if (response.status === 'error') correct = false;
          });

          if (correct) totalCorrect += 1;
        });

        return {correct: totalCorrect, total: this.questionsLength};
      }
    }
  };

</script>