
import React, { useEffect, useState, useRef, useCallback, PixelRatio } from "react";
import {
  Text,
  TouchableOpacity,
  Alert,
  View,
  ScrollView,
  Animated,
  Easing,
  Image,
  StyleSheet,
  Dimensions 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { IOScrollView, InView } from "react-native-intersection-observer";
import Counter from "../components/Counter";
import { auth } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import ImageCarousel from "../components/ImageCarousel";
import AnimatedImageSection from "../components/AnimatedImageSection";
import { Video } from "expo-av";
import AnimatedTabSection from "../components/AnimatedTabSection";
const carouselData = [
  {
    image: require("../assets/Images/img1.jpg"),
    title: "Beautiful Sunset",
    description: "Nature at its best",
  },
  {
    image: require("../assets/Images/img2.jpg"),
    title: "Mountain Peak",
    description: "Adventure awaits",
  },
  {
    image: require("../assets/Images/img3.jpg"),
    title: "Ocean Waves",
    description: "Feel the breeze",
  },
];
const tabs = [
  {
    id: 0,
    title: "SPIRITUAL BOOKS",
    content:
      "Transformative Spiritual Reads: Enlightenment, Inner Peace, and Self-Discovery Spiritual Books Spiritual books offer profound insights into the realms of inner growth, enlightenment, and the exploration of the human spirit. These books span various traditions, philosophies, and practices, providing readers with a wide range of perspectives on life, purpose, and the nature of existence.",
  },
  {
    id: 1,
    title: "SPIRITUAL MEDIA",
    content:
      "Spiritual Media: Films, Documentaries, and Podcasts for Mindful Exploration' Spiritual Media Spiritual media encompasses a rich tapestry of visual and auditory experiences that nourish the soul and expand the mind. From thought-provoking films and captivating documentaries to enlightening podcasts and mesmerizing art, spiritual media engages with the profound questions of existence, the interconnectedness of humanity, and the exploration of the divine.",
  },
  {
    id: 2,
    title: "BHAKTINIVEDANA",
    content:
      "Bhakti Nivedana: Devotional Practices in Hinduism' Bhaktinivedana 'Bhakti' is a Sanskrit term that signifies a deep and devotional connection to the divine, and 'Nivedana' refers to the act of offering or surrendering. In the context of Hinduism, 'Bhakti Nivedana' represents a heartfelt and complete surrender to the chosen deity, expressing profound love, devotion, and humility.",
  },
];
export default function AboutScreen({ navigation, route, navigateWithLoader }) {
  const [userName, setUserName] = useState(route.params?.userName || "User");
  const [loading, setLoading] = useState(false);
  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);
  const [showScrollUp1, setShowScrollUp1] = useState(true);
  const [showScrollUp2, setShowScrollUp2] = useState(true);
  const welcomeRef = useRef(null);
  const aboutRef = useRef(null);
  const aboutVidRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const videoRef = useRef(null);
  const animationIn = "fadeInUp";
  const animationOut = "fadeOutDown";
  const addRef = (ref) => {
    if (ref && !sectionRefs.current.includes(ref)) {
      sectionRefs.current.push(ref);
    }
  };
const handleInView = useCallback((inView, index) => {
  if (inView) {
    sectionRefs.current[index]?.fadeInUp(800);
  }
}, []);
  const sectionRefs = useRef([]);
  const handlePlaybackStatus = (status) => {
    if (status.didJustFinish) {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        // Restart video
        videoRef.current.replayAsync().then(() => {
          // Fade in
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }).start();
        });
      });
    }
  };
  return (
    <LinearGradient colors={[ "#800000", "#ff6f6fff"]} style={{ flex: 1 }}>
      <IOScrollView>
        <InView
          onChange={(inView) => {
            if (inView) welcomeRef.current?.fadeInDown(1000);
            else welcomeRef.current?.fadeOutUp(400);
          }}
        >
          <View>
            {/* Background Image */}
            <Image
              source={require("../assets/Images/AboutBagr.jpg")} // replace with your image
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                resizeMode: "cover",
              }}
            />
            {/* Dark overlay for better text visibility */}
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.4)",
              }}
            />
            <Animatable.View
              ref={welcomeRef}
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: 200,
                overflow: "hidden",
                opacity: 0,
              }}
            >
              {/* Text overlay */}
              <Text
                style={{
                  color: "#fff",
                  fontSize: 32,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                About
              </Text>
            </Animatable.View>
          </View>
        </InView>
        <View style={styles.container}>
          {/* Section 1 */}
          <InView onChange={(inView) => handleInView(inView, 0)}>
            <Animatable.View ref={addRef} style={styles.section}>
              <Text style={styles.heading}>Chinna Jeeyar Swamiji</Text>
              <Text style={styles.text}>
                Sri Sri Sri Tridandi Chinna Jeeyar Swamiji belongs to a highly
                esteemed line of monks of the followers of Sri Ramanujacharya,
                called Jeeyars.
              </Text>
              <Text style={styles.text}>
                Ever cheerful, occasionally active, uninfluenced by the worldly
                comforts but always concerned about others welfare, Chinna
                Jeeyar Swamiji radiates hope and joy wherever he goes.
              </Text>
            </Animatable.View>
          </InView>
          {/* Section 2 - Mission & Vision */}
          <InView onChange={(inView) => handleInView(inView, 1)}>
            <Animatable.View ref={addRef} style={styles.section}>
              <Text style={styles.subheading}>MISSION & VISION</Text>
              <Text style={styles.text}>
                Chinna Jeeyar's vision is to empower the impoverished
                communities across the world to have equal access and
                opportunities to quality education, healthcare, and
                self-confidence to live a life filled with dignity and pride.
              </Text>
              <Text style={styles.quote}>
                "SERVE ALL BEINGS AS SERVICE TO GOD" {"\n"}
                "WORSHIP YOUR OWN... RESPECT ALL"
              </Text>
            </Animatable.View>
          </InView>
          {/* Section 3 - Achievements */}
          <InView onChange={(inView) => handleInView(inView, 2)}>
            <Animatable.View ref={addRef} style={styles.section}>
              <Text style={styles.heading}>
                Padma Bhushan awarded to HH Sri Chinna Jeeyar Swami
              </Text>
              <Image
                source={require("../assets/Images/padmabushanaward.jpg")}
                style={styles.image}
              />
            </Animatable.View>
          </InView>
          {/* Section 4 - Testimonial */}
          <InView onChange={(inView) => handleInView(inView, 3)}>
            <Animatable.View ref={addRef} style={styles.section}>
              <View style={styles.testimonialContainer}>
                <Text style={styles.testimonialQuote}>
                  "We feel very humbled to receive all this credit of receiving
                  “Padma Bhushan”, for it is, all of you who are really doing
                  everything and creating wonders always."
                </Text>
                <Text style={styles.testimonialQuote}>
                  "Hence, you are all the ones that deserve this great Award."
                </Text>
                <Text style={styles.testimonialQuote}>
                  "When it is conferred and announced that is what we thought at
                  once. Everybody cannot go to receive the award from The
                  President of India. So, we are going and receiving this
                  absolutely on behalf of YOU."
                </Text>
                <Text style={styles.testimonialAuthor}>=chinnajeeyar=</Text>
              </View>
            </Animatable.View>
          </InView>
          {/* Section 5 - Social & Educational Initiatives */}
          <InView onChange={(inView) => handleInView(inView, 4)}>
            <Animatable.View ref={addRef} style={styles.section}>
              {/* Row 1 - Vedic University */}
              <View style={styles.row}>
                <Image
                  source={{
                    uri: "https://chinnajeeyar.org/wp-content/uploads/2018/06/vedic2-1.png",
                  }}
                  style={styles.smallImage}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.subheading}>
                    ESTABLISHED VEDIC UNIVERSITY AND SCHOOLS
                  </Text>
                  <Text style={styles.text}>
                    Within India, in 1983 Swamiji established a Vedic
                    University. He conducted innumerable Vedic rituals, yajnas,
                    and homams for humanity’s welfare. He also enlisted
                    youngsters to propagate the message of Sri Ramanuja and gave
                    discourses on a variety of subjects.
                  </Text>
                </View>
              </View>
            </Animatable.View>
          </InView>
          <InView onChange={(inView) => handleInView(inView, 5)}>
            <Animatable.View ref={addRef} style={styles.section}>
              {/* Row 2 - Mass Peace Programs */}
              <View style={styles.row}>
                <View style={styles.textContainer}>
                  <Text style={styles.subheading}>
                    MASS PEACE PRAYER PROGRAMS
                  </Text>
                  <Text style={styles.text}>
                    During turbulent times in northwestern India, HH held
                    walk-a-thons with Vedic chants restoring peace. He
                    emphasized chanting God’s names and led millions in
                    recitations of Sri Vishnu Sahasra Namams in cities like
                    Vizag, Vijayawada, and Guntur.
                  </Text>
                </View>
                <Image
                  source={{
                    uri: "https://chinnajeeyar.org/wp-content/uploads/2018/06/awareness-walk1-1.png",
                  }}
                  style={styles.smallImage}
                />
              </View>
            </Animatable.View>
          </InView>
          {/* Row 3 - Free Medical Camps */}
          <InView onChange={(inView) => handleInView(inView, 6)}>
            <Animatable.View ref={addRef} style={styles.section}>
              <View style={styles.row}>
                <Image
                  source={{
                    uri: "https://chinnajeeyar.org/wp-content/uploads/2018/06/medical-services.png",
                  }}
                  style={styles.smallImage}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.subheading}>FREE MEDICAL CAMPS</Text>
                  <Text style={styles.text}>
                    Free general health medical camps, women cancer screening,
                    dental camps, and blood donation camps are conducted
                    worldwide.
                  </Text>
                </View>
              </View>
            </Animatable.View>
          </InView>
          {/* Row 4 - Animal Welfare */}
          <InView onChange={(inView) => handleInView(inView, 7)}>
            <Animatable.View ref={addRef} style={styles.section}>
              <View style={styles.row}>
                <View style={styles.textContainer}>
                  <Text style={styles.subheading}>ANIMAL WELFARE</Text>
                  <Text style={styles.text}>
                    HH Chinna Jeeyar Swamiji is a pioneer in animal welfare,
                    frequently conducting free veterinary and animal
                    preservation camps.
                  </Text>
                </View>
                <Image
                  source={{
                    uri: "https://asrams.wpengine.com/wp-content/uploads/2015/04/founder_animal-welfare2.png",
                  }}
                  style={styles.smallImage}
                />
              </View>
            </Animatable.View>
          </InView>
          {/* Row 4 - Disadter Relief */}
          <InView onChange={(inView) => handleInView(inView, 8)}>
            <Animatable.View ref={addRef} style={styles.section}>
              <View style={styles.row}>
                <Image
                  source={{
                    uri: "https://asrams.wpengine.com/wp-content/uploads/2015/04/relief-activities.png",
                  }}
                  style={styles.smallImage}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.subheading}>
                    DISASTER RELIEF ACTIVITIES
                  </Text>
                  <Text style={styles.text}>
                    When southern parts of India were drought stricken, HH
                    applied ancient Vedic techniques for rains. Hundreds of
                    thousands of youth inspired by His motivation work round the
                    clock in serving the humanity in every way possible. In
                    earthquake, flood, cyclone and Tsunami affected areas,
                    thousands of young volunteers under the guidance of HH are
                    the first to help and render unparalleled services which are
                    often acknowledged with awe and reverence by government and
                    NGOs.
                  </Text>
                </View>
              </View>
            </Animatable.View>
          </InView>
        </View>
        <Counter />
        <Footer />
      </IOScrollView>
      <Loader visible={loading} />
    </LinearGradient>
  );
}
const { width, height } = Dimensions.get("window");
// guideline sizes are based on standard ~375x812 device (iPhone X)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;
const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;
// font scaling that clamps min and max size
const responsiveFont = (size) => {
  const scaled = moderateScale(size);
  const min = size * 0.85;
  const max = size * 1.2;
  return Math.min(Math.max(scaled, min), max);
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: moderateScale(20),
    paddingBottom: verticalScale(40),
    paddingTop: verticalScale(40),
  },
  section: {
    marginBottom: verticalScale(30),
  },
  heading: {
    fontSize: responsiveFont(24),
    fontWeight: "bold",
    color: "#fff",
    marginBottom: verticalScale(12),
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  subheading: {
    fontSize: responsiveFont(20),
    fontWeight: "bold",
    color: "#fff",
    marginBottom: verticalScale(8),
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  text: {
    fontSize: responsiveFont(16),
    lineHeight: verticalScale(24),
    color: "#fff",
    marginBottom: verticalScale(8),
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  quote: {
    fontSize: responsiveFont(20),
    fontStyle: "italic",
    color: "#fff",
    marginTop: verticalScale(10),
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: verticalScale(200),
    marginTop: verticalScale(15),
    borderRadius: moderateScale(10),
    resizeMode: "cover",
  },
  testimonialContainer: {
    backgroundColor: "rgba(249,238,222,0.82)",
    borderColor: "#d4a373",
    borderWidth: 1,
    borderRadius: moderateScale(10),
    padding: moderateScale(15),
    marginTop: verticalScale(15),
  },
  testimonialQuote: {
    fontSize: responsiveFont(16),
    lineHeight: verticalScale(22),
    color: "#333",
    marginBottom: verticalScale(8),
  },
  testimonialAuthor: {
    fontSize: responsiveFont(16),
    fontWeight: "bold",
    color: "#333",
    marginTop: verticalScale(10),
    textAlign: "right",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(25),
  },
  smallImage: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(8),
    resizeMode: "cover",
    marginRight: moderateScale(15),
  },
  textContainer: {
    flex: 1,
  },
});
