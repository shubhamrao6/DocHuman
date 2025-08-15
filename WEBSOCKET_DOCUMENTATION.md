# Business Assistant API Documentation

This document provides a simplified guide for testing and integrating the Business Assistant WebSocket API.

## API Overview

The Business Assistant API is a WebSocket-based API that provides:
- User-specific conversation history
- Text and image processing with AWS Bedrock (Claude 3 Sonnet)
- Real-time streaming responses
- Conversation history management

## Authentication

The API uses Amazon Cognito for authentication:

1. Obtain an ID token from your Cognito User Pool
2. Connect to the WebSocket API with the token as a query parameter:
   ```
   wss://your-api-id.execute-api.region.amazonaws.com/prod?token=your-cognito-token
   ```

## API Actions

### 1. Send a Message

Send a text question with optional images:

```json
{
  "action": "sendMessage",
  "question": "What is AWS Bedrock?",
  "images": []
}
```

With images:

```json
{
  "action": "sendMessage",
  "question": "What's in this image?",
  "images": [
    {
      "format": "jpeg",
      "base64": "base64_encoded_image_data"
    }
  ]
}
```

### 2. Load Conversation History

Retrieve user-specific conversation history:

```json
{
  "action": "load_history"
}
```

### 3. Clear Conversation History

Clear user-specific conversation history:

```json
{
  "action": "clear_conversation"
}
```

## Response Types

### 1. Start Message

```json
{
  "type": "start",
  "message": "Starting to process your request..."
}
```

### 2. Chunk Message (Streaming)

```json
{
  "type": "chunk",
  "text": "AWS Bedrock is a fully managed service that"
}
```

### 3. End Message

```json
{
  "type": "end",
  "message": "Response complete"
}
```

### 4. History Message

```json
{
  "type": "history",
  "messages": [
    {
      "message_id": "123e4567-e89b-12d3-a456-426614174000",
      "timestamp": 1620000000,
      "role": "user",
      "content": "What is AWS Bedrock?",
      "image_urls": [],
      "user_id": "user123"
    },
    {
      "message_id": "123e4567-e89b-12d3-a456-426614174001",
      "timestamp": 1620000001,
      "role": "assistant",
      "content": "AWS Bedrock is a fully managed service...",
      "image_urls": [],
      "user_id": "user123"
    }
  ]
}
```

### 5. Clear Complete Message

```json
{
  "type": "clear_complete",
  "message": "Conversation history cleared successfully"
}
```

### 6. Error Message

```json
{
  "error": "Error processing request: Invalid token"
}
```

## Testing with Postman

Postman now supports WebSockets for testing:

1. Create a new WebSocket request
2. Enter the URL with token: `wss://your-api-id.execute-api.region.amazonaws.com/prod?token=your-cognito-token`
3. Connect
4. Send messages in JSON format

## Test Cases

### Test Case 1: Authentication

**Test Steps:**
1. Connect with a valid token
2. Connect with an invalid token
3. Connect with no token

**Expected Results:**
- Valid token: Connection established
- Invalid token: Connection rejected
- No token: Connection rejected

### Test Case 2: Send Text Question

**Test Steps:**
1. Connect with a valid token
2. Send:
   ```json
   {
     "action": "sendMessage",
     "question": "What is AWS Bedrock?",
     "images": []
   }
   ```

**Expected Results:**
- Receive "start" message
- Receive multiple "chunk" messages
- Receive "end" message

### Test Case 3: Send Question with Image

**Test Steps:**
1. Connect with a valid token
2. Convert an image to base64
3. Send:
   ```json
   {
     "action": "sendMessage",
     "question": "What's in this image?",
     "images": [
       {
         "format": "jpeg",
         "base64": "base64_encoded_image_data"
       }
     ]
   }
   ```

**Expected Results:**
- Receive "start" message
- Receive multiple "chunk" messages that reference the image
- Receive "end" message

### Test Case 4: Load History

**Test Steps:**
1. Connect with a valid token
2. Send at least one question
3. Send:
   ```json
   {
     "action": "load_history"
   }
   ```

**Expected Results:**
- Receive "history" message with previous messages

### Test Case 5: Clear Conversation

**Test Steps:**
1. Connect with a valid token
2. Send at least one question
3. Send:
   ```json
   {
     "action": "clear_conversation"
   }
   ```
4. Load history again

**Expected Results:**
- Receive "clear_complete" message
- History should be empty after clearing

