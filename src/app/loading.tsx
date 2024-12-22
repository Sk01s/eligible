// app/loading.js
"use client";

import { useEffect } from "react";
import NProgress from "nprogress";
// import "nprogress/nprogress.css";

export default function Loading() {
  useEffect(() => {
    NProgress.start();

    return () => {
      NProgress.done();
    };
  }, []);

  return null; // No UI, only progress bar functionality
}
