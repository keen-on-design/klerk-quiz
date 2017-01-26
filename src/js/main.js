import Vue from 'vue';
import Quiz from './components/quiz.vue';

new Vue({
  el: '#app',
  components: {
    'quiz': Quiz
  },
  render: function (createElement) {
    return createElement(Quiz);
  }
});
