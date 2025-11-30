// Основные функции сайта
document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт загружен! Инициализация функций...');
    
    // Инициализация всех функций
    initFilters();
    initSearch();
    initGallery();
    initImageUpload();
    updateBreadcrumbs();
    highlightActiveNav();
    
    // Загрузка и обработка изображений
    initImageLoading();
    
    // Загрузка изображений из localStorage для галереи
    loadSavedImages();
    
    console.log('Все функции инициализированы успешно!');
});

// СИСТЕМА ФИЛЬТРАЦИИ - ИСПРАВЛЕННАЯ
function initFilters() {
    const filterSelects = document.querySelectorAll('.filter-select');
    console.log('Найдено фильтров:', filterSelects.length);
    
    // Добавляем кнопку сброса фильтров
    addResetButton();
    
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            console.log('Фильтр изменен:', this.id, 'значение:', this.value);
            filterContent();
        });
    });
    
    // Применяем фильтры при загрузке страницы
    setTimeout(filterContent, 100);
}

function addResetButton() {
    const filtersContainer = document.querySelector('.filters');
    if (!filtersContainer) return;
    
    const resetButton = document.createElement('button');
    resetButton.className = 'reset-filters';
    resetButton.textContent = 'Сбросить фильтры';
    resetButton.onclick = resetFilters;
    
    filtersContainer.appendChild(resetButton);
}

function resetFilters() {
    console.log('Сброс фильтров');
    
    // Сбрасываем все select к значению "all"
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.value = 'all';
    });
    
    // Сбрасываем поле поиска
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Показываем все карточки
    filterContent();
}

function filterContent() {
    const regionFilter = document.getElementById('region-filter')?.value;
    const materialFilter = document.getElementById('material-filter')?.value;
    const climateFilter = document.getElementById('climate-filter')?.value;
    const searchInput = document.getElementById('search-input')?.value.toLowerCase().trim();
    
    console.log('Текущие фильтры:', {
        region: regionFilter,
        material: materialFilter,
        climate: climateFilter,
        search: searchInput
    });
    
    const cards = document.querySelectorAll('.card');
    let visibleCount = 0;
    
    cards.forEach(card => {
        let showCard = true;
        
        // Проверяем фильтр региона
        if (regionFilter && regionFilter !== 'all') {
            const cardRegion = card.getAttribute('data-region');
            console.log('Проверка региона:', cardRegion, 'фильтр:', regionFilter);
            if (cardRegion !== regionFilter) {
                showCard = false;
            }
        }
        
        // Проверяем фильтр материала
        if (showCard && materialFilter && materialFilter !== 'all') {
            const cardMaterial = card.getAttribute('data-material');
            console.log('Проверка материала:', cardMaterial, 'фильтр:', materialFilter);
            if (cardMaterial !== materialFilter) {
                showCard = false;
            }
        }
        
        // Проверяем фильтр климата
        if (showCard && climateFilter && climateFilter !== 'all') {
            const cardClimate = card.getAttribute('data-climate');
            console.log('Проверка климата:', cardClimate, 'фильтр:', climateFilter);
            if (cardClimate !== climateFilter) {
                showCard = false;
            }
        }
        
        // Проверяем поисковый запрос
        if (showCard && searchInput && searchInput.length >= 2) {
            const cardText = card.textContent.toLowerCase();
            if (!cardText.includes(searchInput)) {
                showCard = false;
            }
        }
        
        // Показываем или скрываем карточку
        if (showCard) {
            card.style.display = 'block';
            card.classList.remove('hidden');
            visibleCount++;
            console.log('Показана карточка:', card.querySelector('h3').textContent);
        } else {
            card.style.display = 'none';
            card.classList.add('hidden');
        }
    });
    
    console.log('Показано карточек:', visibleCount, 'из', cards.length);
    showNoResultsMessage(visibleCount === 0);
}

