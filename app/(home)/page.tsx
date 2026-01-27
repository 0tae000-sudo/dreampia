// "use client";

// import { useEffect } from "react";
// import { PushNotifications } from "@capacitor/push-notifications";
// import { FirebaseMessaging } from "@capacitor-firebase/messaging";

// import Image from "next/image";

// export default function Home() {
//   useEffect(() => {
//     console.log("token 요청");

//     const initializePush = async () => {
//       // 1. 현재 권한 확인
//       let permission = await PushNotifications.checkPermissions();

//       // 2. 권한이 'prompt'(처음 실행) 상태라면 사용자에게 팝업을 띄움
//       if (permission.receive === "prompt") {
//         permission = await PushNotifications.requestPermissions();
//       }

//       // 3. 최종적으로 권한이 'granted'(허용) 되었을 때만 등록 및 토큰 요청
//       if (permission.receive === "granted") {
//         await PushNotifications.register();

//         try {
//           const result = await FirebaseMessaging.getToken();
//           console.log("FCM TOKEN:", result.token);
//         } catch (e) {
//           console.error("토큰 가져오기 실패:", e);
//         }
//       } else {
//         console.log("알림 권한이 거부되었습니다.");
//       }
//     };

//     initializePush();
//   }, []);

//   return (
//     <div>
//       <div className="w-full h-full bg-red-500">상단바</div>
//       <div></div>
//     </div>
//   );
// }

import { Metadata } from "next";
import MarsLayout from "../../components/mars_layout";

export const metadata: Metadata = {
  title: "MARS",
  description: "MARS",
};

export default function Home() {


  return (
    <div>
      <MarsLayout />
    </div>
  );
}
