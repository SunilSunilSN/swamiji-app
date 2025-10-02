// styles/LoginStyle.js
import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  keyboardView: {
    width: "100%",
    alignItems: "center",
        justifyContent: "center",
    paddingHorizontal: responsiveWidth(6),
  },
  title: {
    fontSize: RFValue(26), // scales with screen size
    fontWeight: "700",
    color: "#fff",
    marginBottom: responsiveHeight(4),
    textAlign: "center",
  },
  inputBox: {
    width: "100%",
    marginBottom: responsiveHeight(2),
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: responsiveWidth(3),
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(3),
    fontSize: RFValue(14),
    color: "#fff",
  },
  registerButton: {
    backgroundColor: "#fff",
    paddingVertical: responsiveHeight(1.8),
    borderRadius: responsiveWidth(3),
    marginTop: responsiveHeight(2),
    alignItems: "center",
    width: responsiveWidth(50),
  },
  registerText: {
    color: "#800000",
    fontSize: RFValue(16),
    fontWeight: "600",
  },
  loginText: {
    marginTop: responsiveHeight(2),
    fontSize: RFValue(12),
    color: "#fff",
    textAlign: "center",
  },
  loginLink: {
    fontWeight: "bold",
    textDecorationLine: "underline",
    fontSize: RFValue(12),
  },
  signUp: {
    color: "#fff",
    fontWeight: "700",
    fontSize: RFValue(12),
    
  },
});

export default styles;
