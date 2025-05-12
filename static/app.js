class ChatInterface {
    constructor() {
        this.chatButton = document.querySelector('.chat-button button');
        this.chatWindow = document.querySelector('.chat-window');
        this.minimizeBtn = document.querySelector('.minimize-btn');
        this.closeBtn = document.querySelector('.close-btn');
        this.sendBtn = document.querySelector('.send-btn');
        this.textarea = document.querySelector('.chat-input textarea');
        this.messagesContainer = document.querySelector('.chat-messages');
        
        this.isOpen = false;
        this.messages = [];
        
        this.init();
    }
    
    init() {
        // Add event listeners
        this.chatButton.addEventListener('click', () => this.toggleChat());
        this.minimizeBtn.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.toggleChat());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Add enter key event for sending message (Shift+Enter for new line)
        this.textarea.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                this.sendMessage();
            }
        });
        
        // Auto resize textarea
        this.textarea.addEventListener('input', () => {
            this.textarea.style.height = 'auto';
            this.textarea.style.height = (this.textarea.scrollHeight > 150) ? '150px' : this.textarea.scrollHeight + 'px';
        });
        
        // Add refresh button event
        this.refreshBtn = document.querySelector('.refresh-btn');
        if (this.refreshBtn) {
            this.refreshBtn.addEventListener('click', () => this.refreshConversation());
        }
    }
    
    toggleChat() {
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            this.chatWindow.classList.add('active');
            // Focus on textarea when opened
            setTimeout(() => {
                this.textarea.focus();
            }, 100);
        } else {
            this.chatWindow.classList.remove('active');
        }
    }
    
    sendMessage() {
        const text = this.textarea.value.trim();
        if (!text) return;
        
        // Add user message
        this.addMessage(text, 'user');
        this.textarea.value = '';
        this.textarea.style.height = 'auto';
        
        // Add typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        this.messagesContainer.appendChild(typingIndicator);
        this.scrollToBottom();
        
        // Send to backend
        fetch('/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            // Remove typing indicator
            this.messagesContainer.removeChild(typingIndicator);
            
            // Add bot response
            this.addMessage(data.answer, 'bot');
        })
        .catch(error => {
            // Remove typing indicator
            if (this.messagesContainer.contains(typingIndicator)) {
                this.messagesContainer.removeChild(typingIndicator);
            }
            
            // Add error message
            this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
            console.error('Error:', error);
        });
    }
    
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Clean up text by removing markdown code blocks, backticks, etc.
        let cleanText = text;
        cleanText = cleanText.replace(/```[a-z]*\n|```/g, ''); // Remove code block markers
        cleanText = cleanText.replace(/`([^`]+)`/g, '$1'); // Remove inline code backticks
        cleanText = cleanText.replace(/\n/g, '<br>'); // Convert newlines to <br>
        
        messageContent.innerHTML = cleanText;
        
        messageDiv.appendChild(messageContent);
        this.messagesContainer.appendChild(messageDiv);
        
        // Save message to history
        this.messages.push({
            text: text,
            sender: sender
        });
        
        this.scrollToBottom();
    }
    
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    refreshConversation() {
        // Clear all messages except the first welcome message
        while (this.messagesContainer.children.length > 1) {
            this.messagesContainer.removeChild(this.messagesContainer.lastChild);
        }
        
        // Reset messages array to only include welcome message
        this.messages = [this.messages[0]];
        
        // Add a system message indicating the conversation was refreshed
        const systemMsg = document.createElement('div');
        systemMsg.className = 'system-message';
        systemMsg.textContent = 'Conversation refreshed';
        this.messagesContainer.appendChild(systemMsg);
        
        // After 2 seconds, add a bot message
        setTimeout(() => {
            this.addMessage('How can I help formalize your email today?', 'bot');
        }, 2000);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const chatInterface = new ChatInterface();
});