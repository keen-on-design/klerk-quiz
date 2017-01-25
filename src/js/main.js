import Vue from 'vue';
let Quiz = require('./components/quiz.vue');

var quiz = {
  title: 'My quiz',
  questions: [
    {
      text: "Question 1",
      responses: [
        {text: 'Wrong, too bad.'},
        {text: 'Right!', correct: true},
      ]
    }, {
      text: "Question 2",
      responses: [
        {text: 'Right answer', correct: true},
        {text: 'Wrong answer'},
      ]
    }
  ]
};

new Vue({
  el: '#app',
  components: {
    'quiz': Quiz,
  },
  render: function (createElement) {
    return createElement(Quiz)
  },
  // The view will trigger these methods on click
  methods: {
    // Go to next question
    next: function() {
      this.questionIndex++;
    },
    // Go to previous question
    prev: function() {
      this.questionIndex--;
    },
    // Return "true" count in userResponses
    score: function() {
      return this.userResponses.filter(function(val) { return val }).length;
    }
  }
});