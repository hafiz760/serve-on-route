import React from "react";
import { Dimensions, Platform, View } from "react-native";

const Container = (props) => {
    return (
        <View style={props.style ? [styles.container, props.style] : styles.container}>{props.children}</View>
    )
}

const deviceHeight = Dimensions.get('window').height;

const styles = {
    container: {
        flex: 1,
        height: Platform.OS === 'ios' ? deviceHeight : deviceHeight - 20
    }
}

export default Container