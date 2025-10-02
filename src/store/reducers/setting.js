import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  languages: [],
  translations: {
  },

  languageIndex: -1,
  languageCode: '',

  enableStartupLanguageFetching: true,
  shownIntroductionSlider: false,
  shownLanguageSelection: false
}

const callbacks = {}

callbacks.updateLanguages = (state, action) => {
  const languages = action.payload.languages.map(r => ({
    id: r.id,
    code: r.code,
    name: r.translated_name,
    image: r.country_flag_url,
    direction: r.direction,
    default: r.major === '1' || r.major === 1
  }))
  let languageIndex = -1
  let languageCode = ''
  if (state.languageIndex > -1) {
    languageIndex = state.languages.findIndex(r => (r.code === state.languageCode))
  } else {
    languageIndex = state.languages.findIndex(r => r.default)
  }
  if (state.languageIndex === -1 && state.languages.length) {
    languageIndex = 0
  }

  if (languages[languageIndex]) {
    const language = languages[languageIndex]
    languageCode = language.code
  }

  state.languages = languages
  state.languageIndex = languageIndex
  state.languageCode = languageCode
}

callbacks.changeLanguage = (state, action) => {
  const languageIndex = state.languages.findIndex(r => (r.code === action.payload.code))

  if (state.languages[languageIndex]) {
    const language = state.languages[languageIndex]
    state.languageIndex = languageIndex
    state.languageCode = language.code
  }
}

callbacks.updateTranslation = (state, action) => {
  state.translations[action.payload.code] = action.payload.list
}

callbacks.updateEnableStartupLanguageFetching = (state, action) => {
  state.enableStartupLanguageFetching = action.payload
}

callbacks.updateShownIntroductionSlider = (state, action) => {
  state.shownIntroductionSlider = action.payload
}

callbacks.updateShownLanguageSelection = (state, action) => {
  state.shownLanguageSelection = action.payload
}

const slice = createSlice({
  name: 'setting',
  initialState: { ...initialState },
  reducers: callbacks
})

const { actions, reducer } = slice

export const {
  updateLanguages,
  changeLanguage,
  updateTranslation,
  updateEnableStartupLanguageFetching,
  updateShownIntroductionSlider,
  updateShownLanguageSelection
} = actions

export default reducer
