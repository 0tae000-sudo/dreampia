"use client";

import { useEffect } from "react";
import { PushNotifications } from "@capacitor/push-notifications";
import { FirebaseMessaging } from "@capacitor-firebase/messaging";

import Image from "next/image";

export default function Home() {
  useEffect(() => {
    console.log("token 요청");

    const initializePush = async () => {
      // 1. 현재 권한 확인
      let permission = await PushNotifications.checkPermissions();

      // 2. 권한이 'prompt'(처음 실행) 상태라면 사용자에게 팝업을 띄움
      if (permission.receive === "prompt") {
        permission = await PushNotifications.requestPermissions();
      }

      // 3. 최종적으로 권한이 'granted'(허용) 되었을 때만 등록 및 토큰 요청
      if (permission.receive === "granted") {
        await PushNotifications.register();

        try {
          const result = await FirebaseMessaging.getToken();
          console.log("FCM TOKEN:", result.token);
        } catch (e) {
          console.error("토큰 가져오기 실패:", e);
        }
      } else {
        console.log("알림 권한이 거부되었습니다.");
      }
    };

    initializePush();
  }, []);

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>푸시 알림 테스트 페이지</h1>
      <p>앱이 실행되면 알림 권한을 허용해 주세요.</p>
    </div>
  );
}
