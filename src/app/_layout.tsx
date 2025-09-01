import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 500);
    // Simulate an API call to check login status
  }, []);
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      {isLogin ? (
        <Redirect href={"/(main)/Home"} />
      ) : (
        <Redirect href={"/(auth)/welcome"} />
      )}
    </>
  );
};

export default RootLayout;
