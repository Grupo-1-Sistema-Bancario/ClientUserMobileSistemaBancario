import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Card } from "../../../shared/components/common/Common";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  LETTER_SPACING,
} from "../../../shared/constants/theme";
import { POINT_VALUE, POINTS_EARN_RATE } from "../../../shared/constants/loyalty";

const LoyaltyCard = ({ points }) => (
  <Card style={styles.card}>
    <View style={styles.row}>
      <View style={styles.iconWrap}>
        <MaterialIcons name="stars" size={26} color={COLORS.warning} />
      </View>
      <View style={styles.flex1}>
        <Text style={styles.label}>Puntos de lealtad</Text>
        <Text style={styles.points}>{points}</Text>
      </View>
    </View>
    <Text style={styles.hint}>
      1 punto equivale a Q{POINT_VALUE}. Ganas 1 punto por cada Q{POINTS_EARN_RATE} pagados.
    </Text>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.pill,
    backgroundColor: "rgba(241, 211, 2, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  flex1: { flex: 1 },
  label: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: LETTER_SPACING.wide,
  },
  points: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xxl,
    fontWeight: "900",
  },
  hint: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
  },
});

export default LoyaltyCard;
