<template>
    <div class="qz__container">
        <div class="qz-opener active" v-show="questionIndex === 0">
            <div class="qz-cover" v-preload-bg="quiz.image">
                <h1>{{ quiz.title }}</h1>
                <p v-html="quiz.introtext"></p>
            </div>

            <button class="qz-button qz-button-start" type="button" v-on:click='next'>Начать тест</button>

            <div class="qz-introtext">
                <p v-html="quiz.article"></p>
            </div>
        </div>

        <div v-for="(question, index) in quiz.questions">
            <div class="qz-question" v-if="index === questionIndex - 1">

                <div class="qz-cover" v-preload-bg="question.image">
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

        <div v-if="questionIndex === questionsLength + 1">

            <div class="qz-result">
                <div class="qz-cover" v-preload-bg="score.image">
                    <h2 class="qz-score">{{ score.correct }} / {{ score.total }}</h2>
                    <h1>{{ score.title }}</h1>
                    <p>{{ score.text }}</p>
                </div>
            </div>

            <button class="qz-button qz-button-restart" type="button" v-on:click="restart">Пройти заново</button>
            <share v-bind:requires="'facebook, vkontakte, twitter, odnoklassniki'"
                   v-bind:url="quiz.url"
                   v-bind:picture="score.shareImage"
                   v-bind:title="score.title"
                   v-bind:description="score.text">
            </share>
        </div>
    </div>
</template>

