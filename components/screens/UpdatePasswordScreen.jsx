import { updatePassword } from "firebase/auth";
import { useState } from "react";
import { Alert } from "react-native";
import { Text } from "react-native";
import { TextInput, View, StyleSheet, Pressable } from "react-native";
import { auth } from "../../firebaseUtils/firebase-setup";
import { Divider } from 'react-native-elements';
import { Colors } from "../styles/Colors";

export default function UpdatePasswordScreen({ navigation }) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const verifyPassword = (password) => {
        // Valid password pattern:
        // 1. Contains both digit and word character
        // 2. More than 6 characters
        const validPasswordPattern = /(?=.*[0-9]+)(?=.*[a-zA-Z]+).{6,}/g;
        return password.match(validPasswordPattern);
    };

    const onUpdatePassword = () => {
        if (confirmPassword !== newPassword) {
            Alert.alert("Update failed", "Passwords did not match, please try again.");
            return;
        }
        if (!verifyPassword(newPassword)) {
            Alert.alert('Update failed', "Please use 6 or more characters with a mix of numbers and letters.");
            setNewPassword('');
            setConfirmPassword('');
            return;
        }
        const user = auth.currentUser;

        updatePassword(user, newPassword)
            .then(() => {
                Alert.alert("Password updated!");
                navigation.goBack();
            })
            .catch((error) => {
                const errorCode = error.code;
                Alert.alert("Update password failed", errorCode)
            });
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Update Password</Text>
            <View style={styles.inputsContainer}>
                <TextInput placeholder="Set New Password"
                    value={newPassword}
                    style={styles.textInput}
                    secureTextEntry
                    onChangeText={setNewPassword} />
                <Divider style={styles.divider} />
                <TextInput placeholder="Enter Password Again"
                    value={confirmPassword}
                    style={styles.textInput}
                    secureTextEntry
                    onChangeText={setConfirmPassword} />
            </View>
            <Text style={styles.reminderText}>More than 6 letters or numbers</Text>
            <Pressable onPress={onUpdatePassword} style={styles.SubmitButton}>
                <Text style={styles.SubmitButtonText}>Submit</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 55,
        backgroundColor: "#FFFCF6",
        flex: 1,
    },
    title: {
        fontFamily: "PoppinsSemiBold",
        color: '#F59156',
        fontStyle: "normal",
        fontWeight: "600",
        fontSize: 24,
        textAlign: "center",
        margin: 12
    },
    inputsContainer: {
        backgroundColor: "white",
        borderRadius: 20,
        marginTop: 30,
        marginBottom: 10,
    },
    textInput: {
        fontFamily: "Poppins",
        fontSize: 14,
        padding: 14
    },
    divider: {
        marginHorizontal: 10,
    },
    reminderText: {
        fontFamily: "Poppins",
        paddingLeft: 14,
        fontSize: 14,
        color: Colors.grayText
    },
    SubmitButton: {
        backgroundColor: "#FFB801",
        borderRadius: 18,
        height: 60,
        alignItems: "center",
        padding: 16,
        marginTop: '10%'
    },
    SubmitButtonText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '600',
        marginTop: 5,
    },
});