## Angular Integration Guide

### 1. Install Required Packages

```bash
npm install amazon-cognito-identity-js
```

### 2. Create WebSocket Service

```typescript
// websocket.service.ts
import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Message {
  type: string;
  text?: string;
  message?: string;
  messages?: any[];
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private messageSubject = new BehaviorSubject<Message | null>(null);
  public messages$ = this.messageSubject.asObservable();

  constructor() {}

  async connect(): Promise<boolean> {
    try {
      // Get token from Cognito
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      
      // Connect to WebSocket
      const apiUrl = 'wss://your-api-id.execute-api.region.amazonaws.com/prod';
      this.socket = new WebSocket(`${apiUrl}?token=${token}`);
      
      // Set up event handlers
      this.socket.onopen = () => {
        console.log('WebSocket connected');
      };
      
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.messageSubject.next(data);
      };
      
      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      return true;
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      return false;
    }
  }

  sendMessage(question: string, images: any[] = []): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return;
    }
    
    const message = {
      action: 'sendMessage',
      question,
      images
    };
    
    this.socket.send(JSON.stringify(message));
  }

  loadHistory(): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return;
    }
    
    const message = {
      action: 'load_history'
    };
    
    this.socket.send(JSON.stringify(message));
  }

  clearConversation(): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return;
    }
    
    const message = {
      action: 'clear_conversation'
    };
    
    this.socket.send(JSON.stringify(message));
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
```

### 3. Use the WebSocket Service in a Component

```typescript
// chat.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService, Message } from './websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: any[] = [];
  currentQuestion = '';
  isConnected = false;
  isLoading = false;
  currentResponse = '';
  private subscription: Subscription | null = null;

  constructor(private webSocketService: WebSocketService) {}

  async ngOnInit() {
    // Connect to WebSocket
    this.isConnected = await this.webSocketService.connect();
    
    // Subscribe to messages
    this.subscription = this.webSocketService.messages$.subscribe(message => {
      if (!message) return;
      
      switch (message.type) {
        case 'start':
          this.isLoading = true;
          this.currentResponse = '';
          break;
          
        case 'chunk':
          if (message.text) {
            this.currentResponse += message.text;
          }
          break;
          
        case 'end':
          this.isLoading = false;
          // Add the complete response to messages
          this.messages.push({
            role: 'assistant',
            content: this.currentResponse
          });
          break;
          
        case 'history':
          if (message.messages) {
            this.messages = message.messages;
          }
          break;
          
        case 'clear_complete':
          this.messages = [];
          break;
      }
    });
    
    // Load conversation history
    this.webSocketService.loadHistory();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.webSocketService.disconnect();
  }

  sendMessage() {
    if (!this.currentQuestion.trim()) return;
    
    // Add user message to UI
    this.messages.push({
      role: 'user',
      content: this.currentQuestion
    });
    
    // Send to WebSocket
    this.webSocketService.sendMessage(this.currentQuestion);
    
    // Clear input
    this.currentQuestion = '';
  }

  clearConversation() {
    this.webSocketService.clearConversation();
  }
}
```

### 4. Create a Simple Chat UI

```html
<!-- chat.component.html -->
<div class="chat-container">
  <div class="messages">
    <div *ngFor="let message of messages" class="message" [ngClass]="message.role">
      <div class="message-content">{{ message.content }}</div>
    </div>
    
    <div *ngIf="isLoading" class="message assistant">
      <div class="message-content">{{ currentResponse }}<span class="typing-indicator">...</span></div>
    </div>
  </div>
  
  <div class="input-area">
    <input 
      type="text" 
      [(ngModel)]="currentQuestion" 
      placeholder="Ask a question..." 
      (keyup.enter)="sendMessage()"
    >
    <button (click)="sendMessage()">Send</button>
    <button (click)="clearConversation()">Clear</button>
  </div>
</div>
```

### 5. Configure AWS Amplify

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';

import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: 'your-region',
    userPoolId: 'your-user-pool-id',
    userPoolWebClientId: 'your-client-id'
  }
});

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check that your token is valid and not expired
   - Verify the WebSocket URL is correct

2. **Authentication Failed**
   - Ensure the token is from the correct Cognito User Pool
   - Check that the token is properly URL-encoded

3. **No Response**
   - Verify that the message format is correct JSON
   - Check that the "action" field is spelled correctly

4. **WebSocket Disconnects**
   - Implement reconnection logic in your Angular service
   - Check for network issues