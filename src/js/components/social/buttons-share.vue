<template>
    <div class="share">
        <button v-for="(button, index) in buttons" v-bind:class="button.class"  v-show="isRequired(requires, index)" v-on:click="openPopup(button)" type="button">
            {{ button.text }}
        </button>
    </div>
</template>

<script>
  let _ = require('underscore');

  module.exports = {
    data () {
      return {
        buttons: {
          vkontakte: {
            getPopupUrl: function (url, title, image, text) {
              let refUrl = 'http://vkontakte.ru/share.php?';
              refUrl += 'url=' + encodeURIComponent(url);
              refUrl += '&title=' + encodeURIComponent(title);
              refUrl += '&description=' + encodeURIComponent(text);
              refUrl += '&image=' + encodeURIComponent(image);
              refUrl += '&noparse=true';
              return refUrl;
            },
            class: 'social-button--vk',
            text: 'Вконтакте'
          },
          odnoklassniki: {
            getPopupUrl: function (url, title, image, text) {
              let refUrl = 'https://connect.ok.ru/offer';
              refUrl += '?url=' + encodeURIComponent(url);
              refUrl += '&title=' + encodeURIComponent(image);
              refUrl += '&description=' + encodeURIComponent(text);
              refUrl += '&imageUrl=' + encodeURIComponent(image);
              return refUrl;
            },
            class: 'social-button--ok',
            text: 'Одноклассники'
          },
          facebook: {
            getPopupUrl: function (url, title, image, text) {
              let refUrl = 'http://www.facebook.com/sharer.php?s=100';
              refUrl += '&p[title]=' + encodeURIComponent(title);
              refUrl += '&p[summary]=' + encodeURIComponent(text);
              refUrl += '&p[url]=' + encodeURIComponent(url);
              refUrl += '&p[images][0]=' + encodeURIComponent(image);
              return refUrl;
            },
            class: 'social-button--fb',
            text: 'Фейсбук'
          },
          twitter: {
            getPopupUrl: function (url, title, image, text) {
              let refUrl = 'http://twitter.com/share?';
              refUrl += 'text=' + encodeURIComponent(title);
              refUrl += '&url=' + encodeURIComponent(url);
              refUrl += '&counturl=' + encodeURIComponent(url);
              return refUrl;
            },
            class: 'social-button--tw',
            text: 'Твиттер'
          },
          mailru: {
            getPopupUrl: function (url, title, image, text) {
              let refUrl = 'http://connect.mail.ru/share?';
              refUrl += 'url=' + encodeURIComponent(url);
              refUrl += '&title=' + encodeURIComponent(title);
              refUrl += '&description=' + encodeURIComponent(text);
              refUrl += '&imageurl=' + encodeURIComponent(image);
              return refUrl;
            },
            class: 'social-button--mr',
            text: 'Мейл.Ру'
          }
        }
      }
    },

    props: [
      'requires',
      'url',
      'image',
      'title',
      'text'
    ],

    computed: {
    },

    methods: {
      isRequired: function (requireList, name) {
        let list = requireList.split(/\s*,\s*/);
        let inList = false;

        _.each(list, function (item) {
          if (name === item) inList = true;
        });
        return inList;
      },

      getUrl : function () {

        if (this.url !== undefined && this.url !== '') {
          return this.url;
        } else {
          return window.location.href;
        }
      },

      openPopup: function (button) {
        window.open(button.getPopupUrl(this.getUrl(), this.title, this.image, this.text),'','toolbar=0,status=0,width=626,height=436');
      }
    }
  }
</script>