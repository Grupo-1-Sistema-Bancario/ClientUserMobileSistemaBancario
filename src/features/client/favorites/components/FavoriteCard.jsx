import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SPACING, FONT_SIZE, GRADIENTS, SHADOWS } from "../../../../shared/constants/theme";

const FavoriteCard = ({ favorite, onExpand, onTransfer, onEdit, onDelete, isExpanded }) => {
    const [animHeight] = useState(new Animated.Value(0));

    const initials = React.useMemo(() => {
        const source = favorite.alias || favorite.favoriteAccountNumber || "FB";
        return source.slice(0, 2).toUpperCase();
    }, [favorite.alias, favorite.favoriteAccountNumber]);

    const handlePress = () => {
        onExpand?.();
    };

    const handleTransfer = () => {
        onTransfer?.(favorite);
    };

    const handleEdit = () => {
        onEdit?.(favorite);
    };

    const handleDelete = () => {
        onDelete?.(favorite);
    };

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.95}>
            <Animated.View style={[styles.card, { overflow: "hidden" }]}>
                <LinearGradient
                    colors={GRADIENTS.card}
                    style={styles.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.overlay}>
                        <View style={styles.decorativeCircle} />
                    </View>

                    <View style={styles.content}>
                        <View style={styles.topRow}>
                            <View style={styles.info}>
                                <Text style={styles.typeLabel}>FAVORITO</Text>
                                <Text style={styles.alias} numberOfLines={1}>
                                    {favorite.alias || "Sin alias"}
                                </Text>
                            </View>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{initials}</Text>
                            </View>
                        </View>

                        <View style={styles.accountSection}>
                            <Text style={styles.accountNumber}>
                                {favorite.favoriteAccountNumber}
                            </Text>
                            <Text style={styles.bankLabel}>Sistema Bancario</Text>
                        </View>

                        <Animated.View
                            style={[
                                styles.actionsContainer,
                                {
                                    height: isExpanded ? 60 : 0,
                                    opacity: isExpanded ? 1 : 0,
                                },
                            ]}
                        >
                            <View style={styles.actionsRow}>
                                <TouchableOpacity
                                    onPress={handleTransfer}
                                    style={styles.actionButton}
                                >
                                    <Text style={styles.actionButtonText}>Transferir</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleEdit}
                                    style={styles.actionButtonOutline}
                                >
                                    <Text style={styles.actionButtonOutlineText}>Modificar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleDelete}
                                    style={styles.actionButtonDanger}
                                >
                                    <Text style={styles.actionButtonDangerText}>Eliminar</Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>

                        {!isExpanded && (
                            <Text style={styles.hint}>Toca para ver opciones</Text>
                        )}
                    </View>
                </LinearGradient>
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        marginBottom: SPACING.md,
        ...SHADOWS.md,
        elevation: 4,
    },
    gradient: {
        borderRadius: 16,
        minHeight: 140,
        padding: SPACING.md,
    },
    overlay: {
        position: "absolute",
        top: -30,
        left: -30,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "rgba(0, 191, 165, 0.15)",
    },
    decorativeCircle: {
        position: "absolute",
        top: 12,
        left: 12,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "rgba(0, 191, 165, 0.4)",
    },
    content: {
        flex: 1,
        justifyContent: "space-between",
        minHeight: 140,
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    info: {
        flex: 1,
    },
    typeLabel: {
        fontSize: FONT_SIZE.xs,
        textTransform: "uppercase",
        letterSpacing: 1,
        color: "rgba(255, 255, 255, 0.6)",
        marginBottom: 2,
    },
    alias: {
        fontSize: FONT_SIZE.xl,
        fontWeight: "700",
        color: COLORS.text,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.3)",
    },
    avatarText: {
        fontSize: FONT_SIZE.sm,
        fontWeight: "700",
        color: COLORS.text,
        letterSpacing: 1,
    },
    accountSection: {
        marginTop: SPACING.md,
    },
    accountNumber: {
        fontFamily: "monospace",
        fontSize: FONT_SIZE.lg,
        fontWeight: "600",
        color: COLORS.text,
        letterSpacing: 1,
    },
    bankLabel: {
        fontSize: FONT_SIZE.xs,
        textTransform: "uppercase",
        letterSpacing: 1.5,
        color: GRADIENTS.button[0],
        marginTop: 4,
    },
    actionsContainer: {
        overflow: "hidden",
        marginTop: SPACING.md,
    },
    actionsRow: {
        flexDirection: "row",
        gap: SPACING.sm,
    },
    actionButton: {
        flex: 1,
        paddingVertical: SPACING.sm,
        borderRadius: 8,
        backgroundColor: GRADIENTS.button[0],
        alignItems: "center",
    },
    actionButtonText: {
        color: COLORS.text,
        fontWeight: "600",
        fontSize: FONT_SIZE.sm,
    },
    actionButtonOutline: {
        flex: 1,
        paddingVertical: SPACING.sm,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.3)",
        backgroundColor: "transparent",
        alignItems: "center",
    },
    actionButtonOutlineText: {
        color: COLORS.text,
        fontWeight: "600",
        fontSize: FONT_SIZE.sm,
    },
    actionButtonDanger: {
        flex: 1,
        paddingVertical: SPACING.sm,
        borderRadius: 8,
        backgroundColor: "rgba(239, 68, 68, 0.8)",
        alignItems: "center",
    },
    actionButtonDangerText: {
        color: COLORS.text,
        fontWeight: "600",
        fontSize: FONT_SIZE.sm,
    },
    hint: {
        marginTop: SPACING.md,
        fontSize: FONT_SIZE.xs,
        textTransform: "uppercase",
        letterSpacing: 1,
        color: "rgba(255, 255, 255, 0.4)",
        textAlign: "center",
    },
});

export default FavoriteCard;