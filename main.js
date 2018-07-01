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
    "query": ".header-user-dropdown button",
    "action": "click"
  }]
}]

function getLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve(coords),
      (err => reject(err))
    )
  })
}

async function getSunriseSunset() {
  const { latitude, longitude } = await getLocation()
  const url = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}`
  const res = await fetch(url)
  if (res.status !== 200) {
    throw new Error(res.text())
  }
  return res.json()
}

function isAfter(x, y) {
  return x.h > y.h || (x.h === y.h && x.m > y.m)
}

function strToDate(str) {
  const isPm = str.endsWith('PM')
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
  const element = Array.from(document.querySelectorAll('button'))
    .filter(e => e.innerText.trim() === 'Night Mode')[0]
  element.click()
  if (isDayTime) {
    localStorage.setItem('lastTheme', 'day')
  } else {
    localStorage.setItem('lastTheme', 'night')
  }
}

async function start() {
  const { results: { sunset, sunrise } } = await getSunriseSunset()
  const now = { h: new Date().getHours(), m: new Date().getMinutes() }
  // const now = { h: strToDate("8:00:00 PM").h + 1, m: 0 } // for test
  const isDayTime = isAfter(now, strToDate(sunrise))
    && isAfter(strToDate(sunset), now)
  const lastTheme = localStorage.getItem('lastTheme')
  if ((isDayTime && lastTheme === 'day')
    || (!isDayTime && lastTheme === 'night')) return
  const hostname = location.hostname.replace('www.', '')
  const website = websites.find(w => w.hostname === hostname)
  walkDom(website.selectors, element => {
    eval(`handle${website.name}(isDayTime, element)`)
  })
}

start()

