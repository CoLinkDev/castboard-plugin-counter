const UI_TEXT = {
  en: {
    badge: "Navigable example",
    title: "Counter plugin",
    subtitle: "An official CastBoard example for lifecycle hooks, configuration, and namespaced local storage.",
    language: "Host language",
    activations: "Activations",
    viewport: "Viewport",
    counter: "Persistent counter",
    increase: "Increase by",
    decrease: "Decrease by",
    reset: "Reset",
  },
  "zh-CN": {
    badge: "导航型示例",
    title: "计数器插件",
    subtitle: "用于演示生命周期钩子、配置和命名空间本地存储的 CastBoard 官方示例。",
    language: "宿主语言",
    activations: "激活次数",
    viewport: "视口尺寸",
    counter: "持久化计数器",
    increase: "增加",
    decrease: "减少",
    reset: "重置",
  },
  ja: {
    badge: "ナビゲーション例",
    title: "カウンタープラグイン",
    subtitle: "ライフサイクルフック、設定、名前空間付きローカルストレージを示す CastBoard 公式サンプルです。",
    language: "ホスト言語",
    activations: "有効化回数",
    viewport: "ビューポート",
    counter: "永続カウンター",
    increase: "増加",
    decrease: "減少",
    reset: "リセット",
  },
  ko: {
    badge: "탐색형 예제",
    title: "카운터 플러그인",
    subtitle: "수명 주기 훅, 구성, 네임스페이스 로컬 저장소를 보여 주는 CastBoard 공식 예제입니다.",
    language: "호스트 언어",
    activations: "활성화 횟수",
    viewport: "뷰포트",
    counter: "영구 카운터",
    increase: "증가",
    decrease: "감소",
    reset: "초기화",
  },
  "zh-TW": {
    badge: "導覽型範例",
    title: "計數器外掛",
    subtitle: "用於示範生命週期掛鉤、設定和命名空間本機儲存空間的 CastBoard 官方範例。",
    language: "主機語言",
    activations: "啟用次數",
    viewport: "檢視區",
    counter: "持久化計數器",
    increase: "增加",
    decrease: "減少",
    reset: "重設",
  },
  de: {
    badge: "Navigierbares Beispiel",
    title: "Zähler-Plugin",
    subtitle: "Ein offizielles CastBoard-Beispiel für Lebenszyklus-Hooks, Konfiguration und lokalen Namensraum-Speicher.",
    language: "Hostsprache",
    activations: "Aktivierungen",
    viewport: "Ansichtsbereich",
    counter: "Gespeicherter Zähler",
    increase: "Erhöhen um",
    decrease: "Verringern um",
    reset: "Zurücksetzen",
  },
  es: {
    badge: "Ejemplo navegable",
    title: "Complemento contador",
    subtitle: "Ejemplo oficial de CastBoard para ciclos de vida, configuración y almacenamiento local con espacio de nombres.",
    language: "Idioma del host",
    activations: "Activaciones",
    viewport: "Área visible",
    counter: "Contador persistente",
    increase: "Aumentar en",
    decrease: "Reducir en",
    reset: "Restablecer",
  },
  ru: {
    badge: "Навигационный пример",
    title: "Плагин-счётчик",
    subtitle: "Официальный пример CastBoard с хуками жизненного цикла, настройкой и изолированным локальным хранилищем.",
    language: "Язык приложения",
    activations: "Активации",
    viewport: "Область просмотра",
    counter: "Постоянный счётчик",
    increase: "Увеличить на",
    decrease: "Уменьшить на",
    reset: "Сбросить",
  },
};

function textFor(language) {
  const normalized = String(language || "").toLowerCase();
  if (normalized.startsWith("zh-tw") || normalized.startsWith("zh-hk") || normalized.startsWith("zh-hant")) {
    return UI_TEXT["zh-TW"];
  }
  if (normalized.startsWith("zh")) return UI_TEXT["zh-CN"];
  const locale = ["ja", "ko", "de", "es", "ru"].find((candidate) => normalized.startsWith(candidate));
  return UI_TEXT[locale] || UI_TEXT.en;
}

