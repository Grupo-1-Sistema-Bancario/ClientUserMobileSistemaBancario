import { View, TextInput, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Chip from "../../../shared/components/common/Chip";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "../../../shared/constants/theme";

export const TYPE_FILTERS = [
  { key: "ALL", label: "Todos" },
  { key: "PRODUCT", label: "Productos" },
  { key: "SERVICE", label: "Servicios" },
];

const CatalogFilters = ({ search, onSearchChange, typeFilter, onTypeChange }) => (
  <View style={styles.container}>
    <View style={styles.searchBox}>
      <MaterialIcons name="search" size={20} color={COLORS.textTertiary} />
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar producto o servicio..."
        placeholderTextColor={COLORS.textTertiary}
        value={search}
        onChangeText={onSearchChange}
      />
    </View>

    <View style={styles.chipsRow}>
      {TYPE_FILTERS.map((f) => (
        <Chip
          key={f.key}
          label={f.label}
          active={typeFilter === f.key}
          onPress={() => onTypeChange(f.key)}
        />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
    paddingVertical: SPACING.sm + 2,
  },
  chipsRow: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
});

export default CatalogFilters;
