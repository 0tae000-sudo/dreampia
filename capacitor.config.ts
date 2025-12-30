import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.taeyoung.pushapp123",
  appName: "my-push-app",
  webDir: "out",
  // server: {
  //   url: "http://172.30.1.27:3000",
  //   cleartext: true,
  //   androidScheme: "https",
  //   // iosScheme: 'app' (기본값이므로 생략 가능하나 흰 화면 지속 시 추가 고려)
  // },
};

export default config;
