export function detectDevTools(cb){
    setInterval(()=>{
        if(window.outerWidth-window.innerWidth>150){
            cb();
        }
    },500);
}