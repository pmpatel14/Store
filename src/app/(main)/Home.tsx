import Images from "@/src/constants/imageParth";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const originalBanners = [
  Images.slide_1,
  Images.slide_2,
  Images.slide_3,
  Images.slide_4,
  Images.slide_2,
  Images.slide_1,
  Images.slide_3,
];

const categories_1 = [
  Images.makeup,
  Images.rain,
  Images.ring,
  Images.shoes,
  Images.summer,
  Images.watch,
  Images.winter,
  Images.rain,
  Images.ring,
  Images.shoes,
  Images.summer,
  Images.watch,
];

const categoriesTextTitle = [
  "Makeup",
  "Rain",
  "Ring",
  "Shoes",
  "Summer",
  "Watch",
  "Winter",
  "Rain",
  "Ring",
  "Shoes",
  "Summer",
  "Watch",
];
const itemText = [
  "Makeup",
  "Rain",
  "Ring",
  "Shoes",
  "Summer",
  "Watch",
  "Winter",
  "Rain",
  "Ring",
  "Shoes",
  "Summer",
  "Watch",
];

const itemPrice = [
  "99.00",
  "199.00",
  "299.00",
  "399.00",
  "499.00",
  "599.00",
  "699.00",
  "799.00",
  "899.00",
  "999.00",
  "1099.00",
];

const itemImages = [
  Images.makeup,
  Images.rain,
  Images.ring,
  Images.shoes,
  Images.summer,
  Images.watch,
  Images.winter,
  Images.rain,
  Images.ring,
  Images.shoes,
  Images.summer,
  Images.watch,
];

// Duplicate first & last for seamless loop
const bannerImages = [
  originalBanners[originalBanners.length - 1],
  ...originalBanners,
  originalBanners[0],
];

// Enhanced Sales Timer Component
const SalesTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Example: Sale ends after 7 days
    const saleEnd = new Date();
    saleEnd.setDate(saleEnd.getDate() + 7);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = saleEnd.getTime() - now;

      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({
          days: String(days).padStart(2, "0"),
          hours: String(hours).padStart(2, "0"),
          minutes: String(minutes).padStart(2, "0"),
          seconds: String(seconds).padStart(2, "0"),
        });

        // Update progress bar
        const totalDuration = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        const progress = 1 - distance / totalDuration;
        Animated.timing(progressAnim, {
          toValue: progress,
          duration: 1000,
          useNativeDriver: false,
        }).start();
      }
    }, 1000);

    // Pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Slide in animation
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 800,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();

    return () => clearInterval(timer);
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Animated.View
      style={[
        styles.salesTimerWrapper,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Text style={styles.salesTimerTitle}>⏰ Flash Sale Ending Soon!</Text>
      <Text style={styles.salesTimerSubtitle}>
        Hurry up before time runs out
      </Text>

      <Animated.View
        style={[styles.salesTimerBox, { transform: [{ scale: pulseAnim }] }]}
      >
        <View style={styles.timerUnit}>
          <Text style={styles.timerNumber}>{timeLeft.days}</Text>
          <Text style={styles.timerLabel}>Days</Text>
        </View>

        <Text style={styles.timerColon}>:</Text>

        <View style={styles.timerUnit}>
          <Text style={styles.timerNumber}>{timeLeft.hours}</Text>
          <Text style={styles.timerLabel}>Hours</Text>
        </View>

        <Text style={styles.timerColon}>:</Text>

        <View style={styles.timerUnit}>
          <Text style={styles.timerNumber}>{timeLeft.minutes}</Text>
          <Text style={styles.timerLabel}>Minutes</Text>
        </View>

        <Text style={styles.timerColon}>:</Text>

        <View style={styles.timerUnit}>
          <Text style={styles.timerNumber}>{timeLeft.seconds}</Text>
          <Text style={styles.timerLabel}>Seconds</Text>
        </View>
      </Animated.View>

      <View style={styles.progressBar}>
        <Animated.View
          style={[styles.progressFill, { width: progressWidth }]}
        />
      </View>

      <Text style={styles.saleInfo}>
        Limited offers - 30% off on selected items
      </Text>
    </Animated.View>
  );
};

