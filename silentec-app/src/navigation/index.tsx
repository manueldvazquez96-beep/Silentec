import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { colors, fontSize, spacing } from '../constants/tokens';

import LoginScreen   from '../screens/LoginScreen';
import HomeScreen    from '../screens/HomeScreen';
import CatalogScreen from '../screens/CatalogScreen';
import DetailScreen  from '../screens/DetailScreen';
import ChatScreen    from '../screens/ChatScreen';
import ReportsScreen from '../screens/ReportsScreen';
import CartScreen    from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type RootStackParamList = {
  Login:   undefined;
  Main:    undefined;
  Detail:  { id: number };
};

export type TabParamList = {
  Home:     undefined;
  Catalog:  undefined;
  Chat:     undefined;
  Reports:  undefined;
  Cart:     undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab   = createBottomTabNavigator<TabParamList>();

const TAB_ITEMS = [
  { name: 'Home',    label: 'Inicio',    icon: '⊞' },
  { name: 'Catalog', label: 'Catálogo',  icon: '☰' },
  { name: 'Chat',    label: 'Asistente', icon: '◎' },
  { name: 'Reports', label: 'Reportes',  icon: '▦' },
  { name: 'Cart',    label: 'Pedido',    icon: '⊡' },
];

function STTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { items: cartItems } = require('../store/cartStore').useCartStore();

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom + 6 }]}>
      {state.routes.map((route: any, index: number) => {
        const focused = state.index === index;
        const tab = TAB_ITEMS[index];
        const badge = route.name === 'Cart' && cartItems.length > 0 ? cartItems.length : 0;

        return (
          <Pressable
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={styles.tabItem}
          >
            {focused && <View style={styles.tabDot} />}
            <View style={styles.tabIconWrap}>
              <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>
                {tab.icon}
              </Text>
              {badge > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator tabBar={(props) => <STTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home"    component={HomeScreen} />
      <Tab.Screen name="Catalog" component={CatalogScreen} />
      <Tab.Screen name="Chat"    component={ChatScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen name="Cart"    component={CartScreen} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const { token } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Main"   component={TabNavigator} />
            <Stack.Screen name="Detail" component={DetailScreen} options={{ animation: 'slide_from_right' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  tabDot: {
    position: 'absolute',
    top: -8,
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
  tabIconWrap: {
    position: 'relative',
  },
  tabIcon: {
    fontSize: 20,
    color: colors.textDim,
  },
  tabIconActive: {
    color: colors.accent,
  },
  tabLabel: {
    fontSize: fontSize.xxs,
    color: colors.textDim,
    fontFamily: 'Montserrat_600SemiBold',
    letterSpacing: 0.3,
  },
  tabLabelActive: {
    color: colors.accent,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontFamily: 'Montserrat_700Bold',
  },
});
