import React from "react";
import { BroswerDetect } from "./browserdetect.jsx"

export const Footer = () => {
  return (
    <div className="footer">
      You are viewing this page with {BroswerDetect()}
    </div>
  );
};