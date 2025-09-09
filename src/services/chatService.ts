import { WebSocketService, WSMessage } from './websocketService';
import { authResponse } from './authService';

export type ChatMessage = {
  type: 'user' | 'assistant';
  content: string;
};

const WS_URL = 'wss://jyukhbg024.execute-api.us-east-1.amazonaws.com/prod';
const MODEL_ID = 'premium';
const PROVIDER = 'azure';

export function sendMessage(query: string, chatMessages: ChatMessage[], onStream: (chunk: string) => void): Promise<ChatMessage> {
  return new Promise((resolve, reject) => {
    if (!authResponse || !authResponse.idToken) {
      reject('No ID token available for WebSocket authentication');
      return;
    }
    const wsService = new WebSocketService(authResponse.idToken, WS_URL);
    let responseText = '';
    wsService.connect((msg: WSMessage) => {
      if (msg.type === 'start') {
        responseText = '';
      } else if (msg.type === 'chunk' && msg.text) {
        responseText += msg.text;
        onStream(msg.text);
      } else if (msg.type === 'end') {
        wsService.disconnect();
        resolve({ type: 'assistant', content: responseText });
      } else if (msg.error) {
        wsService.disconnect();
        reject(msg.error);
      }
    }).then(() => {
      wsService.sendPayload({
        action: 'sendMessage',
        question: query,
        model_id: MODEL_ID,
        provider: PROVIDER
      });
    }).catch(reject);
  });
}