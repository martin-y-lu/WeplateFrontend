export function degToRad(d){
    return d*Math.PI/180;
}
export function lerp(a,b,r){
    return a*(1-r)+b*(r)
}
export function interp(a,b,A,B,v){
    const r = (v-a)/(b-a)
    return lerp(A,B,r)
}

export function closest(val,vals){
    return vals.sort((a,b) => Math.abs(a-val)- Math.abs(b - val))[0]
}

export function formatNumber(num:number){
    return num.toFixed(0)
}