const Home = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Function to start auto-scroll
  const startAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (!isScrollingRef.current && scrollRef.current) {
        const nextIndex = (activeIndex + 1) % originalBanners.length;
        scrollRef.current.scrollTo({
          x: (nextIndex + 1) * width,
          animated: true,
        });
      }
    }, 3000);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: width, animated: false });
    }
    startAutoScroll();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    startAutoScroll();
  }, [activeIndex]);

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    let contentOffsetX = event.nativeEvent.contentOffset.x;
    let index = Math.round(contentOffsetX / width);

    if (index === 0) {
      scrollRef.current?.scrollTo({
        x: originalBanners.length * width,
        animated: false,
      });
      setActiveIndex(originalBanners.length - 1);
    } else if (index === bannerImages.length - 1) {
      scrollRef.current?.scrollTo({ x: width, animated: false });
      setActiveIndex(0);
    } else {
      setActiveIndex(index - 1);
    }

    isScrollingRef.current = false;

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleScrollBegin = () => {
    isScrollingRef.current = true;
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const goToSlide = (index: number) => {
    if (scrollRef.current) {
      isScrollingRef.current = true;
      scrollRef.current.scrollTo({
        x: (index + 1) * width,
        animated: true,
      });
      setActiveIndex(index);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Status Bar */}
      <StatusBar barStyle="light-content" backgroundColor="#140D2B" />

      {/* Top Bar */}
      <View style={styles.statusBaar}>
        <Image source={Images.logo} style={styles.logo} />
        <Ionicons name="notifications-outline" size={24} style={styles.icon} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchBaar}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#ccc"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search here..."
          placeholderTextColor="#bbb"
          style={styles.searchInput}
        />
      </View>

      {/* Banner Slider */}
      <View style={styles.bannerWrapper}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
          onScrollBeginDrag={handleScrollBegin}
          scrollEventThrottle={16}
        >
          {bannerImages.map((img, index) => (
            <View key={index} style={styles.slideWrapper}>
              <Image source={img} style={styles.slide} />
            </View>
          ))}
        </ScrollView>

        {/* Dots Indicator */}
        <Animated.View
          style={[styles.indicatorContainer, { opacity: fadeAnim }]}
        >
          {originalBanners.map((_, index) => (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => goToSlide(index)}
            >
              <View
                style={[
                  styles.indicator,
                  index === activeIndex && styles.activeIndicator,
                ]}
              />
            </TouchableWithoutFeedback>
          ))}
        </Animated.View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesWrapper}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories_1.map((image, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={styles.categoryImageWrapper}>
                <Image source={image} style={styles.categoryImage} />
              </View>
              <Text style={styles.categoryText}>
                {categoriesTextTitle[index]}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Times for Sales */}
      <SalesTimer />

      {/* New Arrivals */}
      <View style={styles.newArrivalsContainer}>
        <Text style={styles.sectionTitle}>New Arrivals</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {itemImages.map((image, index) => (
            <View key={index} style={styles.itemContainer}>
              <Image source={image} style={styles.itemImage} />
              <Text style={styles.itemText}>{itemText[index]}</Text>
              <Text style={styles.itemPrice}>
                ${itemPrice[index % itemPrice.length]}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* popular products */}
      <View style={styles.popularContainer}>
        <Text style={styles.sectionTitle}>Popular Products</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {itemImages.map((image, index) => (
            <View key={index} style={styles.itemContainer}>
              <Image source={image} style={styles.itemImage} />
              <Text style={styles.itemText}>{itemText[index]}</Text>
              <Text style={styles.itemPrice}>
                ${itemPrice[index % itemPrice.length]}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Promo Banner */}
      <View style={styles.bannerContainer}>
        <View style={styles.bannerText}>
          <Text style={styles.bannerTitle}>30% Off Discount</Text>
          <Text style={styles.bannerSubTitle}>
            Started several mistake joy say painful reached end
          </Text>
          <Text style={styles.bannerButton}>Shop now!</Text>
        </View>
        <View style={styles.bannerImageMain}>
          <Image source={Images.banner} style={styles.bannerImage} />
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#140D2B" },
  statusBaar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  logo: { width: 80, height: 80, resizeMode: "contain" },
  icon: { color: "#fff" },
  searchBaar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f1f2e",
    marginHorizontal: 20,
    marginVertical: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  searchIcon: { marginRight: 8, color: "#aaa" },
  searchInput: { flex: 1, color: "#fff", fontSize: 16 },

  bannerWrapper: { marginTop: 15, position: "relative" },
  slideWrapper: {
    width: width - 40,
    height: 200,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  slide: { width: "100%", height: "100%", resizeMode: "cover" },

  indicatorContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    marginHorizontal: 4,
  },
  activeIndicator: { backgroundColor: "#fff", width: 20 },

  categoriesWrapper: { marginTop: 20, paddingHorizontal: 20 },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  categoryItem: { alignItems: "center", marginRight: 15 },
  categoryImageWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1f1f2e",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 30,
    borderColor: "#d8d8e2ff",
    borderWidth: 2,
  },
  categoryText: { color: "#fff", fontSize: 12 },

  bannerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  bannerText: {
    flex: 1,
    backgroundColor: "#ffff",
    height: 200,
    borderBottomLeftRadius: 12,
    borderTopLeftRadius: 12,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  bannerTitle: {
    color: "#001C7E",
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    textTransform: "uppercase",
  },
  bannerSubTitle: {
    color: "#001C7E",
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
  },
  bannerImageMain: { width: 150, height: 200 },
  bannerImage: {
    width: "100%",
    height: "100%",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  bannerButton: {
    color: "#ffffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    backgroundColor: "#001C7E",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
    alignSelf: "center",
  },

  // Sales Timer Styles
  salesTimerWrapper: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#001C7E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 20,
  },
  salesTimerTitle: {
    color: "#001C7E",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  salesTimerSubtitle: {
    color: "#6B7280",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  salesTimerBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#001C7E",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  timerUnit: {
    alignItems: "center",
    flex: 1,
  },
  timerNumber: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  timerLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    fontWeight: "500",
  },
  timerColon: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#001C7E",
    borderRadius: 3,
  },
  saleInfo: {
    color: "#6B7280",
    fontSize: 12,
    textAlign: "center",
    fontStyle: "italic",
  },

  // New Arrivals Styles
  newArrivalsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  itemContainer: {
    width: 150,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 10,
    marginRight: 15,
    shadowColor: "#001C7E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  itemImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: "cover",
  },
  itemText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  itemPrice: {
    color: "#001C7E",
    fontSize: 16,
    fontWeight: "bold",
  },

  // New Arrivals Styles
  popularContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
});
