import images from "@/src/constants/imageParth";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const Welcome = () => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Fade + Scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto redirect after 3 sec
    const timer = setTimeout(() => {
      router.replace("/(main)/Home"); 
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Manual touch navigation
  const handlePress = () => {
    router.replace("/(main)/Home"); 
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={handlePress}
    >
      <View style={styles.backgroundColor} />
      <Animated.Image
        source={images.logo}
        style={[
          styles.logo,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      />
    </TouchableOpacity>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundColor: {
    flex: 1,
    backgroundColor: "#140D2B",
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: "contain",
  },
});
