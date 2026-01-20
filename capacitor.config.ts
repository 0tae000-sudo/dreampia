import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.taeyoung.pushapp123",
  appName: "my-push-app",
  webDir: "out",
  server: {
    // 안드로이드 에뮬레이터와 iOS 기기 모두에서 접근 가능한 공통 주소 설정
    // 1. iOS 실제 기기나 시뮬레이터는 현재의 172.xx 주소를 그대로 사용 가능합니다.
    // 2. 안드로이드 에뮬레이터는 10.0.2.2 주소를 통해 PC에 접속합니다.
    url: "http://172.30.1.27:3000",
    cleartext: true,
    allowNavigation: [
      "*.daum.net",
      "*.postcode.map.daum.net",
      "t1.daumcdn.net",
    ],
  },
};

export default config;
