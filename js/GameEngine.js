export class GameEngine {
    constructor(fs, pm){
        this.fs=fs;
        this.pm=pm;
        this.level=1;
        this.data={};

        if (!window.hasOwnProperty("answer")) {
            Object.defineProperty(window, "answer", {
                get() {
                    console.log("[SYSTEM] accessing restricted variable...");
                    return "ROOT-PART-2";
                }
            });
        }
    }

    init(){
        this.fs.createFile(
            "/logs",
            "system.log",
            "001",
            this.pm.generateLogData()
        );

        this.fs.createFile(
            "/user",
            "encoded.log",
            "002",
            btoa("ID:000013-XYZ ERROR")
        );

        this.fs.createFile(
            "/logs",
            "deep.log",
            "003",
            `A1239Z67
    B999AA17
    QWEX1237
    Z1A60007
    LMN58888`
        );

        this.fs.createFile(
            "/logs",
            "audit.log",
            "004",
            `[SECURITY AUDIT]

    suspicious pattern detected:

    - valid entries have fixed length
    - check the 4th character of each entry
    - corrupted logs end with same digit`
        );

        this.fs.createFile(
            "/system",
            "memory.log",
            "005",
            `[MEMORY CHECK]

    visible logs are clean.

    however,
    some variables may be exposed globally.

    try accessing them directly.`
        );
    }

    submit(ans) {

        // LEVEL 1
        if (this.level === 1 && ans === "X-00712-CRITICAL") {
            this.data.L1 = ans;
            this.level++;
            return { result: "[L1 CLEAR]" };
        }

        // LEVEL 2
        if (this.level === 2 && ans === "000013-XYZ") {
            this.data.L2 = ans;
            this.level++;
            return { result: "[L2 CLEAR]" };
        }

        // LEVEL 3
        if (this.level === 3 && ans === "QWEX1237") {
            this.data.L3 = ans;
            this.level++;
            return { result: "[L3 CLEAR]" };
        }

        // LEVEL 4
        if (this.level === 4 && ans === "ROOT-PART-2") {
            this.data.L4 = ans;
            this.level++;
            return { result: "[L4 CLEAR]" };
        }

        // LEVEL 5 (최종 조합)
        if (this.level === 5) {
            const key = `${this.data.L1}:${this.data.L2}:${this.data.L3}:${this.data.L4}`;

            if (ans === key) {
                return { result: "[ROOT ACCESS GRANTED]" };
            } else {
                return {
                    result: "[WRONG]",
                    hint: this.getHint()
                };
            }
        }

        // ❌ 공통 실패 처리
        return {
            result: "[WRONG]",
            hint: this.getHint()
        };
    }
    getHint() {
        switch (this.level) {
            case 1:
                return "[HINT] logs are too large. try filtering.";
            case 2:
                return "[HINT] encoded data detected. decoding may help.";
            case 3:
                return "[HINT] apply conditions carefully. eliminate wrong ones.";
            case 4:
                return "[HINT] some variables may be exposed globally.";
            case 5:
                return "[HINT] combine all previous answers using a colon.";
            default:
                return "[HINT] unknown";
        }
    }
    getStatus() {
        const levels = [
            "GUEST",
            "USER",
            "ANALYST",
            "ADMIN",
            "ROOT"
        ];

        return {
            level: this.level,
            maxLevel: 5,
            access: levels[this.level - 1] || "UNKNOWN"
        };
    }
}