import type { Context } from "@oomol/types/oocana";
import OpenAILib from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'

//#region generated meta
type Inputs = {
  base: string;
  key: string;
  model: string;
  messages: { role: string; content: string }[];
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

  let response = await openai.chat.completions.create({
    model: params.model,
    messages: params.messages as ChatCompletionMessageParam[]
  })

  return { output: response.choices[0].message.content };
};
