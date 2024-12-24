export const factUserMessage = (prevFacts?: string[]) => {
  return `Please give me a new one

${prevFactsPrompt(prevFacts)}
`
}

export const prevFactsPrompt = (prevFacts?: string[]) => {
  const factsString = prevFacts?.map((fact) => {
    return `- ${fact}`
  }).join('\n')

  return `Previous facts:
${factsString || '-'}
`
}
