import {objectToGetParams} from 'utils/utils.window';

export function twitter(url) {
  let generator = function ({ title, via, hashtags = [] }) {
    return 'https://twitter.com/share' + objectToGetParams({
        url,
        text: title,
        via,
        hashtags: hashtags.join(','),
      });
  };
  generator.schema = ['title', 'via', 'hashtags'];
  return generator;
}

export function facebook(url) {
  /*
   https://developers.facebook.com/apps/111067065633348/settings/

   http://www.facebook.com/dialog/feed?
   app_id=111067065633348&
   link=http://developers.facebook.com/docs/reference/dialogs/&
   picture=http://fbrell.com/f8.jpg&
   name=Facebook%20Dialogs&
   caption=Reference%20Documentation&
   description=Dialogs%20provide%20a%20simple,%20consistent%20interface%20for%20applications%20to%20interact%20with%20users.&
   message=Facebook%20Dialogs%20are%20so%20easy!&
   redirect_uri=http://www.example.com/response*/
  let generator = function ({ title, description, picture, hashtag }) {
    return 'https://www.facebook.com/sharer/sharer.php' + objectToGetParams({
        u: url,
        picture,
        title,
        description,
        hashtag,
      });
  };
  generator.schema = ['title', 'description', 'picture', 'hashtag'];
  return generator;
};

export function googlePlus(url) {
  let generator = function () {
    return 'https://plus.google.com/share' + objectToGetParams({ url });
  };
  generator.schema = [];
  return generator;
}

export function linkedin(url) {
  let generator = function ({ title, description }) {
    return 'https://linkedin.com/shareArticle' + objectToGetParams({
        url,
        title,
        summary: description,
      });
  };
  generator.schema = ['title', 'description'];
  return generator;
}

export function pinterest(url) {
  let generator = function ({ picture, description }) {
    return 'https://pinterest.com/pin/create/button/' + objectToGetParams({
        url,
        media: picture,
        description
      });
  };
  generator.schema = ['picture', 'description'];
  return generator;
}

export function vkontakte(url) {
  let generator = function ({ title, description, picture }) {
    return 'https://vk.com/share.php' + objectToGetParams({
        url,
        title,
        description,
        image: picture,
      });
  };
  generator.schema = ['title', 'description', 'picture'];
  return generator;
}

export function odnoklassniki(url) {
  let generator = function ({ title, description, picture }) {
    return 'https://connect.ok.ru/offer' + objectToGetParams({
        url,
        title,
        description,
        imageUrl: picture,
      });
  };
  generator.schema = ['title', 'description', 'picture'];
  return generator;
}