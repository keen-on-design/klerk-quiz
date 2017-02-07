'use strict';

module.exports = {
  addClass: function (el, className) {
    if (el.classList)
      el.classList.add(className);
    else
      el.className += ' ' + className;
  },

  removeClass: function (el, className) {
    if (el.classList.contains(className)) {
      el.classList.remove(className);
    }
  }
};
