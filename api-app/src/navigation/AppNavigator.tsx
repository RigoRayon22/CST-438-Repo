import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { SearchPage } from '../pages/SearchPage';
import { ResultsPage } from '../pages/ResultsPage';
import { ProfilePage } from '../pages/ProfilePage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

/** allows users to switch between search and results page and still be on home tab */
function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Search"
                component={SearchPage}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Results"
                component={ResultsPage}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

/** nav bar for entire app w/ Home and Profile icons*/
export function AppNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    switch (route.name) {
                        case 'Home':
                            iconName = 'home';
                            break;
                        case 'Profile':
                            iconName = 'person';
                            break;
                        default:
                            iconName = 'help-circle'; // fallback icon to make TS happy
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeStack}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfilePage}
                options={{ headerShown: false }}
            />
        </Tab.Navigator>
    );
}
