export const fakeAnalyse = async (type: 'image' | 'video') => {
  const delay = 800 + Math.random() * 1600;
  await new Promise(r => setTimeout(r, delay));
  const authenticity = Math.random();
  const lighting = Math.random();
  const texture = Math.random();
  const biological = Math.random();
  const compression = Math.random();
  const score = (authenticity * 0.3 + lighting * 0.1 + texture * 0.2 + biological * 0.25 + compression * 0.15);
  const issues = [
    texture < 0.45 && {
      id: 'texture_inconsistency',
      label: 'Texture Inconsistency',
      severity: 0.6 + (0.45 - texture),
      description: 'Surface texture variance deviates from natural frequency spectrum.',
      suggestion: 'Increase resolution source or capture under uniform lighting.'
    },
    biological < 0.5 && {
      id: 'biological_anomaly',
      label: 'Biological Motion Anomaly',
      severity: 0.5 + (0.5 - biological),
      description: 'Micro-expression timing / blink rate irregular.',
      suggestion: 'Capture longer segment for motion stabilization analysis.'
    },
    compression < 0.4 && {
      id: 'compression_artifacts',
      label: 'Compression Artifacts',
      severity: 0.4 + (0.4 - compression),
      description: 'Blocky / oversmoothed regions reduce authenticity confidence.',
      suggestion: 'Use less aggressive compression or source original file.'
    }
  ].filter(Boolean) as any[];
  return {
    score,
    metrics: { authenticity, lighting, texture, biological, compression },
    issues
  };
};