<script lang="babel">
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

  import _ from 'underscore';
  import $ from 'utils/dom.utility';

  export default {
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

    directives: {
      'preload-bg': {
        inserted (el, args) {
          let img = new Image();
          img.src = args.value;
          $.addClass(el, 'loading');

          img.onload = function() {
            el.style.backgroundImage = "url('" + args.value + "')";
            $.removeClass(el, 'loading');
            $.addClass(el, 'loaded');
          }.bind(this);
        }
      }
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

        let resultIndex = _.findLastIndex(this.quiz.results, function (result) {
          return (scoreData.correct >= result.entry);
        });

        console.log(resultIndex);

        //if (resultIndex !== 0 && resultIndex !== this.quiz.results.length - 1 && scoreData.correct !== this.quiz.results[resultIndex].entry) resultIndex -= 1;
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

<style lang="sass" scoped>
    @import "~node-bourbon/node_modules/bourbon/app/assets/stylesheets/bourbon";
    $qz-color-correct: #4CAF50;
    $qz-color-incorrect: darken(#b32d2d, 5%);

    .flex-container {
      @include display(flex);
      @include flex-flow(row wrap);
      @include justify-content(center);
      @include align-items(stretch);
      @include align-content(stretch);
    }

    .flex-container > .flex-child {
      @include flex(1 1 50%);
    }

    .qz__container {
      font: normal 16px/19px "PT Sans", Arial, sans-serif;
      width: 100%;
      max-width: 1000px;
      overflow: hidden;
    }

    .qz-opener {
      position: relative;
    }

    .qz-cover {
      width: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 350px;
      box-sizing: border-box;
      color: #fff;
      @include padding(50px 0 20px);
      background-color: lighten(#000, 10%);
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
      overflow: hidden;
      @include transition(all .3s ease-in-out);

      -webkit-box-shadow: inset 0 0 0 100vw rgba(0,0,0,.5);
      -moz-box-shadow: inset 0 0 0 100vw rgba(0,0,0,.5);
      box-shadow: inset 0 0 0 100vw rgba(0,0,0,.5);

      h1 {
        font: normal 30px/32px "PT Serif", "Times New Roman", Times, serif!important;
        max-width: 90%;
        margin: 15px 0!important;
        padding: 0!important;
        text-align: center;
      }

      h2 {
        font: normal 26px/30px "PT Serif", "Times New Roman", Times, serif!important;
        max-width: 90%;
          margin: 25px 0!important;
          padding: 0!important;
          border: none!important;
          text-align: center;

          &.qz-score {
            font-size: 32px!important;
          }
      }

      p {
        max-width: 90%;
        margin: 0 0 10px;
        position: relative;
        text-align: center;
      }

      a {
        color: #fff;
      }

      a:hover {
        color: #efefef;
      }

      &.loading {
            opacity: 0;
        }

        &.loaded {
            opacity: 1;
            padding: 20px 0;
        }
    }

    .qz-result {
      background-color: lighten(#000, 10%);
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #fff;
      box-sizing: border-box;
      position: relative;

      &.active {
        display: flex;
      }
    }

    .qz-question {
      max-width: 1000px;
      box-sizing: border-box;
      margin: 0;
      &.active {
        display: block;
      }
    }

    .qz-question * {
      box-sizing: border-box;
    }

    .qz-question-header {
      color: #fff;
      position: relative;
      height: 350px;
      box-sizing: border-box;
      padding: 10px 0;
      display: flex;
      flex-direction: column;

      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;

      -webkit-box-shadow: inset 0 0 0 100vw rgba(0,0,0,.6);
      -moz-box-shadow: inset 0 0 0 100vw rgba(0,0,0,.6);
      box-shadow: inset 0 0 0 100vw rgba(0,0,0,.6);
    }

    .qz-question-text {
      display: block;
      font-size: 30px;
      font-weight: bold;
      max-width: 90%;
      margin: 20px auto 10px;
      line-height: 100%;
      text-align: center;
      position: relative;
    }

    .qz-question-answers {
      position: relative;
    }

    .qz-question-answers ul {
      @include margin(0 0 10px);
      padding: 0;
      list-style: none;
    }

    .qz-question-answers li {
      margin: 0;
      @include padding(10px 0);
      list-style: none;
      border-bottom: 1px #e6e6e6 solid;
    }

    .qz-answer-button {
      color: #010101;
      margin: 0 10px 0 0;
      height: 100%;
      @include transition(all 0.2s ease);

      label {
        font: normal 16px/19px "PT Sans", Arial, sans-serif;
        cursor: pointer;
        display: block;
        height: 100%;
        vertical-align: top;
        position: relative;
        margin: 0 0 0 30px;
        padding: 5px 10px;

        &:before {
          content: "";
          display: -moz-inline-box;
          display: inline-block;
          width: 18px;
          height: 18px;
          position: absolute;
          left: -20px;
          top: 6px;
          background: #fff;
          border: 2px #373c4d solid;
          box-sizing: border-box;
          @include transition(all 0.1s linear);
        }

        span {
          content: "";
          width: 18px;
          height: 18px;
          position: absolute;
          left: -20px;
          top: 6px;
          @include border-top-radius(50%);
          @include border-bottom-radius(50%);
          @include border-left-radius(50%);
          @include border-right-radius(50%);
        }
      }

      &:hover {
        label:before {
          border: 5px #6c738d solid;
        }
      }

      input[type="checkbox"], input[type="radio"] {
        margin: 0!important;
        display: none;
      }
    }

    .qz-radio label:before {
      @include border-top-radius(50%);
      @include border-bottom-radius(50%);
      @include border-left-radius(50%);
      @include border-right-radius(50%);
    }

    .qz-checkbox label:before {
      @include border-top-radius(2px);
      @include border-bottom-radius(2px);
      @include border-left-radius(2px);
      @include border-right-radius(2px);
    }

    .qz-checked {
      &.qz-checkbox {
        label {
          &:before {
            background-color: #373c4d;
          }
        }
      }
    }

    .qz-correct, .qz-correct-missing {
      color: $qz-color-correct;

      &.qz-radio, &.qz-checkbox {
        label {
          &:before {
            width: 26px;
            height: 26px;
            @include margin(-4px null null -4px);
            border-color: $qz-color-correct;
            background-color: transparent!important;
          }

          span {
            &:before, &:after {
              content: '';
              display: block;
              position: absolute;
              width: 2px;
              height: 12px;
              top: 50%;
              left: 50%;
              background-color: $qz-color-correct;
            }

            &:before {
              @include transform(rotate(45deg));
              margin: -6px 0 0 1px;
            }

            &:after {
              height: 6px;
              margin: -1px 0 0 -5px;
              @include transform(rotate(-45deg));
            }
          }
        }
      }
    }

    .qz-incorrect {
      color: #b32d2d;

      &.qz-radio, &.qz-checkbox {
        label {
          &:before {
            width: 26px;
            height: 26px;
            @include margin(-4px null null -4px);
            border-color: #b32d2d;
            background-color: transparent!important;
          }

          span {
            &:before, &:after {

              content: '';
              display: block;
              position: absolute;
              width: 2px;
              height: 14px;
              top: 50%;
              left: 50%;
              background-color: #b32d2d;
            }

            &:before {
              @include transform(rotate(45deg));
              margin: -7px 0 0 -1px;
            }

            &:after {
              margin: -7px 0 0 -1px;
              @include transform(rotate(-45deg));
            }
          }
        }
      }
    }

    .qz-skip {
      opacity: .3;
    }

    .qz-correct, .qz-incorrect, .qz-correct-missing, .qz-else, .qz-skip {
      &:hover {
        label:before {
          border-width: 2px;
        }
      }
    }

    .qz-correct-missing {
      color: $qz-color-correct;

      &.qz-radio, &.qz-checkbox {
        label:before {
          width: 26px;
          height: 26px;
          @include margin(-4px null null -4px);
          border-color: $qz-color-correct;
        }
      }

      &.qz-checkbox label {
        &:before {
          border-style: dotted;
        }
      }
    }

    .qz-hint {
      margin: 5px 0 5px 40px;
      font-size: .85em;
    }

    .qz-question-number {
      position: absolute;
      display: block;
      font-size: .8em;
      width: 50px;
      text-align: center;
      top: 25px;
      left: 50%;
      margin-left: -25px;
      border: 1px solid rgba(255, 255, 255, 0.5);

      .spacer {
        opacity: .9;
      }
    }

    .qz-question-warning {
      font-style: italic;
      font-size: .85em;
      position: relative;

      &:before {
        position: absolute;
        content: '';
        height: 1px;
        background-color: rgba(255, 255, 255, .7);
        width: 40px;
        left: 50%;
        margin-left: -20px;
        top: -5px;
      }
    }

    @media only screen and (max-width: 768px) {
      .qz-result h1, .qz-opener h1, .qz-cover h2, .qz-question-text {
        font-size: 22px!important;
        line-height: 24px!important;
      }
    }

    .qz-button {
      font: bold 14px/36px "PT Sans", Arial, sans-serif;
      color: lighten(#373c4d, 70%);
      letter-spacing: 1px;
      display: block;
      position: relative;
      margin: 10px auto!important;
      padding: 0 10px!important;
      min-width: 100px;
      cursor: pointer;
      outline: none;
      box-shadow: inset 0 1px 0 0 hsla(0, 0%, 100%, .2);
      @include border-top-radius(2px);
      @include border-right-radius(2px);
      @include border-bottom-radius(2px);
      @include border-left-radius(2px);
      border: 1px solid rgba(0, 0, 0, .2);
      border-top: 1px solid rgba(0, 0, 0, .1);
      border-bottom: 1px solid rgba(0, 0, 0, .4);
      background-color: lighten(#373c4d, 10%);
      outline: none!important;
        transition: all 0.2s ease;

      &:hover {
        box-shadow: inset 0 1px 0 0 hsla(0, 0%, 0%, .1);
         background-color: lighten(#373c4d, 6%);
      }
    }

    .qz-button-start, .qz-button-restart {
      font: normal 16px/36px "PT Sans", serif;
      @include border-top-radius(0);
      @include border-right-radius(0);
      @include border-bottom-radius(0);
      @include border-left-radius(0);
      border: none!important;
      border-bottom: 1px #386601 solid!important;
      color: #fff;
      width: 20%;
      min-width: 150px;
      background-color: #50a81b;

      &:hover {
        background-color: darken(#50a81b, 5%);
        width: 30%;
      }
    }
</style>