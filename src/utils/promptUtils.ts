import prompts from "prompts";

export async function promptInputs(questions: prompts.PromptObject[]) {
  return await prompts(questions);
}
