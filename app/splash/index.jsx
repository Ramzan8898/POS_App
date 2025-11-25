import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { VideoView, useVideoPlayer } from "expo-video";

const { width, height } = Dimensions.get("window");

export default function SplashVideo() {
  const router = useRouter();

  const player = useVideoPlayer(
    require("../../assets/videos/splash.mp4"),
    (player) => {
      player.loop = false;
      player.play();
    }
  );

  const gotoHome = () => {
    router.replace("/login");
  };

  // Fallback (if video fails or hangs)
  useEffect(() => {
    const timer = setTimeout(gotoHome, 7000);
    return () => clearTimeout(timer);
  }, []);

  // Auto navigate when finished
  useEffect(() => {
    const sub = player.addListener("ended", gotoHome);
    return () => sub.remove();
  }, [player]);

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
      />

      <TouchableOpacity style={styles.skipBtn} onPress={gotoHome}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  skipBtn: {
    position: "absolute",
    top: 40,
    right: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 20,
  },
  skipText: {
    color: "#fff",
    fontSize: 14,
  },
});
