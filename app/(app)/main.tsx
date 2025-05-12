import { useAuthUser } from "@/store/authStore";
import { Redirect } from "expo-router";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MainScreen = () => {
  const user = useAuthUser();
  if (!user) {
    return <Redirect href="/" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        안녕하세요! {user.email}님! React Native 앱입니다.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
});

export default MainScreen;
