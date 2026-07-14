import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../features/home/screens/HomeScreen";
import AccountDetailScreen from "../features/home/screens/AccountDetailScreen";
import MovementDetailScreen from "../features/home/screens/MovementDetailScreen";

const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="AccountDetail" component={AccountDetailScreen} />
    <Stack.Screen name="MovementDetail" component={MovementDetailScreen} />
  </Stack.Navigator>
);

export default HomeStack;
