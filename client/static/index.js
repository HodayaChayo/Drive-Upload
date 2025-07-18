'use strict';

const formNote = document.getElementById('note');

window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);

    // בדיקה אם יש פרמטר action
    const GDcode = urlParams.get('code');
    if (GDcode) {
        
        fetch('/manager/GDcode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ GDcode }),
        })
            .then(response => response.json())
            .then(data => {
                window.location.href = '/';
            })
            .catch(error => {
                console.error('❌ שגיאה בשליחת הפעולה:', error);
            });

    }

});



function showPreview() {
    const previewContainer = document.getElementById('preview');
    previewContainer.innerHTML = '';

    const files = document.getElementById('fileInput').files;
    if (files.length) {
        Array.from(files).forEach(file => {
            const fileName = file.name;
            const fileSize = (file.size / 1024).toFixed(2) + ' KB';

            const fileInfo = document.createElement('div');
            fileInfo.className = 'file-info';
            fileInfo.setAttribute('data-name', fileName);

            fileInfo.innerHTML = `
                <div class="name">${fileName}</div>
                <div class="size">${fileSize}</div>
                <div class="status">⏳</div>
            `;
            previewContainer.appendChild(fileInfo);
        });

        formNote.textContent = 'הקבצים מוכנים להעלאה ✅';
    }
}

function handleUpload(event) {
    event.preventDefault();

    const files = document.getElementById('fileInput').files;
    if (!files.length) {
        formNote.textContent = 'יש לבחור קבצים להעלאה ❗️';
        return;
    }

    formNote.innerHTML = `<img src="assets/loading.gif" alt="Loading..." />`;
    let successCount = 0;
    let finishedCount = 0;

    Array.from(files).forEach(file => {
        const formData = new FormData();
        formData.append('file', file);

        fetch('/upload', {
            method: 'POST',
            body: formData,
        })
            .then(res => res.json())
            .then(data => {
                finishedCount++;
                const fileInfo = document.querySelector(`.file-info[data-name="${CSS.escape(file.name)}"] .status`);
                if (data.success) {
                    successCount++;
                    fileInfo.textContent = '✅';
                } else {
                    fileInfo.textContent = '❌';
                    console.error('שגיאה בהעלאת קובץ:', file.name, data.error);
                }

                if (finishedCount === files.length) {
                    formNote.textContent = `${successCount} מתוך ${files.length} קבצים הועלו בהצלחה ✅`;
                }
            })
            .catch(error => {
                finishedCount++;
                const fileInfo = document.querySelector(`.file-info[data-name="${CSS.escape(file.name)}"] .status`);
                fileInfo.textContent = '❌';
                console.error('שגיאה בהעלאה:', file.name, error);

                if (finishedCount === files.length) {
                    formNote.textContent = `${successCount} מתוך ${files.length} קבצים הועלו בהצלחה ✅`;
                }
            });
    });
}

function reconnect() {
    fetch('/manager/reconnect')
        .then(response => response.json())
        .then(data => {
            if (data.url) {
                // נפתח את הקישור בחלון חדש
                window.location.href = data.url;
            } else {
                alert('לא התקבל קישור התחברות מהשרת');
            }
        })
        .catch(err => {
            console.error('שגיאה בעת קבלת קישור התחברות:', err);
            alert('שגיאה בעת קבלת קישור התחברות מהשרת');
        });
}
