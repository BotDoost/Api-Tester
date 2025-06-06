document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.getElementById('messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    
    // تنظیمات API
    const API_URL = "https://aidoost-deepseek-ai-deepseek-r1-distill-qwen-1-5b.hf.space/api/predict";
    
    // اضافه کردن پیام به چت
    function addMessage(text, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // ارسال پیام
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        addMessage(message, true);
        userInput.value = '';
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: [message]
                })
            });
            
            if (!response.ok) throw new Error('خطا در ارتباط با سرور');
            
            const data = await response.json();
            const botResponse = data.data[0];
            
            // شبیه‌سازی تایپ کردن ربات
            simulateTyping(botResponse);
        } catch (error) {
            addMessage("اوپس! یه مشکلی پیش اومده... شیرازی می‌گه دوباره امتحان کن", false);
            console.error('Error:', error);
        }
    }
    
    // شبیه‌سازی تایپ کردن
    function simulateTyping(text) {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'bot-message');
        typingDiv.id = 'typing-indicator';
        messagesContainer.appendChild(typingDiv);
        
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                typingDiv.textContent = text.substring(0, i + 1);
                i++;
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            } else {
                clearInterval(typingInterval);
                typingDiv.removeAttribute('id');
            }
        }, 30);
    }
    
    // رویدادهای کلیک و کیبورد
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    // پیام خوشامدگویی
    setTimeout(() => {
        addMessage("سلام! من هوش مصنوعی شیرازی هستم. چطور می‌تونم کمکتون کنم؟", false);
    }, 1000);
});
