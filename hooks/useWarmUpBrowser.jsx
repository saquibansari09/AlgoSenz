import React from "react";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

// Ensure WebBrowser is available before calling its methods
export const useWarmUpBrowser = () => {
    React.useEffect(() => {
        if (Platform.OS !== "web" && WebBrowser.warmUpAsync) {
            WebBrowser.warmUpAsync().catch((err) => console.warn("WarmUp Error:", err));
            return () => {
                WebBrowser.coolDownAsync().catch((err) => console.warn("CoolDown Error:", err));
            };
        }
    }, []);
};
