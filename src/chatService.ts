// chatService.ts
// Handles sending messages and simulating AI responses

export type ChatMessage = {
  type: 'user' | 'assistant';
  content: string;
};

const aiResponses = [
  "Based on your uploaded documents, here are the key insights I found regarding your query. The analysis shows several important patterns that align with your research objectives.",
  "I've analyzed your knowledge base and found relevant information about this topic. Here's what I discovered from the connected data sources and uploaded files.",
  "From the documents in your knowledge base, I can provide the following analysis:\n\n• Key finding 1: Relevant data point from your documents\n• Key finding 2: Cross-referenced information\n• Key finding 3: Actionable insights based on your query",
  "Let me search through your uploaded content to provide you with accurate information. The results indicate several relevant matches to your question.",
  "Based on the data sources you've connected, here's what I found relevant to your question:\n\n**Summary:** Your query relates to multiple documents in your knowledge base.\n\n**Key Points:**\n• Primary insight from document analysis\n• Secondary findings from cross-referencing\n• Recommendations based on the data"
];


export const initialAssistantMessage: ChatMessage = {
  type: 'assistant',
  content: `# Post-Interview

1. Transcribe and Analyze:
   • Transcribe the interview recordings if necessary.
   • Identify key themes, patterns, and insights from the responses.

2. Share Findings:
   • Compile findings into a report or presentation.
   • Highlight actionable insights and recommendations for the design and product teams.

3. Follow Up:
   • Send a thank-you note to participants.
   • Provide any promised incentives or rewards.
   • Share any high-level findings or updates with participants, if appropriate.

# Tips for Effective Interviews

• **Active Listening:** Pay close attention to participants' responses and show genuine interest.
• **Neutral Stance:** Avoid leading questions or expressing your own opinions.
• **Adaptability:** Be prepared to adjust the interview flow based on participants' responses.
• **Empathy:** Understand and respect participants' perspectives and experiences.
• **Documentation:** Take thorough notes and record important observations during the interview.`
};

export function sendMessage(query: string, chatMessages: ChatMessage[]): Promise<ChatMessage> {
  // Simulate AI response with a delay
  return new Promise(resolve => {
    setTimeout(() => {
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      resolve({ type: 'assistant', content: randomResponse });
    }, 1000);
  });
}
