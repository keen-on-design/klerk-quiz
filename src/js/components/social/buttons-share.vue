<template>
    <div class="block-share">
        <button
            v-for="button in buttons"
            v-bind:class="getButtonConfig(button).class"
            v-on:click="openPopup(button)"
            v-show="isDefined(button)"
            class="share-button--popup"
            type="button">
            <img v-bind:src="getButtonConfig(button).image"/>
        </button>
    </div>
</template>

<script lang="babel">
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
            class: 'button--vk',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAUCAYAAADlep81AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTFCNzk2OERFNUFDMTFFNjlFMDA4MUE5NjY4RDdFNjIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTFCNzk2OEVFNUFDMTFFNjlFMDA4MUE5NjY4RDdFNjIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5MUI3OTY4QkU1QUMxMUU2OUUwMDgxQTk2NjhEN0U2MiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5MUI3OTY4Q0U1QUMxMUU2OUUwMDgxQTk2NjhEN0U2MiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlWK0pUAAAHcSURBVHjavJbPK4RBHMZnd620bVmriBxIrZuDHBTuiotapZQLFyna25ZSuG2EAxdFK/8DJznYgzZK+VGUgySpRSuW7Ho9o3lrTPNr1e5Tn97afb4zz/u+M995PY7j+AghYeBleNg1yxA1AiZBBASAn9W8gjMQBymiVlAyF+UbZAgCXTlyfYBBQDgCYAPkHbWOhRqeLUevRWra1xjOgUcy8Jim5lERphkUDIEWqLHPYBqQDB7S+B8UgVYN87yDJtec1hjTiqeUU/hvJd4G8GYINEO9bkG/wTwsmeRJ4b2WeDcM4x8BPx+IktIU3IGgMMmzwnsp+LoMaycLWl0/X9htuIs1zuvT7DQ+UBW4MIwb5W9AfLTbhuIh5mux3GWbpm0uvl4xUD140QxAF+YEWDdMFAdJg+cQVJgCUaac0ouuqYisPfxuZ0H0KDkB7aR0yoA6dlz8kVdiLoBR8FnCQLVgVvqP5tyZLsOrm7dZQzw7ZQi1VEygSnDwj0lotx5nh7ONlm0DEdahd4sM1MNqa9ixYKOYbSDC+kXC8B3kKiccxmGLbk31BTpsA7l0gj3DwDeSukZwahEqKetDNmoDUdDLPmWD7Pc8SIAVSU01mGOfwCHmzbM2Q6/3IPYjwAAq70vVTVkF1AAAAABJRU5ErkJggg=='
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
            class: 'button--ok',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAcCAYAAABoMT8aAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODJDMUM3MDlFNUFDMTFFNjhBOTFCMTZFODVFNjcyRjAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODJDMUM3MEFFNUFDMTFFNjhBOTFCMTZFODVFNjcyRjAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4MkMxQzcwN0U1QUMxMUU2OEE5MUIxNkU4NUU2NzJGMCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4MkMxQzcwOEU1QUMxMUU2OEE5MUIxNkU4NUU2NzJGMCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pm0LhCIAAAG/SURBVHjanJVNS0JREIaPgn1YSVSUFVRIEC3aZcvATUG0CpLatHFhfyBw0yLob7RrGbQqIoKCaBVEYNmXUtJGqTRMKIjb6T02F27jOXbthQfszMzrzD3jTUgpBaMHrINz8AZK4AysgS6ez4sXqcikVzBnMliS7vQF5rnBIHiX7lUGvarWK36UAE3it3ZAFCyAfRZrASuVT9RBnn3DpubhbrGcB3uETk2LYxqDCU1esxrBL6r15PLMrwzywGKBaU0yP/sABbu9I9baM4g42p8CRZaz67zGqOG6suDREJt1GnjAXh17sK3bxHZw4qL4ELSZfguNYJV2nqsAEsDnrPFUXIQYBa3glJ5wA5gEIbVrIAOOwSfFw6AMrgS52roEMepE112McmwlVAcvcOpgd1wCNyBNfw+DERBgeQVlkKIR/qPKCGGQkfVL1Yzb86knuwySLgqTlOvTXaNiBliaQotiNd+JoRqrKykWMhkM0e7/pSzlVr0T7w3zXmjOVe6AbRAw3EIKdBMpTTytapVBXBO8BkHHeEE644qrN1KRLccdiICc4yxHZ7cst6jcvWCD/oUdgH7N1dr0UU6JarzfAgwA9krZE6bsV9EAAAAASUVORK5CYII='
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
            class: 'button--fb',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAYCAYAAADKx8xXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEFCOURBQzhFNUFDMTFFNkJGMDVGODU0Q0E1MEIyQTQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OEFCOURBQzlFNUFDMTFFNkJGMDVGODU0Q0E1MEIyQTQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4QUI5REFDNkU1QUMxMUU2QkYwNUY4NTRDQTUwQjJBNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4QUI5REFDN0U1QUMxMUU2QkYwNUY4NTRDQTUwQjJBNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlkLPCMAAACKSURBVHjaYvj//z8DDhwMxAeA+C0Q//2PAD9B8rg0rfiPG+DU6PcfPwBrZGLABCkMRAAWLGKKWMRmAPE0IP4GxP/BIlic+g6L83TR1WFzKjaxX7icKgDEwng0ygLxHygb5NR7MKur/xMP3uJyKiHwBJezaKsRW3R8wOIvNWKigygwqnFUI3kAIMAANwow/Qvm6CQAAAAASUVORK5CYII='
          },
          twitter: {
            getPopupUrl: function (url, title, image, text) {
              let refUrl = 'http://twitter.com/share?';
              refUrl += 'text=' + encodeURIComponent(title);
              refUrl += '&url=' + encodeURIComponent(url);
              refUrl += '&counturl=' + encodeURIComponent(url);
              return refUrl;
            },
            class: 'button--tw',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6N0I3N0NCMjJFNUFDMTFFNjlGMUNDMDcxMTVFRjk2NTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6N0I3N0NCMjNFNUFDMTFFNjlGMUNDMDcxMTVFRjk2NTYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3Qjc3Q0IyMEU1QUMxMUU2OUYxQ0MwNzExNUVGOTY1NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3Qjc3Q0IyMUU1QUMxMUU2OUYxQ0MwNzExNUVGOTY1NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuF7ez4AAAHASURBVHjatNZNK0RRHMfxY2I0siATNkIWYiPJDsVKCZshGy+AnZWSV+BhNd6Ah7JDHnYoD3lospM8lPIcsxESylzfq3N0u46ZOePOvz4193bu/Z17z51zjrAsS/xTKaZwizecYQS5rnY1CKiDOnSlEBbCo6WvYzSgF4uYt69RF4bxgTaDsGq8W8nVPSrhz/hOFWIdzXhDCCsicW2hIYl29j3HUYRD1ds9R29imEBOnKersMxrAT51g1lNgxO02400gR2GYdPIdI5hd5zGFxhCmSOw0zCwQl2rxjAL+6hNMB5POMIjWkXyVYio/UMFtuMSSygR3tYn/IjZBz55sg8RBIT3FVVhzsAD+VqDaQiMOA9UYBgvIj21qgt8wACsdAe6/189iFre1a77P+xz9eYZwzjz6OlGf51x9aDfw6c71c1S7sBs7HgQ9okm3Tysm5jzsfbPwLG/Jv54612bXDVuDMO25ZvS3teX4HO2P6Jig49kQ86x73+20PSiHIO4M3yy5QRr6M8rbcGMHLfzFMYrKvctSW1N1I8qTOLVIOhK7s6CJhsvtTypypNLVSPq5T6kQI7lNa5wjjlspjIVfgkwADkbmQkBPeVrAAAAAElFTkSuQmCC'
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
            class: 'button--mr'
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

<style lang="sass">
    @import "bourbon";

    .block-share {
        margin: 10px 0;
        text-align: center;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .share-button--popup {
        position: relative;
        display: block;
        min-width: 45px;
        height: 32px;
        overflow: hidden;
        padding: 0 15px;
        cursor: pointer;
        word-spacing: -.5px;
        color: #000;
        border: 1px solid rgba(0,0,0,.2);
        border-top: 1px solid rgba(0,0,0,.1);
        border-bottom: 1px solid rgba(0,0,0,.4);
        border-radius: 2px;
        outline: none;
        box-shadow: inset 0 1px 0 0 hsla(0,0%,100%,.3);
        white-space: nowrap;
        margin: 0 5px 0 5px;

        &:first-child {margin: 0 5px 0 0;}

        &:last-child {
             margin: 0 0 0 5px;
        }

        &:after {
             position: absolute;
             z-index: 1;
             top: 0;
             left: 0;
             width: 100%;
             height: 100%;
             content: "";
             transition: opacity .15s ease-in-out;
             opacity: 0;
             background-color: #000;
        }

        img {
            height: 12px;
        }

        &:hover {
            &:after {
                opacity: .15;
            }
        }
    }

    .button--fb {
        @include linear-gradient(#3B5998, darken(#3B5998, 10%));
        img {
            height: 14px;
        }
    }

    .button--tw {
        @include linear-gradient(#1DA0F2, darken(#1DA0F2, 10%));
    }

    .button--ok {
        @include linear-gradient(#F7931E, darken(#F7931E, 10%));
        img {
            height: 14px;
        }
    }

    .button--vk {
        background-image: linear-gradient(180deg, #304591 0%, #2B3E82 100%);
        img {
            height: 11px;
        }
    }
</style>