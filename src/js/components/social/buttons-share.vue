<template>
    <div class="share">
        <button v-for="button in buttons" v-bind:class="getButtonConfig(button).class" v-on:click="openPopup(button)" v-show="isDefined(button)" type="button">
            {{ getButtonConfig(button).text }}
        </button>
    </div>
</template>

<script>
  let _ = require('underscore');

  module.exports = {
    data () {
      return {

        buttons: this.requires.split(/\s*,\s*/),

        configs: {
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

    props: {
      requires : {
        type: String,
        required: true,
      },
      url: {
        type: String
      },
      image: {
        type: String
      },
      title: {
        type: String
      },
      text: {
        type: String
      }
    },

    methods: {
      isDefined: function (button) {
        return _.has(this.configs, button);
      },

      getButtonConfig: function (button) {
        return this.configs[button];
      },

      getUrl : function () {
        if (this.url !== undefined && this.url !== '') {
          return this.url;
        } else {
          return window.location.href;
        }
      },

      openPopup: function (button) {
        window.open(this.getButtonConfig(button).getPopupUrl(this.getUrl(), this.title, this.image, this.text),'','toolbar=0,status=0,width=626,height=436');
      }
    }
  }
</script>