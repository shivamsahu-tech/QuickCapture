import { useState } from "react";

export function Spinner({size = 6}) {
    return (
      <div
        role="status"
      className={`inline-block animate-spin rounded-full mt-auto border-4 border-t-transparent border-gray-400`}
      style={{height: `${size*4}px`, width: `${size*4}px` }}
      />
    );
  }
  