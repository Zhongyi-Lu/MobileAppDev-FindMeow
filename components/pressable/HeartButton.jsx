import React, { useState } from "react";
import { ButtonGroup, Button } from "@rneui/themed";
import { Text, StyleSheet, View, Pressable } from "react-native";

export function HeartButton({ onPress }) {
  return (
    <Pressable onPress={onPress}>
      <Text style={{ color: "orange", fontSize: 24 }}>♡</Text>
    </Pressable>
  );
}
