import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabs from "./MainTabs";
import TransfersScreen from "../features/client/transfers/screens/TransfersScreen";
import PaymentsScreen from "../features/client/payments/screens/PaymentsScreen";
import CatalogScreen from "../features/client/catalog/screens/CatalogScreen";
import HistoryScreen from "../features/client/history/screens/HistoryScreen";

const Stack = createNativeStackNavigator();

const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={MainTabs} />
    <Stack.Screen name="Transferencias" component={TransfersScreen} />
    <Stack.Screen name="Pagos" component={PaymentsScreen} />
    <Stack.Screen name="Catálogo" component={CatalogScreen} />
    <Stack.Screen name="Historial" component={HistoryScreen} />
  </Stack.Navigator>
);

export default AppStack;
