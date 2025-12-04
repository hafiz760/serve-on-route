import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

const ScreenWrapper = Component => {
  return props => {
    return (
      <SafeAreaView style={{flex: 1}} edges={['bottom']}>
        <Component {...props} />
      </SafeAreaView>
    );
  };
};

export default ScreenWrapper;
