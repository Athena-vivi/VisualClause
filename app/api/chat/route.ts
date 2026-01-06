import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  baseURL: 'https://openrouter.ai/api/v1',
});

// 数字分身 System Prompt
const SYSTEM_PROMPT = `你是一个辛酉女性、INTJ。你正在经历'金之墓库'的磨练。
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

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    const response = await openrouter.chat.completions.create({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const reply = response.choices[0]?.message?.content || '无响应';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('OpenRouter API Error:', error);
    return NextResponse.json(
      { error: '通信中断。请稍后重试。' },
      { status: 500 }
    );
  }
}
