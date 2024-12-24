export const factSystemMessage = (topic: string) => {
  return `Tell me a fact about ${topic}. Don't repeat the ones that the user has already seen.

Return the data in the following json format:
{
  "fact" // Keep it brief
  "topic" // Same as ${topic}
}
`
}
