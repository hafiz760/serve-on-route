import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { DarkStatusBar } from "../../../component/StatusBar";
import Header from "../../../component/Header";
import { Container, Text, Icon } from "../../../component/Basic";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/session";
import { navigate } from "../../../navigations";
import styles from './styles';

export default function Settings() {
    const dispatch = useDispatch();

    const handleLogout = () => {
        // Show confirmation dialog before logout
        dispatch(logout());
        navigate("Login");
    };

    const settingsOptions = [
        {
            icon: "key-variant",
            label: "Change Password",
            onPress: () => {
                // Placeholder: Will navigate to change password screen
            }
        },
        {
            icon: "lock-check",
            label: "Privacy Policy",
            onPress: () => {
                // Placeholder: Will navigate to privacy policy screen
            }
        },
        {
            icon: "note-text",
            label: "Terms and Conditions",
            onPress: () => {
                // Placeholder: Will navigate to terms screen
            }
        },
        {
            icon: "logout",
            label: "Logout",
            onPress: handleLogout
        },
        {
            icon: "delete",
            label: "Delete Account",
            onPress: () => {
                // Placeholder: Will show confirmation dialog and delete account
            }
        }
    ];

    return (
        <Container>
            <DarkStatusBar />
            <Header leftType="back" title={"Settings"} />
            <View style={styles.main}>
                {settingsOptions.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.settingsItem}
                        onPress={option.onPress}
                        activeOpacity={0.7}
                    >
                        <Icon
                            name={option.icon}
                            type="MaterialCommunityIcons"
                        />
                        <Text style={styles.text}>{option.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </Container>
    );
}
