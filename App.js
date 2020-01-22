import React, { Component } from 'react';
import { StyleSheet, View, AsyncStorage,Platform } from 'react-native';

import { Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import Routes from './src/RootNavigator'
import './ReactotronConfig';
import { Provider } from 'react-redux';
import { store, persistedStore } from './src/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Root } from 'native-base'
import './ReactotronConfig';
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';


export default class App extends Component {

  constructor(props){
    super(props);
    this.loadFontAsync();
    this.state = {
      fontLoaded: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });

    // AsyncStorage.clear();
    I18nManager.forceRTL(true)
  }

  async componentWillMount() {

    const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return;
    }

    let token = await Notifications.getExpoPushTokenAsync();

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('notify', {
        name    : 'Chat messages',
        sound   : true,
      });
    }

  }
    
  async loadFontAsync() { try 
    {
      await Font.loadAsync({ CairoRegular: require("./assets/fonts/Cairo-Regular.ttf") });
      await Font.loadAsync({ CairoBold: require("./assets/fonts/Cairo-Bold.ttf") });
      this.setState({ fontLoaded: true });
    } catch (e) {
      console.log(e);
    }
  }
  
  render() {
    if (!this.state.fontLoaded) {
      return <View />;
    }
    return (
      <Provider store={store}>
        <PersistGate persistor={persistedStore}>
          <Root>
            <Routes/>
          </Root>
        </PersistGate>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex            : 1,
    fontFamily      : 'CairoRegular'
  },
});

