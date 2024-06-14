import React from "react";
import image from "../assets/dionysus.png";
import { View, Image, Text } from "react-native";

export default function NoData({ children }: { children: React.ReactElement }) {
  return (
    <View style={{ marginTop: 50 }}>
      <Image
        src={image}
        style={{
          width: 300,
          height: 280,
          marginHorizontal: "auto",
          opacity: 0.3,
        }}
      />
      <Text
        style={{
          fontSize: 20,
          textAlign: "center",
          marginTop: 20,
          padding: 20,
        }}
      >
        {children}
      </Text>
    </View>
  );
}
