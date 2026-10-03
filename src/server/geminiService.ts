/**
 * Re-exporting from nvidiaService to seamlessly replace Gemini API with NVIDIA API.
 * This preserves backwards compatibility with any existing imports while running
 * on NVIDIA NIM Inference (meta/llama-3.2-11b-vision-instruct).
 */
export { summarizeJobWithDualLayer, parseVoiceCommandWithDualLayer } from './nvidiaService.ts';
