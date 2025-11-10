import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StatusBar,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";

const MessengerScreen = ({ route, navigation }) => {
  const { currentUser, chatWithUser } = route.params;
  const db = useSQLiteContext();
  const flatListRef = useRef();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Create messages table
  const createTable = async () => {
    try {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          sender TEXT NOT NULL,
          receiver TEXT NOT NULL,
          message TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } catch (error) {
      console.error("DB Error:", error);
    }
  };

  // Load messages
  const loadMessages = async () => {
    try {
      const results = await db.getAllAsync(
        `SELECT * FROM messages
         WHERE (sender = ? AND receiver = ?)
            OR (sender = ? AND receiver = ?)
         ORDER BY created_at ASC`,
        [currentUser.name, chatWithUser.name, chatWithUser.name, currentUser.name]
      );
      setMessages(results);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error("Load Messages Error:", error);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await db.runAsync(
        "INSERT INTO messages (sender, receiver, message) VALUES (?, ?, ?)",
        [currentUser.name, chatWithUser.name, newMessage.trim()]
      );
      setNewMessage("");
      loadMessages();
    } catch (error) {
      console.error("Send Message Error:", error);
    }
  };

  useEffect(() => {
    createTable().then(() => loadMessages());

    const showSub = Keyboard.addListener("keyboardDidShow", (e) => setKeyboardHeight(e.endCoordinates.height));
    const hideSub = Keyboard.addListener("keyboardDidHide", () => setKeyboardHeight(0));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const renderItem = ({ item }) => {
    const isMe = item.sender === currentUser.name;
    return (
      <View style={[styles.messageRow, isMe ? styles.rowRight : styles.rowLeft]}>
        {!isMe && (
          <View style={styles.chatHead}>
            <Ionicons name="person-circle-outline" size={36} color="#777" />
          </View>
        )}
        <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.otherMessage]}>
          <Text style={isMe ? styles.myMessageText : styles.otherMessageText}>{item.message}</Text>
        </View>
        {isMe && (
          <View style={styles.chatHead}>
            <Ionicons name="person-circle-outline" size={36} color="#0084ff" />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0084ff" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={[styles.container, { marginBottom: keyboardHeight }]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={26} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerName}>{chatWithUser.name}</Text>
              <Text style={styles.headerStatus}>Active now</Text>
            </View>
            <View style={styles.headerRight}>
              <Ionicons name="call-outline" size={22} color="#fff" style={styles.headerIcon} />
              <Ionicons name="videocam-outline" size={22} color="#fff" />
            </View>
          </View>

          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingVertical: 10 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />

          {/* Input */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#e5e5e5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0084ff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  headerCenter: { flex: 1, alignItems: "center" },
  headerName: { color: "#fff", fontSize: 17, fontWeight: "700" },
  headerStatus: { color: "#d4e7ff", fontSize: 13 },
  headerRight: { flexDirection: "row", alignItems: "center" },
  headerIcon: { marginRight: 12 },
  container: { flex: 1 },
  messageRow: { flexDirection: "row", alignItems: "flex-end", marginVertical: 6, paddingHorizontal: 10 },
  rowLeft: { justifyContent: "flex-start" },
  rowRight: { justifyContent: "flex-end" },
  chatHead: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  messageBubble: {
    padding: 10,
    borderRadius: 18,
    maxWidth: "70%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  myMessage: { backgroundColor: "#0084ff", marginLeft: 6 },
  otherMessage: { backgroundColor: "#f0f0f0", marginRight: 6 },
  myMessageText: { color: "#fff", fontSize: 16 },
  otherMessageText: { color: "#000", fontSize: 16 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: "#f9f9f9",
    maxHeight: 100,
  },
  sendButton: { backgroundColor: "#0084ff", borderRadius: 25, padding: 10 },
});

export default MessengerScreen;
