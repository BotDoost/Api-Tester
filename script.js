document.addEventListener('DOMContentLoaded', () => {
    // 1. اصلاح IDها مطابق HTML
    const paramsContainer = document.getElementById('params'); // قبلا 'params-container'
    const addParamBtn = document.getElementById('add-param');
    const sendRequestBtn = document.getElementById('send'); // قبلا 'send-request'
    const responseOutput = document.getElementById('output'); // قبلا 'response-output'

    // 2. افزودن پارامتر جدید (همان قبلی)
    addParamBtn.addEventListener('click', () => {
        const paramRow = document.createElement('div');
        paramRow.className = 'param-row';
        paramRow.innerHTML = `
            <input type="text" placeholder="Key" class="param-key">
            <input type="text" placeholder="Value" class="param-value">
            <button class="remove-param">×</button>
        `;
        paramsContainer.appendChild(paramRow);
        
        paramRow.querySelector('.remove-param').addEventListener('click', () => {
            paramRow.remove();
        });
    });

    // 3. ارسال درخواست (اصلاحات حیاتی)
    sendRequestBtn.addEventListener('click', async () => {
        // اصلاح IDهای ورودی
        const url = document.getElementById('url').value;
        const method = document.getElementById('method').value;
        const token = document.getElementById('token').value;
        const body = document.getElementById('body').value; // قبلا 'request-body'
        
        // 4. بهبود مدیریت پارامترها برای Hugging Face
        let requestUrl = url;
        let requestBody = null;
        let headers = {};
        
        if (token) headers['Authorization'] = token;
        
        // 5. منطق متفاوت برای GET vs POST
        if (method === 'GET') {
            // ساخت پارامترهای GET
            const params = new URLSearchParams();
            document.querySelectorAll('.param-row').forEach(row => {
                const key = row.querySelector('.param-key').value;
                const value = row.querySelector('.param-value').value;
                if (key) params.append(key, value);
            });
            requestUrl = `${url}?${params.toString()}`;
        } else {
            // برای POST/PUT/PATCH
            headers['Content-Type'] = 'application/json';
            requestBody = body;
        }
        
        try {
            responseOutput.textContent = 'در حال ارسال درخواست...';
            
            const response = await fetch(requestUrl, {
                method: method,
                headers: headers,
                body: requestBody
            });
            
            const data = await response.json();
            responseOutput.textContent = JSON.stringify(data, null, 2);
            responseOutput.style.color = response.ok ? 'green' : 'red';
            
        } catch (error) {
            responseOutput.textContent = `خطا: ${error.message}`;
            responseOutput.style.color = 'red';
        }
    });
});
