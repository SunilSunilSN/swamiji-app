import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { InView } from "react-native-intersection-observer";
import * as Animatable from "react-native-animatable";

const { width } = Dimensions.get("window");

export default function Counter() {
  const targets = [10000, 100, 1000, 100];
  const targetLabels = ["Spiritual Books", "Branches", "Partner", "Awards"]
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const [animated, setAnimated] = useState(false);
  const counterRefs = useRef(targets.map(() => React.createRef()));

  const startCounting = () => {
    if (animated) return;
    setAnimated(true);

    targets.forEach((target, index) => {
      let current = 0;
      const interval = setInterval(() => {
        current += Math.ceil(target / 50);
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        setCounts((prev) => {
          const copy = [...prev];
          copy[index] = current;
          return copy;
        });
      }, 30);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Our Achievements</Text>
      <View style={styles.row}>
        {targets.map((_, idx) => (
          <InView
            key={idx}
            onChange={(inView) => {
              if (inView) {
                counterRefs.current[idx].current?.fadeInUp(800);
                startCounting();
              } else {
                counterRefs.current[idx].current?.fadeOutDown(400);
              }
            }}
          >
            <Animatable.View
              ref={counterRefs.current[idx]}
              style={styles.counterBox}
              useNativeDriver
            >
              <Text style={styles.number}>{counts[idx]}</Text>
              <Text style={styles.label}>{targetLabels[idx]}</Text>
            </Animatable.View>
          </InView>
        ))}
      </View>
    </View>
  );
}

const boxWidth = (width - 60) / 2; // 20px padding + 10px margin * 2

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    backgroundColor: "#800000",
    alignItems: "center",
    paddingHorizontal: 20
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  counterBox: {
    width: boxWidth,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 25,
    paddingHorizontal: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  number: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#800000",
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
    textAlign: "center",
  },
});
