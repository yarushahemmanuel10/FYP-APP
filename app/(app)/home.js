// app/(app)/home.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';


export default function Home() {
 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensor Data </Text>
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  timestamp: {
    color: '#666',
    marginBottom: 8,
  },
});