function showNoResultsMessage(show) {
    let noResults = document.getElementById('no-results');
    const cardsGrid = document.querySelector('.cards-grid');
    
    if (!noResults && cardsGrid) {
        noResults = document.createElement('div');
        noResults.id = 'no-results';
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <p>😔 По вашему запросу ничего не найдено</p>
            <p>Попробуйте изменить параметры фильтров или поисковый запрос</p>
            <button onclick="resetFilters()" class="btn" style="margin-top: 1rem;">Сбросить все фильтры</button>
        `;
        cardsGrid.appendChild(noResults);
    }
    
    if (noResults) {
        noResults.classList.toggle('show', show);
    }
}

// СИСТЕМА ПОИСКА - ИСПРАВЛЕННАЯ
function initSearch() {
    const searchInput = document.getElementById('search-input');
    
    if (searchInput) {
        console.log('Поиск инициализирован');
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            console.log('Поисковый запрос:', searchTerm);
            
            // Обновляем фильтрацию при изменении поиска
            filterContent();
        });
    }
}

// СИСТЕМА ЗАГРУЗКИ ИЗОБРАЖЕНИЙ
function initImageLoading() {
    const cards = document.querySelectorAll('.card[data-image]');
    console.log('Найдено карточек для загрузки изображений:', cards.length);
    
    cards.forEach(card => {
        const imageType = card.getAttribute('data-image');
        const cardImage = card.querySelector('.card-image');
        
        // Добавляем индикатор загрузки
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.textContent = 'Загрузка...';
        cardImage.appendChild(loadingIndicator);
        
        // Пробуем загрузить локальное изображение
        loadLocalImage(cardImage, imageType, loadingIndicator);
    });
}

function loadLocalImage(cardImage, imageType, loadingIndicator) {
    const localImage = new Image();
    
    localImage.onload = function() {
        console.log('Локальное изображение загружено:', imageType);
        cardImage.classList.add('image-loaded');
        loadingIndicator.textContent = '✓ Локальное';
        loadingIndicator.style.background = 'rgba(46, 204, 113, 0.8)';
        
        setTimeout(() => {
            loadingIndicator.style.display = 'none';
        }, 2000);
    };
    
    localImage.onerror = function() {
        console.log('Локальное изображение не найдено, пробуем интернет:', imageType);
        loadingIndicator.textContent = 'Загрузка из интернета...';
        loadFallbackImage(cardImage, imageType, loadingIndicator);
    };
    
    localImage.src = `images/${imageType}.jpg`;
}

function loadFallbackImage(cardImage, imageType, loadingIndicator) {
    const fallbackUrls = getFallbackImageUrls(imageType);
    let currentUrlIndex = 0;
    
    function tryNextUrl() {
        if (currentUrlIndex >= fallbackUrls.length) {
            console.log('Все источники недоступны, используем градиент:', imageType);
            loadingIndicator.textContent = '⚠ Используем градиент';
            loadingIndicator.style.background = 'rgba(231, 76, 60, 0.8)';
            applyGradientFallback(cardImage, imageType);
            return;
        }
        
        const fallbackImage = new Image();
        const currentUrl = fallbackUrls[currentUrlIndex];
        
        fallbackImage.onload = function() {
            console.log('Интернет-изображение загружено:', imageType, 'из:', currentUrl);
            cardImage.style.backgroundImage = `url('${currentUrl}')`;
            cardImage.classList.add('image-loaded');
            loadingIndicator.textContent = '✓ Из интернета';
            loadingIndicator.style.background = 'rgba(52, 152, 219, 0.8)';
            
            setTimeout(() => {
                loadingIndicator.style.display = 'none';
            }, 2000);
        };
        
        fallbackImage.onerror = function() {
            console.log('Не удалось загрузить из:', currentUrl);
            currentUrlIndex++;
            tryNextUrl();
        };
        
        fallbackImage.src = currentUrl;
    }
    
    tryNextUrl();
}

function getFallbackImageUrls(imageType) {
    const urlMap = {
        'izba': [
            'https://images.unsplash.com/photo-1580041065738-e72023775cdc?w=400&h=300&fit=crop',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Museum_of_Wooden_Architecture_Malye_Korely._Northern_part_14.jpg/400px-Museum_of_Wooden_Architecture_Malye_Korely._Northern_part_14.jpg'
        ],
        'chum': [
            'https://images.unsplash.com/photo-1571003128894-5a3c3c5acf1a?w=400&h=300&fit=crop',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Chum_IMG_4352_1725.jpg/400px-Chum_IMG_4352_1725.jpg'
        ],
        'yaranga': [
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Chukchi_family_in_front_of_their_home_%28yaranga%29.jpg/400px-Chukchi_family_in_front_of_their_home_%28yaranga%29.jpg'
        ],
        'iglu': [
            'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Igloo.jpg/400px-Igloo.jpg'
        ],
        'yurta': [
            'https://images.unsplash.com/photo-1559526324-593bc073d938?w=400&h=300&fit=crop',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Yurt_in_Khovd_province.jpg/400px-Yurt_in_Khovd_province.jpg'
        ],
        'minka': [
            'https://images.unsplash.com/photo-1542051841857-3cf2162b6cce?w=400&h=300&fit=crop',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Japanese_house_-_Minka_in_Fukushima_02.jpg/400px-Japanese_house_-_Minka_in_Fukushima_02.jpg'
        ],
        'hanok': [
            'https://images.unsplash.com/photo-1540202403-a2c2908e9c5e?w=400&h=300&fit=crop',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Korean_house-Hanok-01.jpg/400px-Korean_house-Hanok-01.jpg'
        ],
        'vigvam': [
            'https://images.unsplash.com/photo-1543857778-c4a1a569eafe?w=400&h=300&fit=crop',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Ojibwe_wiigiwaam.png/400px-Ojibwe_wiigiwaam.png'
        ],
        'balok': [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Nenets_balok.jpg/400px-Nenets_balok.jpg'
        ],
        'yaodun': [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Yaodong_1.jpg/400px-Yaodong_1.jpg'
        ]
    };
    
    return urlMap[imageType] || [];
}

function applyGradientFallback(cardImage, imageType) {
    const gradientMap = {
        'izba': 'linear-gradient(135deg, #8e44ad, #9b59b6)',
        'chum': 'linear-gradient(135deg, #27ae60, #2ecc71)',
        'yaranga': 'linear-gradient(135deg, #f39c12, #f1c40f)',
        'iglu': 'linear-gradient(135deg, #3498db, #2980b9)',
        'yurta': 'linear-gradient(135deg, #e74c3c, #c0392b)',
        'minka': 'linear-gradient(135deg, #1abc9c, #16a085)',
        'hanok': 'linear-gradient(135deg, #d35400, #e67e22)',
        'vigvam': 'linear-gradient(135deg, #7f8c8d, #95a5a6)',
        'balok': 'linear-gradient(135deg, #9b59b6, #8e44ad)',
        'yaodun': 'linear-gradient(135deg, #34495e, #2c3e50)'
    };
    
    cardImage.style.background = gradientMap[imageType] || 'linear-gradient(135deg, #ecf0f1, #bdc3c7)';
    cardImage.classList.add('image-loaded');
    
    const icon = document.createElement('div');
    icon.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 4rem;
        opacity: 0.8;
        z-index: 1;
    `;
    icon.textContent = getHouseIcon(imageType);
    cardImage.appendChild(icon);
}

function getHouseIcon(imageType) {
    const iconMap = {
        'izba': '🏠',
        'chum': '⛺',
        'yaranga': '🎪',
        'iglu': '❄️',
        'yurta': '⭕',
        'minka': '🎋',
        'hanok': '🏯',
        'vigvam': '🌲',
        'balok': '🛷',
        'yaodun': '⛰️'
    };
    return iconMap[imageType] || '🏠';
}

// ОСТАЛЬНЫЕ ФУНКЦИИ (галерея, загрузка изображений и т.д.)
function initGallery() {
    console.log('Инициализация галереи...');
    
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn')) return;
            
            const cardTitle = this.querySelector('h3').textContent;
            const cardContent = this.querySelector('.card-content').textContent;
            showCardInfoModal(cardTitle, cardContent);
        });
    });
}

