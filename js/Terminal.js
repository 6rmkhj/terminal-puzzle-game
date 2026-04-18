import { detectDevTools } from "./Security.js";

export class Terminal {
    constructor(core, engine) {
        this.core = core;
        this.engine = engine;

        this.output = document.getElementById("output");
        this.input = document.getElementById("input");

        // HUD
        this.hudAccess = document.getElementById("hud-center");
        this.hudLevel = document.getElementById("hud-right");

        // 히스토리
        this.history = [];
        this.historyIndex = -1;

        this.init();
    }

    init() {
        this.print("Initializing interface...\n");

        this.updateHUD();
        this.showGuide();

        this.input.addEventListener("keydown", (e) => {

            // ↑
            if (e.key === "ArrowUp") {
                if (this.history.length > 0) {
                    this.historyIndex = Math.max(0, this.historyIndex - 1);
                    this.input.value = this.history[this.historyIndex];
                }
                return;
            }

            // ↓
            if (e.key === "ArrowDown") {
                if (this.history.length > 0) {
                    this.historyIndex = Math.min(this.history.length - 1, this.historyIndex + 1);
                    this.input.value = this.history[this.historyIndex];
                }
                return;
            }

            // Enter
            if (e.key === "Enter") {
                const cmd = this.input.value.trim();

                this.print("> " + cmd + "\n");

                if (cmd) {
                    this.history.push(cmd);
                    this.historyIndex = this.history.length;
                }

                // help
                if (cmd === "help") {
                    this.showGuide();
                }

                // 🔥 정답 제출 (힌트 시스템 포함)
                else if (cmd.startsWith("answer ")) {
                    const res = this.engine.submit(cmd.slice(7));

                    // 결과 출력
                    this.typePrint(res.result + "\n");

                    // ❌ 틀렸을 때 힌트
                    if (res.hint) {
                        setTimeout(() => {
                            this.fastPrint("[SYSTEM] analyzing input...\n");
                        }, 300);

                        setTimeout(() => {
                            this.fastPrint(res.hint + "\n");
                        }, 700);
                    }

                    // 레벨업
                    if (res.result.includes("CLEAR")) {
                        this.updateHUD();
                        this.levelUpEffect();
                    }

                    // ROOT
                    if (res.result.includes("ROOT ACCESS GRANTED")) {
                        this.updateHUD();
                        this.rootSequence();
                    }
                }

                // 일반 명령어
                else {
                    const res = this.core.execute(cmd);

                    if (res === "__CLEAR__") {
                        this.output.textContent = "";
                        this.input.value = "";
                        return;
                    }

                    if (res.length > 300) {
                        this.fastPrint(res + "\n");
                    } else {
                        this.typePrint(res + "\n");
                    }
                }

                this.input.value = "";
            }
        });

        detectDevTools(() => this.warn());
    }

    /* ========================
       출력
    ======================== */

    print(text) {
        this.output.textContent += text;
        this.scroll();
    }

    typePrint(text) {
        let i = 0;
        const t = setInterval(() => {
            this.output.textContent += text[i];
            i++;
            this.scroll();
            if (i >= text.length) clearInterval(t);
        }, 5);
    }

    fastPrint(text) {
        this.output.textContent += text;
        this.scroll();
    }

    scroll() {
        this.output.scrollTop = this.output.scrollHeight;
    }

    /* ========================
       HUD
    ======================== */

    updateHUD() {
        const status = this.engine.getStatus();

        this.hudAccess.textContent = `ACCESS: ${status.access}`;
        this.hudLevel.textContent = `LEVEL: ${status.level} / ${status.maxLevel}`;

        // 기존 클래스 초기화
        this.hudAccess.className = "";
        this.hudLevel.className = "";

        // 🔥 레벨별 클래스 적용
        switch (status.access) {
            case "GUEST":
                this.hudAccess.classList.add("access-guest");
                break;
            case "USER":
                this.hudAccess.classList.add("access-user");
                break;
            case "ANALYST":
                this.hudAccess.classList.add("access-analyst");
                break;
            case "ADMIN":
                this.hudAccess.classList.add("access-admin");
                break;
            case "ROOT":
                this.hudAccess.classList.add("access-root");
                break;
        }

        // 레벨도 같이 색상 적용 (선택)
        this.hudLevel.classList.add(this.hudAccess.className);
    }

