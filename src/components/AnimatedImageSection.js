import React, { useRef } from "react";
import { View, Text, Image } from "react-native";
import * as Animatable from "react-native-animatable";
import { InView } from "react-native-intersection-observer";

export default function AnimatedImageSection({
  imageSource,
  title,
  description,
  animationIn = "fadeInUp",
  animationOut = "fadeOutDown",
}) {
  const sectionRef = useRef(null);

  return (
    <InView
      onChange={(inView) => {
        if (inView) {
          sectionRef.current?.[animationIn]?.(800);
        } else {
          sectionRef.current?.[animationOut]?.(400);
        }
      }}
    >
      <Animatable.View
        ref={sectionRef}
        style={{
          marginBottom: 20,
          borderRadius: 10,
          overflow: "hidden",
          backgroundColor: "#ff7474ff",
          opacity: 0,
        }}
      >
        <Image
          source={imageSource}
          style={{ width: "100%", height: 200, resizeMode: "cover" }}
        />
        <View style={{ padding: 15 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
            {title}
          </Text>
          <Text style={{ fontSize: 14, color: "#555" }}>{description}</Text>
        </View>
      </Animatable.View>
    </InView>
  );
}
