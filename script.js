document.addEventListener('DOMContentLoaded', () => {
    const paramsContainer = document.getElementById('params-container');
    const addParamBtn = document.getElementById('add-param');
    const sendRequestBtn = document.getElementById('send-request');
    const responseOutput = document.getElementById('response-output');

    // افزودن پارامتر جدید
    addParamBtn.addEventListener('click', () => {
        const paramRow = document.createElement('div');
        paramRow.className = 'param-row';
        paramRow.innerHTML = `
            <input type="text" placeholder="کلید" class="param-key">
            <input type="text" placeholder="مقدار" class="param-value">
            <button class="remove-param">×</button>
        `;
        paramsContainer.appendChild(paramRow);
        
        paramRow.querySelector('.remove-param').addEventListener('click', () => {
            paramRow.remove();
        });
    });

    // ارسال درخواست
    sendRequestBtn.addEventListener('click', async () => {
        const url = document.getElementById('api-url').value;
        const method = document.getElementById('api-method').value;
        const token = document.getElementById('api-token').value;
        const body = document.getElementById('request-body').value;
        
        // جمع‌آوری پارامترها
        const params = {};
        document.querySelectorAll('.param-row').forEach(row => {
            const key = row.querySelector('.param-key').value;
            const value = row.querySelector('.param-value').value;
            if (key) params[key] = value;
        });
        
        // ساخت URL با پارامترها
        const urlWithParams = new URL(url);
        Object.keys(params).forEach(key => {
            urlWithParams.searchParams.append(key, params[key]);
        });
        
        try {
            responseOutput.textContent = 'در حال ارسال درخواست...';
            
            const headers = {};
            if (token) headers['Authorization'] = token;
            
            let requestOptions = {
                method: method,
                headers: headers
            };
            
            if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
                requestOptions.body = body;
                headers['Content-Type'] = 'application/json';
            }
            
            const response = await fetch(urlWithParams, requestOptions);
            const data = await response.json();
            
            responseOutput.textContent = JSON.stringify(data, null, 2);
            responseOutput.style.color = response.ok ? '#2ecc71' : '#e74c3c';
            
        } catch (error) {
            responseOutput.textContent = `خطا: ${error.message}`;
            responseOutput.style.color = '#e74c3c';
        }
    });
});
