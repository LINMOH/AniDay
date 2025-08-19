function initializeDate() {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    document.getElementById('dateInput').value = dateStr;
    showToday();
}

function showToday() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    loadCharacters(month, day, '今日');
}

function searchDate() {
    const dateInput = document.getElementById('dateInput').value;
    if (!dateInput) {
        showError('请选择日期');
        return;
    }

    const date = new Date(dateInput);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const dateStr = `${month}月${day}日`;
    loadCharacters(month, day, dateStr);
}

async function loadCharacters(month, day, dateLabel) {
    showLoading(true);
    hideError();

    document.getElementById('currentDate').textContent = `${dateLabel}的生日人物`;

    try {
        const response = await fetch(`data/${month}/${day}.json`);
        
        if (!response.ok) {
            if (response.status === 404) {
                displayCharacters([], dateLabel);
                return;
            }
            throw new Error(`加载失败 (${response.status})`);
        }

        const characters = await response.json();
        displayCharacters(characters, dateLabel);
    } catch (error) {
        console.error('加载人物数据失败:', error);
        if (error.message.includes('404') || error.message.includes('fetch')) {
            displayCharacters([], dateLabel);
        } else {
            showError(`加载失败: ${error.message}`);
        }
    } finally {
        showLoading(false);
    }
}

function displayCharacters(characters, dateLabel) {
    const container = document.getElementById('charactersContainer');
    
    if (!characters || characters.length === 0 || 
        (typeof characters === 'object' && Object.keys(characters).length === 0)) {
        container.innerHTML = `
            <div class="no-characters">
                今天没有人物过生日
            </div>
        `;
        return;
    }

    const charactersHTML = characters.map(character => {
        const imageElement = character.image_url && character.image_url.trim() !== "" ? 
            `<img src="${character.image_url}" alt="${character.name}" class="character-image" 
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
             <div class="placeholder-image" style="display: none;">
                ${character.name ? character.name.charAt(0) : '?'}
             </div>` :
            `<div class="placeholder-image">
                ${character.name ? character.name.charAt(0) : '?'}
             </div>`;

        return `
            <div class="character-card">
                ${imageElement}
                <div class="character-name">${character.name || '未知人物'}</div>
                <div class="character-anime">${character.anime || '未知作品'}</div>
            </div>
        `;
    }).join('');

    container.innerHTML = `<div class="characters-grid">${charactersHTML}</div>`;
}

function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
    if (show) {
        document.getElementById('charactersContainer').innerHTML = '';
    }
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideError() {
    document.getElementById('error').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    initializeDate();

    document.getElementById('dateInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchDate();
        }
    });

    document.getElementById('searchBtn').addEventListener('click', searchDate);
    document.getElementById('todayBtn').addEventListener('click', showToday);
});
