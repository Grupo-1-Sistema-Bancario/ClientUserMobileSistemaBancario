import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../shared/constants/theme";
import PlaceholderScreen from "../shared/components/common/PlaceholderScreen";

import HomeScreen from "../features/home/screens/HomeScreen";
import AccountDetailScreen from "../features/home/screens/AccountDetailScreen";
import MovementDetailScreen from "../features/home/screens/MovementDetailScreen";
import ProfileScreen from "../features/profile/screens/ProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const stackScreenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: "transparent" },
};

const HomeStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="AccountDetail" component={AccountDetailScreen} />
    <Stack.Screen name="MovementDetail" component={MovementDetailScreen} />
  </Stack.Navigator>
);

const TransfersStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="TransfersScreen">
      {() => <PlaceholderScreen title="Transferencias" />}
    </Stack.Screen>
    <Stack.Screen name="NewTransfer">
      {() => <PlaceholderScreen title="Nueva transferencia" />}
    </Stack.Screen>
    <Stack.Screen name="SelectBeneficiary">
      {() => <PlaceholderScreen title="Seleccionar beneficiario" />}
    </Stack.Screen>
    <Stack.Screen name="ConfirmTransfer">
      {() => <PlaceholderScreen title="Confirmar transferencia" />}
    </Stack.Screen>
    <Stack.Screen name="TransferReceipt">
      {() => <PlaceholderScreen title="Comprobante" />}
    </Stack.Screen>
  </Stack.Navigator>
);

const CatalogStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="CatalogScreen">
      {() => <PlaceholderScreen title="Ver catálogo" />}
    </Stack.Screen>
  </Stack.Navigator>
);

const HistoryStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="HistoryScreen">
      {() => <PlaceholderScreen title="Historial de transacciones" />}
    </Stack.Screen>
  </Stack.Navigator>
);

const PaymentsStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="PaymentsScreen">
      {() => <PlaceholderScreen title="Pagos de servicios" />}
    </Stack.Screen>
    <Stack.Screen name="NewPayment">
      {() => <PlaceholderScreen title="Nuevo pago" />}
    </Stack.Screen>
    <Stack.Screen name="PaymentDetail">
      {() => <PlaceholderScreen title="Detalle de pago" />}
    </Stack.Screen>
  </Stack.Navigator>
);

const TAB_ICONS = {
  Inicio: "home",
  Transferencias: "swap-horiz",
  Catálogo: "storefront",
  Historial: "history",
  Pagos: "receipt-long",
  Perfil: "person",
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.secondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        sceneStyle: {
          backgroundColor: "transparent",
        },
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons
            name={TAB_ICONS[route.name] || "circle"}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeStack}
        options={{ title: "Inicio" }}
      />
      <Tab.Screen
        name="Transferencias"
        component={TransfersStack}
        options={{ title: "Transferencias" }}
      />
      <Tab.Screen
        name="Catálogo"
        component={CatalogStack}
        options={{ title: "Catálogo" }}
      />
      <Tab.Screen
        name="Historial"
        component={HistoryStack}
        options={{ title: "Historial" }}
      />
      <Tab.Screen
        name="Pagos"
        component={PaymentsStack}
        options={{ title: "Pagos" }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          title: "Perfil",
          headerShown: true,
          headerStyle: { backgroundColor: COLORS.surface },
          headerTintColor: COLORS.text,
          headerTitleStyle: { fontWeight: "700" },
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
