export function useThrottling(cb,delay=1500){
    let lastCall=0;

    return function(...args){
        const now=Date.now();
        if(now-lastCall>=delay){
            lastCall=now;
            cb.apply(this,args);
        }
    }

}