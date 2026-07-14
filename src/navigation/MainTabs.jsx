import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../shared/constants/theme";
import HomeStack from "./HomeStack";
import FavoritesScreen from "../features/client/favorites/screens/FavoritesScreen";
import ProfileScreen from "../features/profile/screens/ProfileScreen";
import CatalogScreen from "../features/catalog/screens/CatalogScreen";
import PaymentsScreen from "../features/payments/screens/PaymentsScreen";

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
    <Stack.Screen name="CatalogScreen" component={CatalogScreen} />
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
    <Stack.Screen name="PaymentsScreen" component={PaymentsScreen} />
  </Stack.Navigator>
);

const TAB_ICONS = {
    Inicio: "home",
    Favorites: "star",
    Profile: "person",
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
                name="Favorites"
                component={FavoritesStack}
                options={{ title: "Favoritos" }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: "Perfil" }}
            />
        </Tab.Navigator>
    );
};

export default MainTabs;