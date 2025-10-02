export const bind = (t) => {
  t.references = {}
  t.references.inputs = {}

  t.focusNextField = (id) => {
    if (t.references.inputs[id]) {
      if (t.references.inputs[id]._root) {
        t.references.inputs[id]._root.focus && t.references.inputs[id]._root.focus()
      } else {
        t.references.inputs[id].focus && t.references.inputs[id].focus()
      }
    }
  }
  t.onChangeValue = async (key, value) => {
    const values = { ...t.state.values }
    values[key] = value
    await t.promisedSetState({ values })
  }
  t.onChangeText = async (key, value) => {
    const values = { ...t.state.values }
    values[key] = value
    await t.promisedSetState({ values })
  }
  t.promisedSetState = (newState) => {
    return new Promise((resolve) => {
      t.setState(newState, () => {
        resolve()
      })
    })
  }
  t.setInputRef = (key, r) => {
    t.references.inputs[key] = r
  }
}
