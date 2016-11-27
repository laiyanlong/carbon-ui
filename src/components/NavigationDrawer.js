import React, { Component, PropTypes } from 'react'
import { Animated, TouchableWithoutFeedback, View } from 'react-native-universal'
import ps from 'react-native-ps'
import Uranium, { animate } from 'uranium'
import { Animations, Breakpoints, Elevation, Colors, gu } from '../index'

/**
 * The navigation drawer slides in from the left and contains the navigation
 * destinations for your app.
 *
 *
 * ### Examples
 *
 *
 *      import React, { Component } from 'react'
 *      import { View } from 'react-native-universal'
 *      import { NavigationDrawer, List, ListItem, RaisedButton } from 'carbon-ui'
 *
 *      export default class Example extends Component {
 *        state = { open: false }
 *
 *        _toggleOpen = () => this.setState({ open: !this.state.open })
 *
 *        render() {
 *          return (
 *            <View style={{ height: 200 }}>
 *              <NavigationDrawer
 *                open={this.state.open}
 *                onOverlayPress={this._toggleOpen}>
 *                <List>
 *                  <ListItem
 *                    primaryText="Link one"
 *                    onPress={this._toggleOpen} />
 *                  <ListItem
 *                    primaryText="Link two"
 *                    onPress={this._toggleOpen} />
 *                </List>
 *              </NavigationDrawer>
 *              <View style={{ justifyContent: 'flex-start', flexDirection: 'row' }}>
 *                <RaisedButton
 *                  onPress={this._toggleOpen}>
 *                  Toggle
 *                </RaisedButton>
 *              </View>
 *            </View>
 *          )
 *        }
 *      }
 *
 */
class NavigationDrawer extends Component {
  state = { shown: this.props.open }

  componentWillReceiveProps(next) {
    const { open } = this.props

    if (!open && next.open) {
      this.setState({ shown: true }, () => {
        Animations.entrance(this._openAV).start()
      })
    }
    if (open && !next.open) {
      Animations.exit(this._openAV, 0).start(() => {
        this.setState({ shown: false })
      })
    }
  }

  _openAV = new Animated.Value(this.props.open)

  render() {
    const { onOverlayPress, children } = this.props

    if (!this.state.shown) return <View />

    return (
      <View style={styles.base}>
        <TouchableWithoutFeedback onPress={onOverlayPress}>
          <Animated.View
            style={[
              styles.overlay,
              animate('backgroundColor', Colors.blackTransparent, Colors.blackSecondary, this._openAV),
            ]} />
        </TouchableWithoutFeedback>
        <Animated.View
          css={[
            styles.menu,
            animate(styles.menuClosed, styles.menuOpen, this._openAV),
          ]}>
          {children}
        </Animated.View>
      </View>
    )
  }
}

NavigationDrawer.propTypes = {
  /**
   * Will open the drawer if set to true.
   */
  open: PropTypes.bool,
  /**
   * Callback for when the overlay is pressed
   */
  onOverlayPress: PropTypes.func,

  children: PropTypes.node,
}

NavigationDrawer.defaultProps = {
  open: false,
}

export default Uranium(NavigationDrawer)

const styles = ps({
  base: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,

    zIndex: 200,
  },

  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  menu: {
    position: 'absolute',
    top: 0,
    bottom: 0,

    width: 70 * gu,

    backgroundColor: Colors.white,

    ...Elevation.dp16,

    [Breakpoints.sm]: {
      width: 80 * gu,
    },
  },

  menuClosed: {
    left: -70 * gu,

    [Breakpoints.sm]: {
      left: -80 * gu,
    },
  },

  menuOpen: {
    left: 0,

    [Breakpoints.sm]: {
      left: 0,
    },
  },


  // HACK Elevation overrides zIndex on android--this puts the base higher than
  // everything else (namely, the AppBar)
  android: {
    base: {
      elevation: 16,
    },
  },
})