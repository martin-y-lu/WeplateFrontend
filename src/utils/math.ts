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
    return num?.toFixed(0)
}

import { Platform } from "react-native";

export function formatTransformRotation(angle: number){
    return `${angle}rad`
    // return `0rad`
}


export function hexToRgb(hex) {
    if(hex == null) return null
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });
  
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }