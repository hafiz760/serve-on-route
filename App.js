// 

import React from "react";
import { BackHandler } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Support from "@component/Support";
import { setLandingScreen, goBack } from "@navigation";
import Navigator from "@navigation/screen";
import { store, persistor } from "@store";
import Toast from "react-native-toast-message";
import { StripeProvider } from '@stripe/stripe-react-native';
import { requestUserPermission } from "../helper/pushnotification_helper";

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

    BackHandler.addEventListener("hardwareBackPress", function () {
      goBack();
      return true;
    });

    this.initiate();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", function () {});
  }

  async initiate() {
    if (!this.state.storeLoaded) {
      setTimeout(this.initiate, 1000);
      return;
    }

    const routeData = {};

    this.setState({
      loading: false,
    });
  }

  async storage() {
    let mun = (await AsyncStorage.getItem("role")) == "Driver";

    this.setState({ bool: mun });
  }

  onBeforeLift() {
    this.setState({ storeLoaded: true });
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate
          loading={null}
          persistor={persistor}
          onBeforeLift={this.onBeforeLift}
        >
          {this.state.loading ? null : 
          
          <Navigator 
          
          />}
        </PersistGate>
        <Toast visibilityTime={1800} />
        <Support />
      </Provider>
    );
  }
}
