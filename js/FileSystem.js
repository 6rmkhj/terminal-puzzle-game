export class FileSystem {
    constructor() {
        this.currentPath = "/";
        this.fs = {
            "/": {
                type: "dir",
                children: {
                    "logs": { type: "dir", children: {} },
                    "user": { type: "dir", children: {} },
                    "system": { type: "dir", children: {} }
                }
            }
        };
    }

    createFile(path, name, id, content) {
        if (typeof id !== "string") throw new Error("ID must be string");
        const dir = this._nav(path);
        dir.children[name] = { type:"file", content, id };
    }

    list() {
        return Object.keys(this._nav(this.currentPath).children);
    }

    readFile(path, name) {
        return this._nav(path).children[name]?.content || "";
    }

    changeDir(path) {
        this._nav(path);
        this.currentPath = path;
    }

    _nav(path) {
        let cur = this.fs["/"];
        const parts = path.split("/").filter(Boolean);
        for (let p of parts) {
            cur = cur.children[p];
            if (!cur) throw "path error";
        }
        return cur;
    }
}