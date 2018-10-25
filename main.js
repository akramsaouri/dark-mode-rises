// const websites = [{
//   "name": "Twitter",
//   "hostname": "twitter.com",
//   "selectors": [{
//     "query": "#user-dropdown-toggle",
//     "action": "click"
//   }, {
//     "query": ".nightmode-toggle a"
//   }]
// }, {
//   "name": "Youtube",
//   "hostname": "youtube.com",
//   "selectors": [{
//     "query": "button.ytd-topbar-menu-button-renderer",
//     "action": "click"
//   }, {
//     "query": "#items > ytd-toggle-theme-compact-link-renderer",
//     "action": "click"
//   },
//   {
//     "query": ".ytd-popup-container #submenu #caption-container .ytd-toggle-item-renderer:last-child",
//   }]
// }, {
//   "name": "Wikiwand",
//   "hostname": "wikiwand.com",
//   "selectors": [{
//     "query": ".per_btn",
//     "action": "click"
//   }, {
//     "query": ".theme",
//   }]
// }, {
//   "name": "Reddit",
//   "hostname": "reddit.com",
//   "selectors": [{
//     "query": ".header-user-dropdown button",
//     "action": "click"
//   }]
// }]

// async function main() {
//   const { results } = await getSunriseSunset(await getLocation())
//   // sunset = '4:12:00 PM'
//   const hostname = location.hostname.replace('www.', '')
//   const website = websites.find(w => w.hostname === hostname)

//   !(function toggle() {
//     if (shouldToggle(results)) {
//       walkDom(website.selectors, (err, elm) => {
//         if (!err) {
//           eval(`handle${website.name}(isDayTime, element)`)
//         }
//       })
//     } else {
//       setTimeout(toggle, 1000);
//     }
//   })()
// }

// function shouldToggle({ sunset, sunrise }) {
//   const d = new Date()
//   const now = {
//     h: d.getHours(),
//     m: d.getMinutes()
//   }
//   const isDayTime = isAfter(now, strToDate(sunrise))
//     && isAfter(strToDate(sunset), now)
//   const lastTheme = localStorage.getItem('lastTheme')
//   return (isDayTime && lastTheme !== 'day')
//     || (!isDayTime && lastTheme !== 'night')
// }

// function getLocation() {
//   return new Promise((resolve, reject) => {
//     navigator.geolocation.getCurrentPosition(
//       ({ coords }) => resolve(coords),
//       (err => reject(err))
//     )
//   })
// }

// async function getSunriseSunset({ latitude, longitude }) {
//   const url = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}`
//   const res = await fetch(url)
//   if (res.status !== 200) {
//     throw new Error(res.text())
//   }
//   return res.json()
// }

// function isAfter(x, y) {
//   return x.h > y.h || (x.h === y.h && x.m > y.m)
// }

// function strToDate(str) {
//   const isPm = str.endsWith('PM')
//   const arr = str.split(':')
//   const h = parseInt(arr[0])
//   const m = parseInt(arr[1])
//   return {
//     h: isPm ? h + 12 : h,
//     m
//   }
// }

// function walkDom(selectors, cb) {
//   for (let index = 0; index < selectors.length; index++) {
//     const selector = selectors[index]
//     setTimeout(() => {
//       const element = document.querySelector(selector.query)
//       if (selector.action) {
//         element[selector.action]()
//       }
//       if (index === selectors.length - 1) {
//         cb(element)
//       }
//     }, (index + 1) * 1000)
//   }
// }

// function handleTwitter(isDayTime, element) {
//   const s = Array.from(element.querySelector('span').classList)
//   const isNightModeActive = s.includes('Icon--crescentFilled')
//   if (isDayTime && isNightModeActive) {
//     localStorage.setItem('lastTheme', 'day')
//     element.click()
//   }
//   if (!isDayTime && !isNightModeActive) {
//     localStorage.setItem('lastTheme', 'night')
//     element.click()
//   }
// }

// function handleYoutube(isDayTime, element) {
//   const isNightModeActive = element.getAttribute('aria-pressed') === 'true'
//   if (isDayTime && isNightModeActive) {
//     localStorage.setItem('lastTheme', 'day')
//     element.click()
//   }
//   if (!isDayTime && !isNightModeActive) {
//     localStorage.setItem('lastTheme', 'night')
//     element.click()
//   }
// }

// function handleWikiwand(isDayTime, element) {
//   const isNightModeActive = Array
//     .from(element.querySelector('.noUi-origin').classList)
//     .includes('noUi-stacking')
//   if (isDayTime && isNightModeActive) {
//     localStorage.setItem('lastTheme', 'day')
//     element.querySelector('span:first-child').click()
//   }
//   if (!isDayTime && !isNightModeActive) {
//     localStorage.setItem('lastTheme', 'night')
//     element.querySelector('span:last-child').click()
//   }
// }

// function handleReddit(isDayTime) {
//   const element = Array.from(document.querySelectorAll('button'))
//     .filter(e => e.innerText.trim() === 'Night Mode')[0]
//   element.click()
//   if (isDayTime) {
//     localStorage.setItem('lastTheme', 'day')
//   } else {
//     localStorage.setItem('lastTheme', 'night')
//   }
// }

// function handleLocal(isDayTime, element) {
//   element.click()
//   if (isDayTime) {
//     localStorage.setItem('lastTheme', 'day')
//   } else {
//     localStorage.setItem('lastTheme', 'night')
//   }
// }

// main()
