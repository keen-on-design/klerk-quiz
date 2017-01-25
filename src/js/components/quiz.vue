<template>
	<div class="qz__container" style="width: 100vw;">
		<div class="qz-opener active" v-show="questionIndex === 0">
			<div class="qz-cover" style="background-image:url(http://www.klerk.ru/img/pb/original/0a_8726.jpg);">
				<h1>{{ quiz.title }}</h1>
				<p>...</p>
				<button class="qz-button qz-button-start" type="button" v-on:click='next'>Начать тест</button>
			</div>

			<div class="qz-introtext">
				<p>...</p>
			</div>
		</div>

		<div v-for="(question, index) in quiz.questions">
			<div class="qz-question" v-show="index === questionIndex - 1">

				<div class="qz-question-title" style="background-image:url(http://www.klerk.ru/img/pb/original/01_7243.jpg);">
					<span class="qz-question-number"> {{ index }}/ {{ quiz.questions.length }}</span>
					<span class="qz-question-text">{{ question.text }}</span>
				</div>

				<div class="qz-question-answers">
					<ul>
						<li v-for="response in question.responses">
							<div class="qz-answer-button qz-radio">
								<input type="radio" name="q1" value="a" id="q1_a">
								<label for="q1_a"><span></span>{{ response.text }}</label>
							</div>
						</li>
					</ul>
					<button class="qz-button qz-button-next" type="button" v-on:click="next">Дальше</button>
				</div>
			</div>
		</div>



	</div>
</template>

<script>
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

	module.exports = {
		data () {
			return {
				quiz: quiz,
				// Store current question index
				questionIndex: 0,
				// An array initialized with "false" values for each question
				// It means: "did the user answered correctly to the question n?" "no".
				userResponses: Array(quiz.questions.length).fill(false)
			}
		},
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
	};
</script>