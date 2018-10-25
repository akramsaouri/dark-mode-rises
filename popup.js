const methods = {
  RISESET: 'riseset',
  SCHEDULED: 'scheduled'
}

const inputs = {
  light: document.querySelector('input[name="light"]'),
  dark: document.querySelector('input[name="dark"]')
}

const error = document.querySelector('.error')

const getSettings = async () => {
  const settings = await storage.getSettings()
  if (settings) { // user already configured settings
    checkRadio(settings.method)
    renderSettingsDetails(settings)
    if (settings.method === methods.SCHEDULED) {
      setInputsValue(settings)
    }
  }
}

const setSettings = async () => {
  const method = document.querySelector('input[name="method"]:checked').value
  let settings = { method }
  if (method === methods.RISESET) {
    try {
      const { results: { sunrise, sunset } } = await getRiseSet(await getLocation())
      settings = {
        light: sunrise,
        dark: sunset,
        ...settings
      }
    } catch (e) {
      console.log(e)
      return renderError('An error occured while requesting geo location.')
    }
  } else if (method === methods.SCHEDULED) {
    const valid = validateInputs()
    if (valid) {
      settings = {
        light: inputs.light.value,
        dark: inputs.dark.value,
        ...settings
      }
    } else {
      return renderError('Please enter valid light/dark values.')
    }
  } else {
    throw new Error('Invalid method name.')
  }
  await storage.setSettings(settings)
  renderSettingsDetails(settings)
  removeError()
}

const checkRadio = (method) => {
  document.querySelector('#' + method).checked = true
}

const renderSettingsDetails = ({ light, dark }) => {
  document.querySelector('.riseset-details').textContent 
    = `light at ${light}/dark at ${dark}`
}

const setInputsValue = ({ light, dark }) => {
  inputs.light.value = light
  inputs.dark.value = dark
}

const validateInputs = () => {
  const regExp = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
  return [inputs.light.value, inputs.dark.value].every(value => 
    regExp.test(value)
  )
}

const renderError = (msg) => {
  error.textContent = msg
}

const removeError = () => {
  error.textContent = ''
}

getSettings()
document.querySelector('.update-btn').addEventListener('click', setSettings)
