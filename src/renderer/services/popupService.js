import store from '../store'
import WindowService from '../services/windowService'
import {
  PopupDisplayTypes
} from '../models/popups/Popup'

let popouts = []

export default class PopupService {
  static remove(popup) {
    this.$store.commit('releasePopup', popup)
  }

  static push(popup) {
    console.log(popup);

    if (store.state.popups.find(x => JSON.stringify(x.data) === JSON.stringify(popup.data))) {
      return false
    }

    if (popup.displayType === PopupDisplayTypes.POP_OUT) {
      return this.openPopOut(popup)
    }

    this.$store.commit('pushPopup', popup)

    if (popup.displayType === PopupDisplayTypes.SNACKBAR) {
      setTimeout(() => this.$store.commit('releasePopup', popup),
        popup.data.props.timeout)
    }
  }

  static openPopOut(popup) {
    let responded = false
    const cocos = store.state.cocos
    const {
      width,
      height
    } = popup.dimensions()

    const respond = result => {
      popouts = popouts.filter(x => x.id !== popup.id)
      popup.data.callback(Object.assign(popup, {
        result
      }))
    }

    // Rate limiting: One open pop out at a time per origin.
    if (popouts.find(x => x.data.props.payload.origin === popup.data.props.payload.origin)) {
      return false
    }

    popouts.push(popup)

    WindowService.openPopOut(
      readyWindow => WindowService.sendAndWait(readyWindow.id, 'popup', {
        cocos,
        popup
      }).then(result => {
        responded = true
        respond(result)
      }),
      closedWithoutAction => {
        if (!responded) respond(null)
      },
      width, height
    )
  }

  static promptGuard(prompt, callback) {
    prompt.data.callback = callback
    this.push(prompt)
  }
}