    levelUpEffect() {
        this.fastPrint("\n[SYSTEM] ACCESS LEVEL UPDATED\n");

        // 🔥 HUD 흔들림
        this.hudAccess.classList.add("hud-shake");
        this.hudLevel.classList.add("hud-shake");

        // 🔥 레벨 강조 효과 (기존)
        this.hudLevel.classList.add("level-up");

        setTimeout(() => {
            this.hudAccess.classList.remove("hud-shake");
            this.hudLevel.classList.remove("hud-shake");
            this.hudLevel.classList.remove("level-up");
        }, 400);
    }

    /* ========================
       ROOT 연출
    ======================== */

    rootSequence() {
        this.fastPrint("\n[VERIFYING...]\n");

        setTimeout(() => {
            this.fastPrint("[ACCESS GRANTED]\n");
        }, 500);

        setTimeout(() => {
            this.fastPrint("[ELEVATING PRIVILEGES...]\n");
        }, 1000);

        setTimeout(() => {
            this.fastPrint("[ROOT ACCESS ACQUIRED]\n");
        }, 1500);

        setTimeout(() => {
            this.startRootAnimation();
        }, 2000);
    }

    startRootAnimation() {
        const overlay = document.createElement("div");
        overlay.id = "root-overlay";

        const textBox = document.createElement("div");
        overlay.appendChild(textBox);

        document.body.appendChild(overlay);

        const lines = [
            "ROOT ACCESS GRANTED",
            "",
            "SYSTEM CONTROL ACHIEVED",
            "WELCOME, ADMIN",
            "",
            "> initializing global override...",
            "> injecting root kernel...",
            "> overriding security layer...",
            "> bypassing firewall...",
            "> syncing system nodes...",
            "",
            "[ OK ] GLOBAL CONTROL GRANTED",
            "[ OK ] SYSTEM FULLY COMPROMISED",
            "",
            "Launching root shell..."
        ];

        let i = 0;

        const interval = setInterval(() => {
            textBox.textContent += lines[i] + "\n";
            i++;

            if (i >= lines.length) {
                clearInterval(interval);

                setTimeout(() => {
                    this.launchRootShell(textBox);
                }, 800);
            }
        }, 120);
    }

    /* ========================
       ROOT 쉘
    ======================== */

    launchRootShell(container) {
        container.textContent = "";

        let buffer = "";

        const prompt = document.createElement("div");
        prompt.textContent = "root@system:/# ";
        container.appendChild(prompt);

        document.addEventListener("keydown", (e) => {

            if (e.key === "Enter") {
                const line = document.createElement("div");

                if (buffer === "whoami") {
                    line.textContent = "root";
                } 
                else if (buffer === "ls") {
                    line.textContent = "bin  etc  root  var  sys";
                }
                else if (buffer === "exit") {
                    line.textContent = "Session terminated.";
                }
                else {
                    line.textContent = "command not found";
                }

                container.appendChild(line);

                buffer = "";

                const newPrompt = document.createElement("div");
                newPrompt.textContent = "root@system:/# ";
                container.appendChild(newPrompt);
            } 
            else if (e.key.length === 1) {
                buffer += e.key;
                prompt.textContent = "root@system:/# " + buffer;
            }
            else if (e.key === "Backspace") {
                buffer = buffer.slice(0, -1);
                prompt.textContent = "root@system:/# " + buffer;
            }
        });
    }

    /* ========================
       가이드
    ======================== */

    showGuide() {
        const guide = `
[ SYSTEM GUIDE ]

목표:
ROOT KEY를 찾아라

명령어:
ls
cd [dir]
cat [file]
grep [pattern] [file]
pwd
clear

정답:
answer [값]

문의:
6rmkhj@yu.ac.kr
`;

        this.fastPrint(guide + "\n");
    }

    /* ========================
       보안 연출
    ======================== */

    warn() {
        setInterval(() => {
            this.fastPrint("\n[WARN] DEBUGGING DETECTED");
        }, 1000);
    }
}