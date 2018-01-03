module.exports = [
  {
    name: 'facebook',
    url: 'https://facebook.com/%s',
    category: 'social',
    filters: [
      v => v.replace('-', '.')
    ]
  },
  {
    name: 'youtube',
    url: 'https://www.youtube.com/user/%s',
    category: 'video'
  },
  {
    name: 'twitter',
    url: 'https://twitter.com/%s',
    category: 'social'
  },
  {
    name: 'vkontakte',
    url: 'https://vk.com/%s',
    category: 'social'
  },
  {
    name: 'googleplus',
    url: 'https://plus.google.com/+%s',
    category: 'social',
    filters: [
      v => v.replace('.', '')
    ]
  },
  {
    name: 'linkedin',
    url: 'https://www.linkedin.com/in/%s',
    category: 'business'
  },
  {
    name: 'instagram',
    url: 'https://www.instagram.com/%s',
    category: 'social'
  },
  {
    name: 'github',
    url: 'https://github.com/%s',
    category: 'tech'
  },
  {
    name: 'bitbucket',
    url: 'https://bitbucket.org/%s',
    category: 'tech'
  },
  {
    name: 'twitch',
    url: 'https://www.twitch.tv/%s',
    category: 'gaming',
    filters: [
      v => v.replace(/\W/g, '')
    ]
  },
  {
    name: 'reddit',
    url: 'https://www.reddit.com/user/%s',
    category: 'news'
  },
  {
    name: 'flipboard',
    url: 'https://flipboard.com/@%s',
    category: 'news'
  },
  {
    name: 'myspace',
    url: 'https://myspace.com/%s',
    category: 'social'
  },
  {
    name: 'steam',
    url: 'http://steamcommunity.com/id/%s',
    category: 'gaming'
  },
  {
    name: 'ebay',
    url: 'https://www.ebay.it/usr/%s',
    category: 'marketplace'
  },
  {
    name: 'vimeo',
    url: 'https://vimeo.com/%s',
    category: 'video',
    filters: [
      v => v.replace(/[^a-zA-Z0-9]/g, '')
    ]
  },
  {
    name: 'soundcloud',
    url: 'https://soundcloud.com/%s',
    category: 'music'
  },
  {
    name: 'mixcloud',
    url: 'https://www.mixcloud.com/%s',
    category: 'music'
  },
  {
    name: 'bandcamp',
    url: 'https://%s.bandcamp.com/',
    category: 'music',
    filters: [
      v => v.replace(/\W/g, '')
    ]
  },
  {
    name: 'tumblr',
    url: 'https://%s.tumblr.com/',
    category: 'blog',
    filters: [
      v => v.replace(/[^a-zA-Z0-9-]/g, '')
    ]
  },
  {
    name: 'flickr',
    url: 'https://www.flickr.com/photos/%s',
    category: 'photography'
  },
  {
    name: 'fotolog',
    url: 'http://www.fotolog.com/%s',
    category: 'photography'
  },
  {
    name: 'canva',
    url: 'https://www.canva.com/%s',
    category: 'design'
  },
  {
    name: 'wordpress',
    url: 'https://profiles.wordpress.org/%s',
    category: 'blog'
  },
  {
    name: 'disqus',
    url: 'https://disqus.com/by/%s',
    category: 'blog',
    filters: [
      v => v.replace(/\W/g, '')
    ]
  },
  {
    name: 'fiverr',
    url: 'https://www.fiverr.com/%s',
    category: 'marketplace',
    filters: [
      v => v.replace(/\W/g, '')
    ]
  },
  {
    name: 'pinterest',
    url: 'https://www.pinterest.com/%s',
    category: 'bookmarking',
    filters: [
      v => v.replace(/[^a-zA-Z0-9]/g, '')
    ]
  },
  {
    name: 'badoo',
    url: 'https://badoo.com/en/profile/%s',
    category: 'dating'
  },
  {
    name: 'medium',
    url: 'https://medium.com/@%s'
  },
  {
    name: 'dailymotion',
    url: 'https://www.dailymotion.com/%s',
    category: 'video'
  },
  {
    name: 'about.me',
    url: 'https://about.me/%s',
    category: 'information'
  },
  {
    name: 'gravatar',
    url: 'https://gravatar.com/%s'
  },
  {
    name: 'tripadvisor',
    url: 'https://www.tripadvisor.com/members/%s',
    filters: [
      v => v.replace(/[^a-zA-Z0-9]/g, '')
    ]
  },
  {
    name: 'dribble',
    url: 'https://dribbble.com/%s'
  },
  {
    name: 'patreon',
    url: 'https://www.patreon.com/%s'
  },
  {
    name: 'slideshare',
    url: 'https://www.slideshare.net/%s',
    category: 'community'
  },
  {
    name: 'buzzfeed',
    url: 'https://www.buzzfeed.com/%s'
  },
  {
    name: 'codeacademy',
    url: 'https://www.codecademy.com/%s'
  },
  {
    name: 'keybase',
    url: 'https://keybase.io/%s'
  },
  {
    name: 'paypal',
    url: 'https://www.paypal.me/%s',
    category: 'business',
    filters: [
      v => v.replace(/\W/g, '')
    ]
  },
  {
    name: 'instructables',
    url: 'http://www.instructables.com/member/%s',
    category: 'community'
  },
  {
    name: 'deviantart',
    url: 'https://%s.deviantart.com/',
    category: 'design',
    filters: [
      v => v.replace(/[^a-zA-Z0-9-]/g, '')
    ]
  },
  {
    name: 'foursquare',
    url: 'https://foursquare.com/%s'
  },
  {
    name: 'kongregate',
    url: 'http://www.kongregate.com/accounts/%s'
  },
  {
    name: 'imgur',
    url: 'https://imgur.com/user/%s'
  },
  {
    name: 'wikipedia',
    url: 'https://en.wikipedia.org/wiki/%s',
    category: 'information'
  },
  {
    name: 'gamespot',
    url: 'https://www.gamespot.com/profile/%s',
    category: 'gaming'
  },
  {
    name: 'pornhub',
    url: 'https://pornhub.com/users/%s',
    category: 'porn'
  },
  {
    name: 'xvideos',
    url: 'https://www.xvideos.com/profiles/%s',
    category: 'porn'
  },
  {
    name: 'xhamster',
    url: 'https://xhamster.com/users/%s',
    category: 'porn'
  },
  {
    name: 'photobucket',
    url: 'http://smg.photobucket.com/user/%s/library',
    category: 'photo'
  },
  {
    name: 'polyvore',
    url: 'https://%s.polyvore.com/',
    category: 'marketplace'
  }
];
