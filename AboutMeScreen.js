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
          source={require("./assets/di.jpg")}
          style={styles.profileImage}
        />
      </Animated.View>

      <Text style={styles.name}>Diether Paroginog</Text>

      {/* ⭐ Course / Year / Section */}
      <Text style={styles.course}>
        BSIT – 3rd Year, Trinidad Municipal College
      </Text>

      <Text style={styles.title}>About Me</Text>

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

  // ⭐ Square with rounded edges + shadow
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

  // ⭐ Course Text
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
