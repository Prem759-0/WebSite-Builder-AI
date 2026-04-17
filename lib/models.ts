export const models = {
  ui: 'openai/gpt-oss-120b:free',
  code: 'openai/gpt-oss-120b:free',
  fast: 'google/gemma-4-26b-a4b-it:free',
  reasoning: 'nvidia/nemotron-3-super-120b-a12b:free'
} as const;

export const chooseModel = (prompt: string) => {
  const lowered = prompt.toLowerCase();
  if (lowered.includes('explain') || lowered.includes('why')) return models.reasoning;
  if (lowered.includes('code') || lowered.includes('build') || lowered.includes('component')) return models.code;
  if (lowered.includes('ui') || lowered.includes('design')) return models.ui;
  return models.fast;
};
