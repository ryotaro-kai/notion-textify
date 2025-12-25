(() => {
  // --- フラッシュメッセージ表示用関数 ---
  const showToast = (message, isError = false) => {
    // すでに表示されているものがあれば消す
    const existing = document.getElementById("extension-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "extension-toast";
    toast.textContent = message;

    // スタイル設定
    Object.assign(toast.style, {
      position: "fixed",
      top: "20px",
      left: "50%",
      transform: "translateX(-50%) translateY(-20px)",
      backgroundColor: isError ? "rgba(255, 69, 58, 0.9)" : "rgba(30, 30, 30, 0.9)",
      color: "#fff",
      padding: "10px 24px",
      borderRadius: "8px",
      zIndex: "999999",
      fontSize: "14px",
      fontWeight: "bold",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      pointerEvents: "none",
      opacity: "0",
      transition: "all 0.4s ease"
    });

    document.body.appendChild(toast);

    // アニメーション開始
    setTimeout(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(-50%) translateY(0)";
    }, 10);

    // 5秒後に消去
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(-50%) translateY(-20px)";
      setTimeout(() => toast.remove(), 400);
    }, 5000);
  };

  // --- メイン処理 ---
  const root = document.querySelector(".notion-page-content");
  if (!root) {
    showToast("コンテンツが見つかりませんでした", true);
    return;
  }

  const editableBlocks = root.querySelectorAll('[contenteditable="true"]');
  if (editableBlocks.length === 0) {
    showToast("コピーするテキストがありません", true);
    return;
  }

  // 最大幅（階層0の基準）を取得
  let maxWidth = 0;
  editableBlocks.forEach(el => {
    const w = el.getBoundingClientRect().width;
    if (w > maxWidth) maxWidth = w;
  });

  let lines = [];

  editableBlocks.forEach(el => {
    // リンク展開
    const clone = el.cloneNode(true);
    const links = clone.querySelectorAll('a');
    links.forEach(link => {
      const url = link.href;
      const text = link.innerText;
      if (url && text) link.innerText = `[${text}](${url})`;
    });
    let text = clone.innerText;

    const blockContainer = el.closest('.notion-selectable');
    if (blockContainer) {
      // 階層判定
      const currentWidth = el.getBoundingClientRect().width;
      const diff = maxWidth - currentWidth;
      const depth = Math.round(diff / 28);
      const indentString = "　".repeat(Math.max(0, depth));

      // 見出し
      const classes = blockContainer.className;
      let prefix = "";
      let suffix = "";

      if (classes.includes('notion-header-block') || classes.includes('notion-sub_header-block') || classes.includes('notion-sub_sub_header-block')) {
        prefix = "*"; suffix = "*";
      } else if (classes.includes('bulleted_list')) {
        prefix = "・ ";
      } else if (classes.includes('numbered_list')) {
        // 番号付きリストは箇条書きに変更
        prefix = "・ ";
      } else if (classes.includes('to_do')) {
        const isChecked = blockContainer.querySelector('[aria-checked="true"]');
        prefix = (isChecked ? '[x] ' : '[ ] ');
      } else if (classes.includes('quote')) {
        prefix = "> ";
      } else if (classes.includes('toggle')) {
        // トグルは非対応
        // prefix = "▶ ";
      }

      lines.push(`${indentString}${prefix}${text}${suffix}`);
    } else {
      lines.push(text);
    }
  });

  const resultText = lines.join('\n');

  navigator.clipboard.writeText(resultText)
    .then(() => showToast(`コピーしました！ (処理行数：${lines.length})`))
    .catch(err => showToast("失敗しました: " + err, true));
})();