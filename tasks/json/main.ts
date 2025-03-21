import type { Context } from "@oomol/types/oocana";
import OpenAILib from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'

//#region generated meta
type Inputs = {
  base: string;
  key: string;
  model: string;
  messages: { role: string; content: string }[];
  schame: string;
}
type Outputs = {
  output: string;
}
//#endregion

export default async function (
  params: Inputs,
  context: Context<Inputs, Outputs>
): Promise<Outputs> {
  let openai = new OpenAILib({
    apiKey: params.key,
    baseURL: params.base,
  })

  let messages_ = [
    {
      role: 'system' as const,
      content: [
        `你是一个有用的助手, 你应该只输出一个JSON. 期望的JSON形状是:`,
        '```json',
        params.schame,
        '```',
        '',
        ...params.messages.filter((a) => a.role === 'system').map((a) => a.content),
      ].join('\n'),
    },
    ...params.messages.filter((a) => a.role !== 'system'),
  ].flatMap((a) => (a === null ? [] : [a]))

  let response = await openai.chat.completions.create({
    model: params.model,
    messages: messages_ as ChatCompletionMessageParam[]
  })

  return { output: response.choices[0].message.content };
};
