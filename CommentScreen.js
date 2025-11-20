import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";

const CommentScreen = ({ route }) => {
  const db = useSQLiteContext();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  // Get current logged user from route params
  const currentUser = route.params?.currentUser || { name: "Guest" };

  // Load comments when screen opens
  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const result = await db.getAllAsync(
        "SELECT * FROM comments ORDER BY created_at DESC"
      );
      setComments(result);
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  const addComment = async () => {
    if (!comment.trim()) {
      Alert.alert("Error", "Please write something.");
      return;
    }

    try {
      await db.runAsync("INSERT INTO comments (user, comment) VALUES (?, ?)", [
        currentUser.name,
        comment,
      ]);
      setComment("");
      loadComments(); // refresh list
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const deleteComment = async (id) => {
    try {
      await db.runAsync("DELETE FROM comments WHERE id = ?", [id]);
      loadComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentItem}>
      <Image source={require("./assets/di.jpg")} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.user}>{item.user}</Text>
        <Text style={styles.text}>{item.comment}</Text>
        <Text style={styles.time}>
          {item.created_at ? new Date(item.created_at).toLocaleString() : ""}
        </Text>
      </View>
      {item.user === currentUser.name && (
        <Button
          title="🗑"
          color="#dc3545"
          onPress={() => deleteComment(item.id)}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1, padding: 16 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >

        <Text style={styles.title}>Community Comments</Text>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Write a comment..."
            value={comment}
            onChangeText={setComment}
          />
          <Button title="Post" onPress={addComment} color="#007bff" />
        </View>

        {/* Comments list */}
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderComment}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerImage: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginBottom: 10,
    borderRadius: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  commentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 20,
  },
  user: {
    fontWeight: "bold",
    color: "#007bff",
  },
  text: {
    fontSize: 16,
    marginVertical: 4,
  },
  time: {
    fontSize: 12,
    color: "#888",
  },
});

export default CommentScreen;
