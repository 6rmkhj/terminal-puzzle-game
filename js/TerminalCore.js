export class TerminalCore {
    constructor(fs) {
        this.fs = fs;
    }

    execute(input) {
        const [cmd,...args] = input.split(" ");

        switch(cmd){
            case "ls": return this.fs.list().join(" ");
            case "cd": this.fs.changeDir(args[0]); return "";
            case "cat": return this.fs.readFile(this.fs.currentPath, args[0]);
            case "grep": return this._grep(args);
            default: return "command not found";
        }
    }

    _grep(args){
        const r = new RegExp(args[0]);
        const f = this.fs.readFile(this.fs.currentPath, args[1]);
        return f.split("\n").filter(l=>r.test(l)).join("\n");
    }
}