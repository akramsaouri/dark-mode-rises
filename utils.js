const storage = {
  getSettings: () =>
    new Promise(resolve =>
      chrome.storage.sync.get(['dmr_settings'], ({ dmr_settings: settings }) =>
        resolve(settings)
      )
    ),
  setSettings: (settings) =>
    new Promise(resolve =>
      chrome.storage.sync.set({ dmr_settings: settings }, () =>
        resolve(settings)
      )
    )
}

const getLocation = () =>
  new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve(coords),
      (err => reject(err))
    )
  )

const getRiseSet = async ({ latitude, longitude }) => {
  const url = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}`
  const res = await fetch(url)
  if (res.status !== 200) {
    throw new Error(res.text())
  }
  return res.json()
}
