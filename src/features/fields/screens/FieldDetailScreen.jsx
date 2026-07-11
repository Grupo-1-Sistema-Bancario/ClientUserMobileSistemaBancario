import { View, Text, StyleSheet } from "react-native"
import { COLORS } from "../../../shared/constants/theme"

const FieldDetailScreen = ({ route, navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>FieldDetailScreen</Text>
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

export default FieldDetailScreen;
