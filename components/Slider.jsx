// import React, { useRef, useEffect, useState } from "react";
// import {
//   View,
//   Image,
//   Dimensions,
//   StyleSheet,
//   Text,
//   Animated,
//   ScrollView,
// } from "react-native";

// const images = [
//   require("../assets/images/images-car-removebg-preview.png"),
//   require("../assets/images/img-6.webp"),
//   require("../assets/images/img-1.webp"),
//   require("../assets/images/img-1__1_-removebg-preview.png"),
//   require("../assets/images/img-1__2_-removebg-preview.png"),
// ];

// const ImageSlider = () => {
//   const scrollViewRef = useRef(null);
//   const scrollX = useRef(new Animated.Value(0)).current;
//   const [sliderWidth, setSliderWidth] = useState(Dimensions.get("window").width);
//   const indexRef = useRef(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       indexRef.current = (indexRef.current + 1) % images.length;
//       scrollViewRef.current?.scrollTo({
//         x: indexRef.current * sliderWidth,
//         animated: true,
//       });
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [sliderWidth]);

//   const handleLayout = (event) => {
//     const { width } = event.nativeEvent.layout;
//     setSliderWidth(width);
//   };

//   return (
//     <View style={styles.sliderContainer} onLayout={handleLayout}>
//       <Text style={styles.heading}>
//         # <Text style={{ fontWeight: "bold" }}>Special for you</Text>
//       </Text>

//       <Animated.ScrollView
//         ref={scrollViewRef}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         scrollEventThrottle={16}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { x: scrollX } } }],
//           { useNativeDriver: false }
//         )}
//         contentContainerStyle={{ alignItems: "center" }}
//       >
//         {images.map((img, index) => (
//           <View key={index} style={[styles.slide, { width: sliderWidth }]}>
//             <Image source={img} style={styles.sliderImage} />
//           </View>
//         ))}
//       </Animated.ScrollView>

//       <View style={styles.pagination}>
//         {images.map((_, index) => {
//           const inputRange = [
//             (index - 1) * sliderWidth,
//             index * sliderWidth,
//             (index + 1) * sliderWidth,
//           ];

//           const dotWidth = scrollX.interpolate({
//             inputRange,
//             outputRange: [8, 16, 8],
//             extrapolate: "clamp",
//           });

//           const backgroundColor = scrollX.interpolate({
//             inputRange,
//             outputRange: ["#ccc", "#ff5634", "#ccc"],
//             extrapolate: "clamp",
//           });

//           return (
//             <Animated.View
//               key={index}
//               style={[styles.dot, { width: dotWidth, backgroundColor }]}
//             />
//           );
//         })}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   sliderContainer: {
//     width: "100%",
//     justifyContent: "center",
//     marginVertical: 10,
//   },
//   heading: {
//     fontSize: 18,
//     alignSelf: "flex-start",
//     marginBottom: 8,
//     marginLeft: 20,
//     color: "#333",
//   },
//   slide: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   sliderImage: {
//     width: "90%",
//     height: 180,
//     borderRadius: 10,
//     resizeMode: "contain",
//   },
//   pagination: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: 10,
//   },
//   dot: {
//     height: 8,
//     borderRadius: 4,
//     marginHorizontal: 4,
//   },
// });

// export default ImageSlider;
