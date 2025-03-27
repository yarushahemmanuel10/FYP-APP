import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal, StyleSheet, Button } from "react-native";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { LineChart } from "react-native-chart-kit";
import { useRouter } from "expo-router";


const HomeScreen = () => {
  const [postureData, setPostureData] = useState([]);
  const [badPostureCount, setBadPostureCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  useEffect(() => {
    fetchPostureData();
  }, []);

  const fetchPostureData = async () => {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const q = query(
        collection(db, "posturePredictions"),
        where("timestamp", ">", oneWeekAgo)
      );
      const querySnapshot = await getDocs(q);

      let fetchedData = [];
      let badCount = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedData.push(data);

        if (data.prediction === "bad") {
          badCount++;
        }
      });

      setPostureData(fetchedData);
      setBadPostureCount(badCount);
    } catch (error) {
      console.error("Error fetching posture data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Past Week Posture Stats</Text>
      <Text style={styles.statText}>Bad Posture: {badPostureCount} times</Text>
      <Text style={styles.statText}>
        Health Risk: {badPostureCount > 10 ? "High" : "Low"}
      </Text>

      {/* Chart for Visualization */}
      {postureData.length > 0 && (
        <LineChart
          data={{
            labels: postureData.map((_, index) => `Day ${index + 1}`),
            datasets: [{ data: postureData.map((item) => (item.prediction === "bad" ? 1 : 0)) }],
          }}
          width={320}
          height={220}
          yAxisLabel=""
          yAxisSuffix="x"
          chartConfig={{
            backgroundGradientFrom: "#f3f3f3",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
          }}
        />
      )}
       <Button title="Go to Posture Status" onPress={() => router.push("/postureStatus")} />

      {/* Start Monitoring Button */}
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
     
      </TouchableOpacity>

      {/* Activity Selection Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Activity</Text>
            {["Standing", "Sitting", "Exercise"].map((activity) => (
              <TouchableOpacity
                key={activity}
                style={styles.activityButton}
                onPress={() => {
                  console.log(`Monitoring started for: ${activity}`);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.activityText}>{activity}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  statText: { fontSize: 16, marginBottom: 5 },
  button: { backgroundColor: "#3498db", padding: 15, borderRadius: 10, marginTop: 20, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 10, width: "80%", alignItems: "center" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  activityButton: { backgroundColor: "#2ecc71", padding: 10, marginVertical: 5, borderRadius: 5, width: "100%", alignItems: "center" },
  activityText: { color: "#fff", fontSize: 16 },
  closeButton: { marginTop: 10 },
  closeButtonText: { color: "red", fontSize: 16 },
});

export default HomeScreen;
