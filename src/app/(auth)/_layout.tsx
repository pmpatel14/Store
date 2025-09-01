import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const AuthStack = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
    </Stack>
  );
};

export default AuthStack;

const styles = StyleSheet.create({});
