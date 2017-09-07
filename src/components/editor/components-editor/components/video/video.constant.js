// sources for regexp : https://github.com/itteco/iframely/blob/master/plugins/domains/

// TEST
// http://dai.ly/x466wst
// "<iframe frameborder="0" width="480" height="269" src="http://www.dailymotion.com/embed/video/x466wst" allowfullscreen></iframe>"

// https://www.facebook.com/526751759/videos/10153710522491760
//

// https://www.instagram.com/p/BBV3PshDAt9
//

// https://vimeo.com/152069351
// "<iframe src="https://player.vimeo.com/video/152069351" width="1920" height="1080" frameborder="0" title="Teaser du web-documentaire &quot;ASV STP&quot;" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>"

// https://youtu.be/ZdprZzanJI0
// " <div class="noembed-embed-inner noembed-youtube"> <iframe width=" 480" height="270" src="https://www.youtube.com/embed/ZdprZzanJI0?feature=oembed" frameborder="0" allowfullscreen></iframe> </div> "


export const VIDEO_EMBED = {
  dailymotion: {
    config: {
      method: 'JSONP',
      url: 'http://www.dailymotion.com/services/oembed',
      params: {
        callback: 'JSON_CALLBACK'
      }
    },
    re: [
      /^https?:\/\/(?:www\.)?dailymotion.com\/video\/[a-zA-Z0-9_-]+/i,
      /^https?:\/\/dai.ly\/[a-zA-Z0-9_-]+/i
    ]
  },
  // facebook: {
  //   config: {
  //     method: 'JSONP',
  //     url: 'https://www.facebook.com/plugins/video/oembed.json/',
  //     params: {
  //       callback: 'JSON_CALLBACK',
  //     }
  //   },
  //   re: [
  //     /^https?:\/\/(?:www|business)\.facebook\.com\/video\/video\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
  //     // /^https?:\/\/(?:www|business)\.facebook\.com\/photo\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
  //     /^https?:\/\/(?:www|business)\.facebook\.com\/video\/video\.php\?v=(\d{5,})$/i,
  //     /^https?:\/\/(?:www|business)\.facebook\.com\/video\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
  //     /^https?:\/\/(?:www|business)\.facebook\.com\/video\.php.*[\?&]id=(\d{5,})(?:$|&)/i,
  //     /^https?:\/\/(?:www|business)\.facebook\.com\/[a-zA-Z0-9.]+\/videos\/.+/i
  //   ]
  // },
  // instagram: {
  //   config: {
  //     method: 'JSONP',
  //     url: 'https://api.instagram.com/oembed',
  //     params: {
  //       callback: 'JSON_CALLBACK',
  //     }
  //   },
  //   re: [
  //     /^https?:\/\/[\w\.]*instagram\.com\/(?:[a-zA-Z0-9_-]+\/)?p\/([a-zA-Z0-9_-]+)/i,
  //     /^https?:\/\/instagr\.am\/(?:[a-zA-Z0-9_-]+\/)?p\/([a-zA-Z0-9_-]+)/i,
  //     /^https?:\/\/instagram\.com\/(?:[a-zA-Z0-9_-]+\/)?p\/([a-zA-Z0-9_-]+)$/i
  //   ]
  // },
  vimeo: {
    config: {
      method: 'JSONP',
      url: 'https://vimeo.com/api/oembed.json',
      params: {
        callback: 'JSON_CALLBACK',
      }
    },
    re: [
      /^https?:\/\/vimeo\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/i,
      /^https?:\/\/vimeo\.com\/[0-9]+/i,
    ]
  },
  youtube: {
    config: {
      method: 'JSONP',
      url: 'https://noembed.com/embed',
      params: {
        callback: 'JSON_CALLBACK',
        nowrap: 'on'
      }
    },
    re: [
      /^https?:\/\/(?:www\.)?youtube\.com\/(?:tv#\/)?watch\/?\?(?:[^&]+&)*v=([a-zA-Z0-9_-]+)/i,
      /^https?:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/i,
      /^https?:\/\/m\.youtube\.com\/#\/watch\?(?:[^&]+&)*v=([a-zA-Z0-9_-]+)/i,
      /^https?:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9_-]+)/i,
      /^https?:\/\/www\.youtube\.com\/v\/([a-zA-Z0-9_-]+)/i,
      /^https?:\/\/www\.youtube\.com\/user\/[a-zA-Z0-9_-]+\/?\?v=([a-zA-Z0-9_-]+)/i,
      /^https?:\/\/www\.youtube-nocookie\.com\/v\/([a-zA-Z0-9_-]+)/i
    ]
  }
};