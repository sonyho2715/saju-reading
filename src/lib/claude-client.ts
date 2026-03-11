import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface StreamingOptions {
  onToken: (token: string) => void;
  onComplete: (fullText: string) => void;
  onError: (error: Error) => void;
}

export async function generateText(
  prompt: string,
  options?: { maxTokens?: number; model?: string }
): Promise<{ text: string; inputTokens: number; outputTokens: number }> {
  const response = await client.messages.create({
    model: options?.model ?? 'claude-opus-4-6',
    max_tokens: options?.maxTokens ?? 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  return {
    text,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
  };
}

export async function streamText(
  prompt: string,
  options: StreamingOptions & { maxTokens?: number; model?: string }
): Promise<void> {
  const stream = client.messages.stream({
    model: options.model ?? 'claude-opus-4-6',
    max_tokens: options.maxTokens ?? 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  let fullText = '';
  stream.on('text', (text) => {
    fullText += text;
    options.onToken(text);
  });

  try {
    await stream.finalMessage();
    options.onComplete(fullText);
  } catch (err) {
    options.onError(err instanceof Error ? err : new Error(String(err)));
  }
}

export function estimateTokens(text: string): number {
  // Rough estimate: ~4 chars per token for English, ~2 chars per token for Korean/CJK
  // Use a blended average
  return Math.ceil(text.length / 3.5);
}
