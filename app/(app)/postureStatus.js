import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase'; // Ensure this imports your Firestore instance

const PostureMonitor = () => {
  const [sensorData, setSensorData] = useState([]);
  const [prediction, setPrediction] = useState('Loading...');

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        // Create a query to fetch the latest sensor reading
        const sensorQuery = query(
          collection(db, 'sensorReadings')
        );

        // Fetch data from Firestore
        const querySnapshot = await getDocs(sensorQuery);

        console.log(querySnapshot)
        console.log('Document count:', querySnapshot.size);
        if (!querySnapshot.empty) {
          const latestDoc = querySnapshot.docs[0];
          const latestData = latestDoc.data();
        
          console.log('Latest Document Data:', latestData); // Debugging Log
        
          if (latestData && latestData.sensors) {
            // Extract values from nested sensors object
            const { flexSensor, mpu1, mpu2 } = latestData.sensors;
        
            // Convert sensor data into an array of values
            const dataArray = [
              flexSensor?.angle || 0,
              mpu1?.roll || 0,
              mpu1?.pitch || 0,
              mpu1?.yaw || 0,
              mpu2?.roll || 0,
              mpu2?.pitch || 0,
              mpu2?.yaw || 0
            ];
        
            console.log('Extracted Sensor Data:', dataArray);
        
            setSensorData(dataArray);
        
            const result = predictPosture(dataArray);
            setPrediction(result);
        
            // Optionally, save the prediction back to Firestore
            savePrediction(result);
          } else {
            console.error('No sensors field found in the latest document.');
          }
        } else {
          console.warn('No sensor readings available.');
        }
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    };

    fetchSensorData();
  }, []);

  // Dummy prediction function (replace with your actual logic)
  const predictPosture = (data) => {
    const avgValue = data.reduce((sum, val) => sum + val, 0) / data.length;
    return avgValue < 50 ? 'bad' : 'good';
  };

  // Function to save the prediction back to Firestore
  const savePrediction = async (result) => {
    // Implement saving logic here
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Posture Monitoring</Text>
      <Text>Latest Prediction: {prediction}</Text>
    </View>
  );
};

export default PostureMonitor;
