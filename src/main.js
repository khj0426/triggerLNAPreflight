import { isLNARequired, triggerLNAPreflight } from "./utils/lna";
import {
  showLNAPreNotice,
  showLNADeniedGuide,
  hideLNAGuide,
} from "./lna-guide";

async function initCCP() {
  const container = document.getElementById("ccp-container");

  // 1. initCCP (allowFramedSoftphone: true)
  connect.core.initCCP(container, {
    ccpUrl: "https://your-instance.my.connect.aws/ccp-v2/",
    softphone: {
      allowFramedSoftphone: true,
    },
  });

  // 2. LNA 불필요한 환경이면 종료
  if (!isLNARequired()) return;

  // 3. 사전 안내 표시
  showLNAPreNotice();

  // 4. preflight — LNA 프롬프트 사전 유도 및 결과 확인
  const result = await triggerLNAPreflight();

  if (result === "granted") {
    hideLNAGuide();
  } else {
    // 거절 또는 타임아웃
    showLNADeniedGuide();
  }

  // 5. 통화 중 ICE 실패 감지 (2차 방어)
  connect.core
    .getEventBus()
    .subscribe(connect.AgentEvents.SOFTPHONE_ERROR, (data) => {
      if (
        data.errorType === connect.SoftphoneErrorTypes.ICE_COLLECTION_TIMEOUT
      ) {
        showLNADeniedGuide();
      }
    });
}

initCCP();
