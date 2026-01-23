import React from 'react';
import { BackHandler } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Support from '@component/Support';
import { goBack } from '@navigation';
import Navigator from '@navigation/screen';
import { store, persistor } from '@store';
import Toast from 'react-native-toast-message';
import { requestUserPermission } from '../helper/pushnotification_helper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      storeLoaded: false,
      loading: true,
      bool: false,
    };

    this.initiate = this.initiate.bind(this);
    this.onBeforeLift = this.onBeforeLift.bind(this);
  }

  componentDidMount() {
    requestUserPermission();
    this.storage();

    BackHandler.addEventListener('hardwareBackPress', function () {
      goBack();
      return true;
    });

    this.initiate();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', function () { });
  }

  async initiate() {
    if (!this.state.storeLoaded) {
      setTimeout(this.initiate, 1000);
      return;
    }
    this.setState({
      loading: false,
    });
  }

  async storage() {
    let mun = (await AsyncStorage.getItem('role')) == 'Driver';

    this.setState({ bool: mun });
  }

  onBeforeLift() {
    this.setState({ storeLoaded: true });
  }

  render() {
    return (
      <Provider store={store}>
        <SafeAreaProvider>
          <PersistGate
            loading={null}
            persistor={persistor}
            onBeforeLift={this.onBeforeLift}>
            {this.state.loading ? null : (
              <SafeAreaView style={{ flex: 1 }}>
                <Navigator />
              </SafeAreaView>
            )}
          </PersistGate>
          <Toast visibilityTime={1800} />
          <Support />
        </SafeAreaProvider>
      </Provider>
    );
  }
}
