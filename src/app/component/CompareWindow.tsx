import React from "react";

interface CompareWindowProps {
  compareOutputHash: string;
  outputHash: string;
}

const CompareWindow: React.FC<CompareWindowProps> = ({ compareOutputHash, outputHash }) => {
  // Define a threshold for determining similarity
  const threshold = 5;

  // Compare the pHash values to determine similarity
  const similarity = Math.abs(parseInt(compareOutputHash, 16) - parseInt(outputHash, 16));

  // Determine if the output is similar to the compare output based on the threshold
  const isSimilar = similarity <= threshold;

  return (
    <div className="compare-window">
      <h2>Comparison Results</h2>
      <p>Output pHash: {outputHash}</p>
      <p>Compare Output pHash: {compareOutputHash}</p>
      <p>Similarity: {similarity}</p>
      <p>{isSimilar ? "Output is similar to compare output" : "Output is different from compare output"}</p>
    </div>
  );
}

export default CompareWindow;
