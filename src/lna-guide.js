export function showLNAPreNotice() {
  showBanner(
    "lna-notice",
    "info",
    "🔔 잠시 후 <strong>로컬 네트워크 접근 권한</strong> 요청이 표시됩니다. <strong>허용</strong>을 클릭해주세요.",
  );
}

export function showLNADeniedGuide() {
  removeBanner("lna-notice");
  showBanner(
    "lna-denied",
    "warn",
    "⚠️ 통화 연결에 실패할 수 있습니다. " +
      "주소창 왼쪽 🔒 → <strong>로컬 네트워크</strong> → <strong>허용</strong> 후 새로고침 해주세요.",
  );
}

export function hideLNAGuide() {
  removeBanner("lna-notice");
  removeBanner("lna-denied");
}

function showBanner(id, type, html) {
  removeBanner(id);
  const colors = {
    info: "background:#e8f4fd;border-color:#90caf9;",
    warn: "background:#fff3e0;border-color:#ffb74d;",
  };
  const el = document.createElement("div");
  el.id = id;
  el.style.cssText = `
    ${colors[type]}
    border:1px solid;
    border-radius:6px;
    padding:10px 14px;
    margin-bottom:10px;
    font-size:13px;
    line-height:1.5;
  `;
  el.innerHTML = html;

  const container = document.getElementById("ccp-container");
  container?.parentNode?.insertBefore(el, container);
}

function removeBanner(id) {
  document.getElementById(id)?.remove();
}
