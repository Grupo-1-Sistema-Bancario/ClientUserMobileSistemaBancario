import { View, Text, StyleSheet } from "react-native"
import { COLORS } from "../../../shared/constants/theme"

const FieldsScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>FieldsScreen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
    },
    text: {
        fontSize: 18,
        color: COLORS.text,
    },
});

export default FieldsScreen;
