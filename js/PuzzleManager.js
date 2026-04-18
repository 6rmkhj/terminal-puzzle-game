export class PuzzleManager {
    constructor(puzzles){
        this.puzzles = puzzles;
    }

    generateLogData(n=5000){
        const logs=[];
        for(let i=0;i<n;i++){
            logs.push(`[INFO] ID:${Math.random().toString(36).slice(2,10)} OK`);
        }
        logs.push("[ERROR] ID:X-00712-CRITICAL DATA_CORRUPTED");
        return logs.join("\n");
    }
}