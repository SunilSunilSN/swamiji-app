import { StyleSheet } from "react-native";

const HomeScreenStyles = StyleSheet.create({
  container: { flex: 1 },

  // Welcome Section
  welcomeSection: { paddingHorizontal: 20 },
  welcomeTextContainer: { alignItems: "center", marginBottom: 30, opacity: 0 },
  welcomeText: { fontSize: 32, color: "#fff", textAlign: "center" },
  logoutButton: { paddingHorizontal: 60, marginTop: 20, backgroundColor: "#fff", borderRadius: 5 },
  logoutText: { fontSize: 18, color: "#800000" },

  // Carousel
  carouselContainer: { paddingHorizontal: 20 },

  // About / Video Section
  sectionContainer: { paddingHorizontal: 20, marginTop: 30, height: 450 },
  backgroundImage: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", resizeMode: "cover", opacity: 0.35 },
  overlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 5 },
  scrollViewContent: { paddingTop: 225, paddingHorizontal: 20, paddingBottom: 20 },
  aboutTitle: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 12, textShadowColor: "#000", textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 5 },
  aboutText: { fontSize: 16, color: "#fff", lineHeight: 24, marginBottom: 12, textShadowColor: "#000", textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 4 },

  // Scroll-up button
  scrollUpButton: { position: "absolute", bottom: 20, right: 20, backgroundColor: "#800000", borderRadius: 30, padding: 12, elevation: 5, zIndex: 100 },
  scrollUpText: { color: "#fff", fontSize: 22 },

  // Video
  videoContainer: { opacity: 1, position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden" },
  videoStyle: { width: "110%", height: "100%", marginLeft: "-5%" },
});

export default HomeScreenStyles;
