import React from "react";

export const BroswerDetect = () => {
    var broswerName;
    if(navigator.userAgent.indexOf("Firefox") > -1){
        broswerName = "Firefox";
    }
    else if(navigator.userAgent.indexOf("Edg") > -1){
        broswerName = "Microsoft Edge";
    } 
    else if(navigator.userAgent.indexOf("Trident") > -1){
        broswerName = "Microsoft Internet Explorer";
    }
    else if(navigator.userAgent.indexOf("Chrome") > -1){
        broswerName = "Google Chrome";
    }
    else{
        broswerName = "an undetermined browser. Correct functionality not guaranteed."
    }
    return(broswerName);
  }