export default {
  // mount creates the Shadow DOM UI, reads persisted state, and attaches DOM listeners.
  async mount(shadowRoot, context) {
    const storedCount = context.storage.get("count");
    let count = Number.isSafeInteger(storedCount) ? storedCount : 0;
    let activations = 0;
    let step = context.config.step;
    const text = textFor(context.i18n.language);
    const eventController = new AbortController();

    shadowRoot.innerHTML = `
      <style>
        .counter-page {
          position: fixed;
          inset: 0;
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
          align-items: center;
          gap: clamp(24px, 4vw, 64px);
          padding: clamp(24px, 5vh, 60px) clamp(32px, 6vw, 100px);
          overflow: auto;
          box-sizing: border-box;
          background: #000;
          color: #f8fafc;
          font-family: inherit;
          user-select: none;
        }
        .summary {
          display: flex;
          min-width: 0;
          flex-direction: column;
          justify-content: center;
          gap: clamp(12px, 2vh, 24px);
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          width: fit-content;
          padding: 6px 14px;
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 9999px;
          background: rgba(34, 197, 94, 0.12);
          color: #4ade80;
          font-size: clamp(12px, 1.8vh, 14px);
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .badge::before {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 10px #22c55e;
          content: "";
        }
        .title {
          margin: 0;
          color: #fff;
          font-size: clamp(32px, 6.5vh, 56px);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .subtitle {
          margin: 0;
          color: #94a3b8;
          font-size: clamp(14px, 2.2vh, 18px);
          line-height: 1.6;
        }
        .details {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 8px;
          font-size: clamp(12px, 1.8vh, 15px);
        }
        .details[hidden] { display: none; }
        .detail {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .detail-label {
          min-width: 100px;
          color: #64748b;
        }
        .detail-value {
          padding: 2px 8px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.05);
          color: #cbd5e1;
          font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
        }
        .counter-panel {
          display: flex;
          min-width: 0;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: clamp(18px, 3vh, 28px);
          padding: clamp(24px, 4vh, 40px) clamp(24px, 3vw, 48px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: clamp(16px, 2.5vh, 24px);
          background: rgba(255, 255, 255, 0.03);
        }
        .counter-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .counter-value {
          color: #fff;
          font-size: clamp(64px, 15vh, 120px);
          font-variant-numeric: tabular-nums;
          font-weight: 800;
          line-height: 1;
          overflow-wrap: anywhere;
        }
        .counter-label {
          color: #64748b;
          font-size: clamp(11px, 1.6vh, 13px);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .actions {
          display: flex;
          justify-content: center;
          gap: 12px;
          width: 100%;
        }
        .button {
          flex: 1;
          padding: clamp(10px, 1.8vh, 16px) clamp(16px, 2vw, 24px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          font-family: inherit;
          font-size: clamp(14px, 2vh, 17px);
          font-weight: 600;
          transition: background 0.15s, border-color 0.15s, transform 0.1s;
        }
        .button:active {
          background: rgba(255, 255, 255, 0.18);
          transform: scale(0.97);
        }
        .button-primary {
          border-color: #3b82f6;
          background: #2563eb;
        }
        .counter-page[data-accent="green"] .button-primary { border-color: #22c55e; background: #15803d; }
        .counter-page[data-accent="purple"] .button-primary { border-color: #a855f7; background: #7e22ce; }
        @media (max-width: 760px) {
          .counter-page {
            grid-template-columns: 1fr;
            align-content: center;
            padding: 24px;
          }
          .counter-panel { padding: 24px; }
        }
        @media (max-width: 460px) {
          .actions { flex-direction: column; }
          .button { width: 100%; }
        }
      </style>
      <main class="page counter-page">
        <section class="summary">
          <div class="badge" id="badge"></div>
          <h1 class="title" id="title"></h1>
          <p class="subtitle" id="subtitle"></p>
          <div class="details" id="details">
            <div class="detail"><span class="detail-label" id="language-label"></span><span class="detail-value" id="language"></span></div>
            <div class="detail"><span class="detail-label" id="activations-label"></span><span class="detail-value" id="activations">0</span></div>
            <div class="detail"><span class="detail-label" id="viewport-label"></span><span class="detail-value" id="viewport">—</span></div>
          </div>
        </section>
        <section class="counter-panel">
          <div class="counter-display">
            <div class="counter-value" id="value"></div>
            <div class="counter-label" id="counter-label"></div>
          </div>
          <div class="actions">
            <button class="button button-primary" id="increment" type="button"></button>
            <button class="button" id="decrement" type="button"></button>
            <button class="button" id="reset" type="button"></button>
          </div>
        </section>
      </main>
    `;

    const pageElement = shadowRoot.querySelector(".counter-page");
    const detailsElement = shadowRoot.getElementById("details");
    const valueElement = shadowRoot.getElementById("value");
    const activationsElement = shadowRoot.getElementById("activations");
    const viewportElement = shadowRoot.getElementById("viewport");
    const incrementElement = shadowRoot.getElementById("increment");
    const decrementElement = shadowRoot.getElementById("decrement");

    shadowRoot.getElementById("badge").textContent = text.badge;
    shadowRoot.getElementById("title").textContent = text.title;
    shadowRoot.getElementById("subtitle").textContent = text.subtitle;
    shadowRoot.getElementById("language-label").textContent = text.language;
    shadowRoot.getElementById("language").textContent = context.i18n.language || "en";
    shadowRoot.getElementById("activations-label").textContent = text.activations;
    shadowRoot.getElementById("viewport-label").textContent = text.viewport;
    shadowRoot.getElementById("counter-label").textContent = text.counter;
    shadowRoot.getElementById("reset").textContent = text.reset;
    valueElement.textContent = String(count);

    const updateCount = (nextCount) => {
      count = nextCount;
      context.storage.set("count", count);
      valueElement.textContent = String(count);
    };
    incrementElement.addEventListener("click", () => updateCount(count + step), { signal: eventController.signal });
    decrementElement.addEventListener("click", () => updateCount(count - step), { signal: eventController.signal });
    shadowRoot.getElementById("reset").addEventListener("click", () => updateCount(0), { signal: eventController.signal });

    const updateViewport = (metrics) => {
      const bounds = metrics || shadowRoot.host.getBoundingClientRect();
      viewportElement.textContent = `${Math.round(bounds.width)} × ${Math.round(bounds.height)}`;
    };
    this._activate = () => {
      activations += 1;
      activationsElement.textContent = String(activations);
      updateViewport();
    };
    this._resize = updateViewport;
    this._applyConfig = (config) => {
      step = config.step;
      incrementElement.textContent = `${text.increase} ${step}`;
      decrementElement.textContent = `${text.decrease} ${step}`;
      detailsElement.hidden = !config.showDetails;
      pageElement.dataset.accent = config.accent;
    };
    this._eventController = eventController;
    this._applyConfig(context.config);
  },

  // activate runs every time this navigable page enters the foreground.
  async activate() {
    this._activate();
  },

  // This example starts no foreground-only work, so deactivation needs no action.
  async deactivate() {},

  // CastBoard supplies the active page size in CSS pixels.
  async onResize(shadowRoot, context, metrics) {
    this._resize(metrics);
  },

  // Configuration changes are applied in place without remounting the plugin.
  async onConfigChange(shadowRoot, context, newConfig) {
    this._applyConfig(newConfig);
  },

  // unmount releases listeners and retained closures created by mount.
  async unmount(shadowRoot) {
    this._eventController.abort();
    this._eventController = null;
    this._activate = null;
    this._resize = null;
    this._applyConfig = null;
    shadowRoot.replaceChildren();
  },
};
