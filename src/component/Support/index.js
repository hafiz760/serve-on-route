import React from 'react'
import Toast from 'react-native-toast-message'

import Loader from './Loader'
import DialogErrorToast from './DialogErrorToast'
import DialogError from './DialogError'
import DialogSuccess from './DialogSuccess'
import DialogConfirm from './DialogConfirm'



class Support extends React.PureComponent {
  static showLoading () {
    Loader.instance.showLoading()
  }

  static hideLoading () {
    Loader.instance.hideLoading()
  }

  static async showServerError (e, c = {}) {
    const messages = []
    if (typeof e === 'object') {
      if (e.name === 'ValidationError') {
        e.errors.forEach(v => {
          messages.push(v)
        })
      } else if (typeof e.response === 'object') {
        if (typeof e.response.data === 'object') {
          if (typeof e.response.data.errors === 'object') {
            const errors = e.response.data.errors
            Object.keys(errors).forEach(k => {
              Object.values(errors[k]).forEach(v => messages.push(v))
            })
          } else if (typeof e.response.data.error === 'string') {
            messages.push(e.response.data.error)
          }
          if (messages.length === 0) {
            if (e.response.data.message) {
              messages.push(e.response.data.message)
            }
          }
        }
      } else if (typeof e.message === 'string') {
        messages.push(e.message)
      } else if (typeof e.error === 'string') {
        messages.push(e.error)
      }
    } else if (typeof e === 'string') {
      messages.push(e)
    }
    if (messages.length === 0) {
      messages.push('Failed')
    }
    await Support.showError({
      message: messages.join('\n'),
      ...c
    })
  }

  static async showError (c = {}) {
    if (c.layout === 'toast') { /* modal | toast */
      await DialogErrorToast.instance.showDialog(c)
    } else {
      await DialogError.instance.showDialog(c)
    }
  }

  static async showSuccess (c = {}) {
    await DialogSuccess.instance.showDialog(c)
  }

  static async hideSuccess () {
    await DialogSuccess.instance.hideDialog()
  }

  static async showConfirm (c = {}) {
    await DialogConfirm.instance.showDialog(c)
  }

  render () {
    return (
      <>
        <Loader
          key='Loader'
          ref={c => {
            if (c) Loader.instance = c
          }}
        />
        <DialogErrorToast
          key='DialogErrorToast'
          ref={c => {
            if (c) DialogErrorToast.instance = c
          }}
        />
        <DialogError
          key='DialogError'
          ref={c => {
            if (c) DialogError.instance = c
          }}
        />
        <DialogSuccess
          key='DialogSuccess'
          ref={c => {
            if (c) DialogSuccess.instance = c
          }}
        />
        <DialogConfirm
          key='DialogConfirm'
          ref={c => {
            if (c) DialogConfirm.instance = c
          }}
        />
        <Toast />
      </>
    )
  }
}

export default Support
