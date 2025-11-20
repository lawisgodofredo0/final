import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";

const UserList = ({ navigation, route }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const db = useSQLiteContext();

  // Get the logged-in user from route params (optional)
  const currentUser = route?.params?.currentUser;

  const loadUsers = async () => {
    try {
      const results = await db.getAllAsync("SELECT * FROM users");
      setUsers(results);
    } catch (error) {
      console.error("Database error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10 }}>Loading users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>User List</Text>
        {currentUser && (
          <Text style={styles.loggedUser}>
            Logged in as:{" "}
            <Text style={{ fontWeight: "bold" }}>{currentUser.name}</Text>
          </Text>
        )}

        {/* Navigation Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.addButtonText}>➕ Add New User</Text>
        </TouchableOpacity>
      </View>

      {/* User List */}
      <FlatList
        data={users}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadUsers}
            tintColor="#007bff"
          />
        }
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text
              style={styles.name}
            >{`${item.firstName} ${item.lastName}`}</Text>
            <Text style={styles.detail}>{item.email}</Text>
            <Text style={styles.detail}>{item.phone}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No users found</Text>}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 15 },
  header: { marginBottom: 15, alignItems: "center" },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 5,
  },
  loggedUser: { fontSize: 14, color: "#555", marginBottom: 10 },
  addButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  userCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  name: { fontSize: 18, fontWeight: "600", marginBottom: 3 },
  detail: { color: "#555" },
  empty: { textAlign: "center", marginTop: 20, color: "#777" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default UserList;
