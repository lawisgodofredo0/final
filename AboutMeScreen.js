import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Animated,
} from "react-native";

export default function AboutMeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fade-in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image
          source={require("./assets/ara.png")}
          style={styles.profileImage}
        />
      </Animated.View>

      <Text style={styles.name}>Aramichelle Doydora</Text>

      {/* Course / Year */}
      <Text style={styles.course}>
        BSIT – 3rd Year, Trinidad Municipal College
      </Text>

      {/* ⭐ Submitted Info Section */}
      <View style={styles.submittedBox}>
        <Text style={styles.submittedText}>
          <Text style={{ fontWeight: "bold" }}>Submitted By:</Text> Aramichelle
          Doydora
        </Text>

        <Text style={styles.submittedText}>
          <Text style={{ fontWeight: "bold" }}>Submitted To:</Text> (Instructor
          Name)
        </Text>
      </View>
      <Text style={styles.title}>About Me</Text>
      {/* ⭐ About Me Paragraph */}
      <View style={styles.aboutMeBox}>
        <Text style={styles.description}>
          I'm currently a third-year college student at Trinidad Municipal
          College. I enjoy learning new technologies and building apps like this
          one. I'm passionate about coding, creativity, and improving my skills
          every day.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f2f8ff",
  },

  // ⭐ Profile Image (Square w/ Rounded Corners)
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#0084ff",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#005bb5",
    marginBottom: 5,
  },

  course: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#444",
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0084ff",
    marginBottom: 20,
  },

  // ⭐ Submitted Box Styling
  submittedBox: {
    backgroundColor: "#e9f2ff",
    padding: 15,
    borderRadius: 10,
    width: "95%",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#bcd9ff",
  },

  submittedText: {
    fontSize: 16,
    color: "#005bb5",
    marginBottom: 5,
    textAlign: "center",
  },

  aboutMeBox: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    width: "95%",
    borderWidth: 1,
    borderColor: "#cde4ff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  description: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    textAlign: "center",
  },
});
