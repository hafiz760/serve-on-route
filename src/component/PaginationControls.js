// ./PaginationControls.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

const PaginationControls = ({
    page,
    totalPages,
    hasNext,
    hasPrev,
    loading,
    onNext,
    onPrev,
    style,
}) => {
    const disablePrev = !hasPrev || loading;
    const disableNext = !hasNext || loading;

    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity
                style={[
                    styles.button,
                    disablePrev && styles.buttonDisabled,
                ]}
                disabled={disablePrev}
                onPress={onPrev}
                activeOpacity={0.7}>
                <Text style={styles.buttonText}>Previous</Text>
            </TouchableOpacity>

            <Text style={styles.pageText}>
                Page {page} of {totalPages}
            </Text>

            <TouchableOpacity
                style={[
                    styles.button,
                    disableNext && styles.buttonDisabled,
                ]}
                disabled={disableNext}
                onPress={onNext}
                activeOpacity={0.7}>
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
        </View>
    );
};

export default PaginationControls;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 5,
        backgroundColor: '#4a3fb0',
        minWidth: 90,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#cccccc',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 14,
    },
    pageText: {
        color: '#333333',
        fontSize: 14,
    },
});
