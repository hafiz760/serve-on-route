import React from "react";
import { Dimensions, Platform, View } from "react-native";

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Container = (props) => {
    const insets = useSafeAreaInsets();
    return (
        <View style={[
            styles.container, 
           
            props.style
        ]}>
            {props.children}
        </View>
    )
}

const deviceHeight = Dimensions.get('window').height;

const styles = {
    container: {
        flex: 1,
    }
}

export default Container