const websites = [{
  "name": "Twitter",
  "hostname": "twitter.com",
  "selectors": [{
    "query": "#user-dropdown-toggle",
    "action": "click"
  }, {
    "query": ".nightmode-toggle a"
  }]
}, {
  "name": "Youtube",
  "hostname": "youtube.com",
  "selectors": [{
    "query": "button.ytd-topbar-menu-button-renderer",
    "action": "click"
  }, {
    "query": ".ytd-popup-container .ytd-multi-page-menu-renderer .ytd-multi-page-menu-renderer:nth-child(2) .yt-multi-page-menu-section-renderer .yt-multi-page-menu-section-renderer",
    "action": "click"
  },
  {
    "query": ".ytd-popup-container #submenu #caption-container .ytd-toggle-item-renderer:last-child",
  }]
}, {
  "name": "Wikiwand",
  "hostname": "wikiwand.com",
  "selectors": [{
    "query": ".per_btn",
    "action": "click"
  }, {
    "query": ".theme",
  }]
}, {
  "name": "Reddit",
  "hostname": "reddit.com",
  "selectors": [{
    "query": ".header-user-dropdown",
    "action": "click"
  }]
}]

function getSunriseSunset() {
  const coordinates = {
    lat: 33.589886,
    lng: -7.603869
  }
  const url = `https://api.sunrise-sunset.org/json?lat=${coordinates.lat}&lng=${coordinates.lng}`
  // mocking sunrise sunset api for now
  return Promise.resolve({
    "sunrise": "5:26:43 AM",
    "sunset": "7:27:07 PM",
  })
}

function isAfter(x, y) {
  return x.h > y.h || (x.h === y.h && x.m > y.m)
}

function strToDate(str, isPm) {
  const arr = str.split(':')
  const h = parseInt(arr[0])
  const m = parseInt(arr[1])
  return {
    h: isPm ? h + 12 : h,
    m
  }
}

function walkDom(selectors, cb) {
  for (let index = 0; index < selectors.length; index++) {
    const selector = selectors[index];
    setTimeout(() => {
      const element = document.querySelector(selector.query)
      if (selector.action) {
        element[selector.action]()
      }
      if (index === selectors.length - 1) {
        cb(element)
      }
    }, (index + 1) * 1000);
  }
}

function handleTwitter(isDayTime, element) {
  const s = Array.from(element.querySelector('span').classList)
  const isNightModeActive = s.includes('Icon--crescentFilled')
  if (isDayTime && isNightModeActive) {
    localStorage.setItem('lastTheme', 'day')
    element.click()
  }
  if (!isDayTime && !isNightModeActive) {
    localStorage.setItem('lastTheme', 'night')
    element.click()
  }
}

function handleYoutube(isDayTime, element) {
  const isNightModeActive = element.getAttribute('aria-pressed') === 'true'
  if (isDayTime && isNightModeActive) {
    localStorage.setItem('lastTheme', 'day')
    element.click()
  }
  if (!isDayTime && !isNightModeActive) {
    localStorage.setItem('lastTheme', 'night')
    element.click()
  }
}

function handleWikiwand(isDayTime, element) {
  const isNightModeActive = Array
    .from(element.querySelector('.noUi-origin').classList)
    .includes('noUi-stacking')
  if (isDayTime && isNightModeActive) {
    localStorage.setItem('lastTheme', 'day')
    element.querySelector('span:first-child').click()
  }
  if (!isDayTime && !isNightModeActive) {
    localStorage.setItem('lastTheme', 'night')
    element.querySelector('span:last-child').click()
  }
}

function handleReddit(isDayTime) {
  const element = Array.from(document.querySelectorAll('a'))
    .filter(e => e.innerText.trim() === 'Night Mode')[0]
  if (isDayTime) {
    localStorage.setItem('lastTheme', 'day')
  } else {
    localStorage.setItem('lastTheme', 'night')
  }
  element.click()
}

(async () => {
  const { sunrise, sunset } = await getSunriseSunset()
  const now = { h: new Date().getHours(), m: new Date().getMinutes() }
  // const now = { h: strToDate(sunrise).h + 1, m: 0 } // to simulate daytime
  const isDayTime = isAfter(now, strToDate(sunrise)) && isAfter(strToDate(sunset, true), now)
  const lastTheme = localStorage.getItem('lastTheme')
  if ((isDayTime && lastTheme === 'day')
    || (!isDayTime && lastTheme === 'night')) return
  // console.log('isDayTime:', isDayTime)
  const hostname = location.hostname.replace('www.', '')
  const website = websites.find(w => w.hostname === hostname)
  walkDom(website.selectors, element => {
    eval(`handle${website.name}(isDayTime, element)`)
  })
})()
