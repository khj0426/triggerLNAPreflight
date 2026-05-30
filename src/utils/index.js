//크롬 138버전부터 검사
const LNA_MIN_VERSION = 138;

//크롬브라우저인지 검증 (userAgent기준)
function isChromeBrowser() {
  const ua = navigator.userAgent;
  return (
    /Chrome\/(\d+)/.test(ua) &&
    !/Edg\//.test(ua) &&
    !/OPR\//.test(ua) &&
    !/Opera\//.test(ua)
  );
}

//최초 로드 시점에 트리거
export async function triggerLNAPreflight() {
  return new Promise((resolve) => {
    let done = false;
    const finish = (result) => {
      if (done) return;
      done = true;
      try {
        pc.close();
      } catch (_) {}
      resolve(result);
    };

    const pc = new RTCPeerConnection();

    pc.createDataChannel("lna-preflight");

    pc.createOffer()
      .then((offer) => pc.setLocalDescription(offer))
      .catch(() => finish("error"));

    pc.onicecandidate = (e) => {
      if (e.candidate?.candidate?.includes("typ host")) {
        finish("granted");
      }
    };

    pc.onicegatheringstatechange = () => {
      if (pc.iceGatheringState === "complete") {
        finish("denied");
      }
    };

    setTimeout(() => finish("timeout"), 5000);
  });
}
