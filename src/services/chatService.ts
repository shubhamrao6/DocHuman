import { WebSocketService, WSMessage } from './websocketService';
import { getStoredAuth } from './authService';

export type ChatMessage = {
  type: 'user' | 'assistant';
  content: string;
};

const WS_URL = 'wss://jyukhbg024.execute-api.us-east-1.amazonaws.com/prod';
const MODEL_ID = 'premium';
const PROVIDER = 'azure';

export function sendMessage(query: string, chatMessages: ChatMessage[], onStream: (chunk: string) => void, onHistoryLoad?: (history: ChatMessage[]) => void): Promise<ChatMessage> {
  return new Promise((resolve, reject) => {
    const auth = getStoredAuth();
    if (!auth || !auth.idToken) {
      reject('No ID token available for WebSocket authentication');
      return;
    }
    const wsService = new WebSocketService(auth.idToken, WS_URL);
    let responseText = '';
    let historyLoaded = false;
    wsService.connect((msg: WSMessage) => {
      console.log('📨 WebSocket message received:', msg);
      if (msg.type === 'history' && msg.messages && onHistoryLoad && !historyLoaded) {
        console.log('📜 History received:', msg.messages);
        const history: ChatMessage[] = msg.messages.map((m: any) => ({
          type: m.role === 'user' ? 'user' : 'assistant',
          content: m.content
        }));
        console.log('📜 Converted history:', history);
        onHistoryLoad(history);
        historyLoaded = true;
      } else if (msg.type === 'start') {
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
      console.log('🔄 Loading chat history...');
      wsService.loadHistory();
      console.log('📤 Sending message:', query);
      wsService.sendPayload({
        action: 'sendMessage',
        question: query,
        model_id: MODEL_ID,
        provider: PROVIDER
      });
    }).catch(reject);
  });
}

export function loadChatHistory(): Promise<ChatMessage[]> {
  return new Promise((resolve, reject) => {
    const auth = getStoredAuth();
    if (!auth || !auth.idToken) {
      reject('No ID token available for WebSocket authentication');
      return;
    }
    console.log('🔄 Starting loadChatHistory...');
    console.log('🔑 ID Token:', auth.idToken);
    const wsService = new WebSocketService(auth.idToken, WS_URL);
    wsService.connect((msg: WSMessage) => {
      console.log('📨 loadChatHistory WebSocket message:', msg);
      if (msg.type === 'history' && msg.messages) {
        console.log('📜 History messages received:', msg.messages);
        const chatMessages: ChatMessage[] = msg.messages.map((m: any) => ({
          type: m.role === 'user' ? 'user' : 'assistant',
          content: m.content
        }));
        console.log('📜 Converted chat messages:', chatMessages);
        wsService.disconnect();
        resolve(chatMessages);
      } else if (msg.error) {
        console.error('❌ History load error:', msg.error);
        wsService.disconnect();
        reject(msg.error);
      }
    }).then(() => {
      console.log('🔄 Sending load_history action...');
      wsService.loadHistory();
    }).catch(reject);
  });
}