import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

const PostureMonitor = () => {
  const [prediction, setPrediction] = useState('Loading...');
  const [tflite, setTflite] = useState(null); // Hold the tflite instanc

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Posture Monitoring</Text>
      <Text>Latest Prediction: {prediction}</Text>
    </View>
  );
};

export default PostureMonitor;
