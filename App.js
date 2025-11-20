import "react-native-gesture-handler";
import React from "react";
import { SQLiteProvider } from "expo-sqlite";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity, Image } from "react-native";

// Screens
import RegisterScreen from "./RegisterScreen";
import LoginScreen from "./LoginScreen";
import UserListScreen from "./UserListScreen";
import MessengerScreen from "./MessengerScreen";
import CommentScreen from "./CommentScreen";
import AboutMeScreen from "./AboutMeScreen"; // <-- ADDED

const Stack = createStackNavigator();

export default function App() {
  return (
    <SQLiteProvider
      databaseName="authDatabase.db"
      onInit={async (db) => {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS auth_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
          );

          CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender TEXT NOT NULL,
            receiver TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user TEXT NOT NULL,
            comment TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
          );
        `);
      }}
    >
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Register"
          screenOptions={{
            headerStyle: { backgroundColor: "#0084ff" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        >
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />

          {/* --- USER LIST SCREEN WITH ABOUT ME BUTTON --- */}
          <Stack.Screen
            name="Users"
            component={UserListScreen}
            options={({ navigation }) => ({
              title: "User List",
              headerRight: () => (
                <TouchableOpacity
                  style={{ marginRight: 15 }}
                  onPress={() => navigation.navigate("AboutMe")}
                >
                  <Image
                    source={require("./assets/kens.jpg")} // <-- your asset
                    style={{ width: 32, height: 32, borderRadius: 16 }}
                  />
                </TouchableOpacity>
              ),
            })}
          />

          <Stack.Screen
            name="Messenger"
            component={MessengerScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Comments" component={CommentScreen} />
          <Stack.Screen name="AboutMe" component={AboutMeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SQLiteProvider>
  );
}
