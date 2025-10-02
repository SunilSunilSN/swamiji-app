import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  Animated,
} from "react-native";
import { IOScrollView, InView } from "react-native-intersection-observer";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { RFValue } from "react-native-responsive-fontsize";

export default function Footer() {
  // Animation refs
  const aboutAnim = useRef(new Animated.Value(0)).current;
  const menuAnim = useRef(new Animated.Value(0)).current;
  const contactAnim = useRef(new Animated.Value(0)).current;

  const animateSection = (animRef, delay = 0) => {
    Animated.timing(animRef, {
      toValue: 1,
      duration: 600,
      delay,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    animateSection(aboutAnim, 100);
    animateSection(menuAnim, 250);
    animateSection(contactAnim, 400);
  }, []);

  const SocialIcon = ({ name, color, url }) => (
    <TouchableOpacity
      style={{ marginRight: responsiveWidth(6) }}
      onPress={() => Linking.openURL(url)}
    >
      <FontAwesome name={name} size={RFValue(22)} color={color} />
    </TouchableOpacity>
  );

  const AnimatedSection = ({ animRef, children }) => (
    <Animated.View
      style={{
        opacity: animRef,
        transform: [
          {
            translateY: animRef.interpolate({
              inputRange: [0, 1],
              outputRange: [responsiveHeight(3), 0],
            }),
          },
        ],
        marginBottom: responsiveHeight(3),
      }}
    >
      {children}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <IOScrollView contentContainerStyle={styles.scrollContainer}>
        {/* About Section */}
        <InView onChange={(inView) => inView && animateSection(aboutAnim)}>
          <AnimatedSection animRef={aboutAnim}>
            <Image
              source={require("../assets/Images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.headingText}>
              Sri Ramanujavani Spiritual Equips
            </Text>
            <Text style={styles.bodyText}>
              A non-profit spiritual organization located in Vijayawada,
              Andhra Pradesh. Dedicated to spreading wisdom and spiritual
              knowledge across communities.
            </Text>
            <View style={styles.socialRow}>
              <SocialIcon
                name="youtube-play"
                color="red"
                url="https://www.youtube.com/channel/UCEeH8dbV31M5LMNQHTl3saA"
              />
              <SocialIcon
                name="facebook"
                color="#3b5998"
                url="https://www.facebook.com/sriramanujavani"
              />
              <SocialIcon
                name="linkedin"
                color="#0A66C2"
                url="https://www.linkedin.com/in/sunil-s-n-6368b8191/"
              />
              <SocialIcon
                name="twitter"
                color="#1DA1F2"
                url="https://twitter.com/yourprofile"
              />
            </View>
          </AnimatedSection>
        </InView>

        {/* Menu */}
        <InView onChange={(inView) => inView && animateSection(menuAnim)}>
          <AnimatedSection animRef={menuAnim}>
            <Text style={styles.headingText}>Menu</Text>
            {["Home", "Shop"].map((item) => (
              <TouchableOpacity key={item} activeOpacity={0.7}>
                <Text style={styles.linkText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </AnimatedSection>
        </InView>

        {/* Contact */}
        <InView onChange={(inView) => inView && animateSection(contactAnim)}>
          <AnimatedSection animRef={contactAnim}>
            <Text style={styles.headingText}>Have a Question?</Text>
            <View style={styles.row}>
              <Ionicons name="location" size={RFValue(16)} color="brown" />
              <Text style={styles.bodyText}>
                11-49-136, Sivalayam Street, VIJAYAWADA[520 001]
              </Text>
            </View>
            <TouchableOpacity onPress={() => Linking.openURL("tel:08662420820")}>
              <View style={styles.row}>
                <Ionicons name="call" size={RFValue(16)} color="brown" />
                <Text style={styles.bodyText}>0866-2420820</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL("mailto:info@sriramanujavani.com")}
            >
              <View style={styles.row}>
                <Ionicons name="mail" size={RFValue(16)} color="brown" />
                <Text style={styles.bodyText}>info@sriramanujavani.com</Text>
              </View>
            </TouchableOpacity>
          </AnimatedSection>
        </InView>
      </IOScrollView>

      {/* Bottom Developer Bar */}
      <View style={styles.bottomBar}>
        <Text style={styles.bottomText}>
          © 2023 Ramanujavani. Powered by{" "}
          <Text
            style={{ color: "#0000EE" }}
            onPress={() =>
              Linking.openURL("https://www.linkedin.com/in/sunil-s-n-6368b8191/")
            }
          >
            Sunil S N
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#ffffff", paddingTop: responsiveHeight(2) },
  scrollContainer: { paddingHorizontal: responsiveWidth(5) },
  logo: {
    width: responsiveWidth(40),
    height: responsiveHeight(7),
    marginBottom: responsiveHeight(1.5),
    alignSelf: "center",
  },
  headingText: {
    fontSize: RFValue(20),
    fontWeight: "700",
    color: "#000",
    marginBottom: responsiveHeight(1),
    textShadowColor: "#aaa",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  linkText: {
    fontSize: RFValue(16),
    color: "#333",
    marginBottom: responsiveHeight(0.8),
  },
  bodyText: {
    fontSize: RFValue(14),
    color: "#555",
    marginBottom: responsiveHeight(1),
    lineHeight: RFValue(20),
    textShadowColor: "#ccc",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: responsiveHeight(0.8),
  },
  socialRow: {
    flexDirection: "row",
    marginTop: responsiveHeight(2),
    justifyContent: "center",
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingVertical: responsiveHeight(1.5),
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  bottomText: {
    fontSize: RFValue(12),
    color: "#555",
    textAlign: "center",
  },
});
