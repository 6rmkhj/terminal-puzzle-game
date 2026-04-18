export class PuzzleManager {
    constructor(puzzles){
        this.puzzles = puzzles;
    }

    generateLogData() {
        let logs = [];

        const errorIndex = Math.floor(Math.random() * 1000);

        for (let i = 0; i < 1000; i++) {
            if (i === errorIndex) {
                logs.push(`[ERROR] X-00712-CRITICAL`);
            } else {
                logs.push(`[INFO] process ${i}`);
            }
        }

        return logs.join("\n");
    }
}