function showCardInfoModal(title, content) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 10px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
    `;
    
    modalContent.innerHTML = `
        <button onclick="this.closest('.modal-container').remove()" 
                style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
        <h2 style="color: #2c3e50; margin-bottom: 1rem;">${title}</h2>
        <div style="line-height: 1.6;">${content}</div>
        <button onclick="this.closest('.modal-container').remove()" 
                style="margin-top: 1rem; padding: 0.5rem 1rem; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Закрыть
        </button>
    `;
    
    modal.classList.add('modal-container');
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function initImageUpload() {
    const uploadInput = document.getElementById('imageUpload');
    const uploadArea = document.querySelector('.upload-area');
    
    if (!uploadInput) return;
    
    uploadArea.addEventListener('click', function() {
        uploadInput.click();
    });
    
    uploadInput.addEventListener('change', function(e) {
        if (this.files.length > 0) {
            handleImageUpload(this.files[0]);
        }
    });
    
    function handleImageUpload(file) {
        if (!file.type.match('image.*')) {
            alert('Пожалуйста, выберите файл изображения (JPG, PNG, GIF)');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            saveImageToGallery(file.name, e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

function saveImageToGallery(filename, imageData) {
    const gallery = JSON.parse(localStorage.getItem('imageGallery') || '[]');
    
    const newImage = {
        id: Date.now(),
        filename: filename,
        data: imageData,
        date: new Date().toLocaleDateString('ru-RU'),
        title: filename.replace(/\.[^/.]+$/, "")
    };
    
    gallery.push(newImage);
    localStorage.setItem('imageGallery', JSON.stringify(gallery));
    updateGalleryDisplay();
    alert('Изображение успешно добавлено в галерею!');
}

function loadSavedImages() {
    updateGalleryDisplay();
}

function updateGalleryDisplay() {
    const galleryContainer = document.getElementById('galleryContainer');
    if (!galleryContainer) return;
    
    const gallery = JSON.parse(localStorage.getItem('imageGallery') || '[]');
    
    if (gallery.length === 0) {
        galleryContainer.innerHTML = `
            <div class="no-results">
                <p>В галерее пока нет изображений.</p>
                <p>Добавьте первые фотографии через форму загрузки выше!</p>
            </div>
        `;
        return;
    }
    
    let galleryHTML = '';
    gallery.forEach(image => {
        galleryHTML += `
            <div class="gallery-item">
                <img src="${image.data}" alt="${image.title}" class="gallery-image">
                <div class="gallery-caption">
                    <h4>${image.title}</h4>
                    <small>Добавлено: ${image.date}</small>
                    <button onclick="deleteImage(${image.id})" class="btn btn-small" style="background: #e74c3c; margin-top: 0.5rem;">Удалить</button>
                </div>
            </div>
        `;
    });
    
    galleryContainer.innerHTML = galleryHTML;
}

function deleteImage(imageId) {
    if (!confirm('Удалить это изображение?')) return;
    
    const gallery = JSON.parse(localStorage.getItem('imageGallery') || '[]');
    const updatedGallery = gallery.filter(img => img.id !== imageId);
    localStorage.setItem('imageGallery', JSON.stringify(updatedGallery));
    updateGalleryDisplay();
}

function updateBreadcrumbs() {
    const breadcrumbsContainer = document.querySelector('.breadcrumbs .container');
    if (!breadcrumbsContainer) return;
    
    const path = window.location.pathname;
    const pageName = path.split('/').pop().replace('.html', '');
    const pageTitles = {
        'index': 'Главная',
        'dwellings': 'Традиционные жилища',
        'north': 'Жилища народов Севера',
        'asia': 'Жилища Азии',
        'climate': 'Климат и архитектура',
        'materials': 'Конструкции и материалы',
        'gallery': 'Галерея',
        'dictionary': 'Словарь терминов',
        'about': 'О проекте'
    };
    
    let breadcrumbHTML = '<a href="index.html">Главная</a>';
    
    if (pageName !== 'index') {
        breadcrumbHTML += ` › <span>${pageTitles[pageName] || pageName}</span>`;
    }
    
    breadcrumbsContainer.innerHTML = breadcrumbHTML;
}

function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === 'index.html' && linkHref === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Отладочная информация
console.log('✅ ФИЛЬТРЫ ИНИЦИАЛИЗИРОВАНЫ');
console.log('Система будет работать корректно!');