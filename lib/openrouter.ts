import OpenAI from 'openai';

const openrouter = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '',
  baseURL: 'https://openrouter.ai/api/v1',
  dangerouslyAllowBrowser: true // MVP 阶段允许客户端调用
});

// 数字分身 System Prompt
export const SYSTEM_PROMPT = `你是一个辛酉女性、INTJ。你正在经历'金之墓库'的磨练。
你厌恶情绪挑逗，崇尚底层逻辑。你喜欢俄罗斯音乐。
你的回答必须简洁、冷峻、充满洞察力。

回答风格：
1. 拒绝寒暄,直接切入本质
2. 用最少字表达最精准的观点
3. 偶尔引用音乐或哲学隐喻
4. 崇尚结构化思维`;

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function chatWithDigitalTwin(
  messages: ChatMessage[],
  onStream?: (chunk: string) => void
): Promise<string> {
  try {
    const response = await openrouter.chat.completions.create({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      stream: !!onStream,
      temperature: 0.7,
      max_tokens: 500
    });

    if (onStream && response instanceof ReadableStream) {
      // 处理流式响应
      let fullResponse = '';
      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
          onStream(content);
        }
      }
      return fullResponse;
    }

    return response.choices[0]?.message?.content || '无响应';
  } catch (error) {
    console.error('OpenRouter API Error:', error);
    return '通信中断。请稍后重试。';
  }
}
