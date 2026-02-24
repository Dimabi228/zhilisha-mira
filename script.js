// ========== ОСНОВНЫЕ ФУНКЦИИ ==========

// 1. Инициализация хлебных крошек
function initializeBreadcrumbs() {
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
    
    let breadcrumbsHTML = '<a href="index.html">🏠 Главная</a>';
    
    if (pageName !== 'index') {
        breadcrumbsHTML += ` <span class="separator">›</span> `;
        breadcrumbsHTML += `<span>${pageTitles[pageName] || pageName}</span>`;
    }
    
    breadcrumbsContainer.innerHTML = breadcrumbsHTML;
}

// 2. Предзагрузка изображений для карточек
// 2. Предзагрузка изображений для карточек
function preloadCardImages() {
    console.log('🔍 Начинаем загрузку изображений для карточек...');
    
    const imageUrls = [
        {url: 'images/izba.jpg', names: ['izba']},      // Русская изба
        {url: 'images/chum.jpg', names: ['chum']},      // Чум
        {url: 'images/yaranga.jpg', names: ['yaranga']}, // Яранга
        {url: 'images/iglu.jpg', names: ['iglu']},      // Иглу
        {url: 'images/yurta.jpg', names: ['yurta']},    // Юрта
        {url: 'images/minka.jpg', names: ['minka']},    // Минка
        {url: 'images/hanok.jpg', names: ['hanok']},    // Ханок
        {url: 'images/vigvam.jpg', names: ['vigvam']},  // Вигвам
        {url: 'images/balok.jpg', names: ['balok']},    // Балок
        {url: 'images/yaodun.jpg', names: ['yaodun']}   // Яодун
    ];
    
    let loaded = 0;
    const total = imageUrls.length;
    
    imageUrls.forEach(item => {
        const img = new Image();
        img.onload = () => {
            loaded++;
            console.log(`✅ Загружено: ${loaded}/${total} - ${item.url}`);
            
            // Ищем карточки по всем возможным именам
            item.names.forEach(imageName => {
                // Несколько вариантов поиска для надежности
                const selectors = [
                    `[data-image="${imageName}"] .card-image`,
                    `[data-image*="${imageName}"] .card-image`,
                    `.card .card-image[data-image*="${imageName}"]`
                ];
                
                selectors.forEach(selector => {
                    const cards = document.querySelectorAll(selector);
                    if (cards.length > 0) {
                        console.log(`🔍 Найдено карточек с селектором "${selector}": ${cards.length}`);
                        cards.forEach(card => {
                            card.classList.add('loaded');
                            card.style.backgroundImage = `url('${item.url}')`;
                        });
                    }
                });
            });
            
            if (loaded === total) {
                console.log('🎉 Все изображения карточек загружены!');
                showSuccessMessage('Все изображения загружены!');
            }
        };
        img.onerror = () => {
            console.warn(`❌ Ошибка загрузки: ${item.url}`);
            loaded++;
            if (loaded === total) {
                console.log('🎉 Все изображения обработаны!');
            }
        };
        img.src = item.url;
    });
}

// 3. Инициализация поиска (ИСПРАВЛЕННАЯ)
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const cards = document.querySelectorAll('.card');
    const termItems = document.querySelectorAll('.term-item');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        // Поиск по карточкам
        if (cards.length > 0) {
            performCardsSearch(searchTerm, cards);
        }
        
        // Поиск по словарю
        if (termItems.length > 0) {
            performTermsSearch(searchTerm, termItems);
        }
    });
}

function performCardsSearch(searchTerm, cards) {
    let visibleCount = 0;
    const cardsGrid = document.querySelector('.cards-grid');
    
    cards.forEach(card => {
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const content = card.textContent.toLowerCase();
        const isVisible = searchTerm === '' || 
                         title.includes(searchTerm) || 
                         content.includes(searchTerm);
        
        if (isVisible) {
            card.style.display = 'block';
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.style.display = 'none';
            card.classList.add('hidden');
        }
    });
    
    const existingNoResults = document.querySelector('.no-results');
    if (visibleCount === 0 && searchTerm.length > 0) {
        if (!existingNoResults) {
            const noResults = createNoResultsMessage();
            if (cardsGrid) {
                cardsGrid.appendChild(noResults);
            }
        } else {
            existingNoResults.classList.add('show');
        }
    } else if (existingNoResults) {
        existingNoResults.classList.remove('show');
    }
}

function performTermsSearch(searchTerm, termItems) {
    termItems.forEach(item => {
        const term = item.querySelector('h3')?.textContent.toLowerCase() || '';
        const definition = item.textContent.toLowerCase();
        const isVisible = searchTerm === '' || 
                         term.includes(searchTerm) || 
                         definition.includes(searchTerm);
        
        item.style.display = isVisible ? 'block' : 'none';
    });
}

function createNoResultsMessage() {
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 1rem;">🔍</div>
        <p style="font-size: 1.3rem; font-weight: 600; color: var(--primary-color);">
            По запросу ничего не найдено
        </p>
        <p style="margin-bottom: 1.5rem;">Попробуйте изменить поисковый запрос или сбросить фильтры</p>
        <button class="btn reset-search">Сбросить поиск</button>
    `;
    
    noResults.querySelector('.reset-search').addEventListener('click', () => {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
        }
    });
    
    return noResults;
}

// 4. Инициализация фильтров
function initializeFilters() {
    const materialFilter = document.getElementById('material-filter');
    const regionFilter = document.getElementById('region-filter');
    const climateFilter = document.getElementById('climate-filter');
    const cards = document.querySelectorAll('.card');
    
    if (!materialFilter && !regionFilter && !climateFilter) return;
    
    const filters = {
        material: materialFilter,
        region: regionFilter,
        climate: climateFilter
    };
    
    function handleFilterChange() {
        const selectedMaterial = filters.material?.value || 'all';
        const selectedRegion = filters.region?.value || 'all';
        const selectedClimate = filters.climate?.value || 'all';
        
        let visibleCount = 0;
        
        cards.forEach(card => {
            const cardMaterial = card.getAttribute('data-material');
            const cardRegion = card.getAttribute('data-region');
            const cardClimate = card.getAttribute('data-climate');
            
            const matchesMaterial = selectedMaterial === 'all' || cardMaterial === selectedMaterial;
            const matchesRegion = selectedRegion === 'all' || cardRegion === selectedRegion;
            const matchesClimate = selectedClimate === 'all' || cardClimate === selectedClimate;
            
            const isVisible = matchesMaterial && matchesRegion && matchesClimate;
            
            if (isVisible) {
                card.style.display = 'block';
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.style.display = 'none';
                card.classList.add('hidden');
            }
        });
        
        const existingNoResults = document.querySelector('.no-results');
        const cardsGrid = document.querySelector('.cards-grid');
        
        if (visibleCount === 0 && (selectedMaterial !== 'all' || selectedRegion !== 'all' || selectedClimate !== 'all')) {
            if (!existingNoResults) {
                const noResults = createNoResultsMessage();
                if (cardsGrid) {
                    cardsGrid.appendChild(noResults);
                }
            } else {
                existingNoResults.classList.add('show');
            }
        } else if (existingNoResults) {
            existingNoResults.classList.remove('show');
        }
    }
    
    if (materialFilter) materialFilter.addEventListener('change', handleFilterChange);
    if (regionFilter) regionFilter.addEventListener('change', handleFilterChange);
    if (climateFilter) climateFilter.addEventListener('change', handleFilterChange);
    
    const resetButton = document.querySelector('.reset-filters');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            if (materialFilter) materialFilter.value = 'all';
            if (regionFilter) regionFilter.value = 'all';
            if (climateFilter) climateFilter.value = 'all';
            handleFilterChange();
        });
    }
}

// 5. Инициализация галереи
function initializeGallery() {
    const uploadArea = document.querySelector('.upload-area');
    const uploadBtn = document.querySelector('.upload-btn');
    const imageUpload = document.getElementById('imageUpload');
    const preview = document.getElementById('uploadPreview');
    const previewImage = document.getElementById('previewImage');
    const galleryContainer = document.getElementById('galleryContainer');
    
    // Инициализируем галерею с начальными изображениями
    if (galleryContainer) {
        initDefaultGallery(galleryContainer);
    }
    
    if (!uploadArea || !uploadBtn) return;
    
    uploadBtn.addEventListener('click', () => {
        imageUpload.click();
    });
    
    uploadArea.addEventListener('click', () => {
        imageUpload.click();
    });
    
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.match('image.*')) {
            showErrorMessage('Пожалуйста, выберите файл изображения (JPG, PNG, GIF)');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            showErrorMessage('Размер файла не должен превышать 5MB');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            preview.style.display = 'block';
            
            addToGallery(e.target.result, file.name, galleryContainer);
        };
        reader.readAsDataURL(file);
    });
    
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        this.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.match('image.*')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                preview.style.display = 'block';
                addToGallery(e.target.result, file.name, galleryContainer);
            };
            reader.readAsDataURL(file);
        }
    });
}

// Инициализация начальной галереи
function initDefaultGallery(container) {
    // Убираем сообщение "нет изображений"
    const noResults = container.querySelector('.no-results');
    if (noResults) {
        noResults.style.display = 'none';
    }
    
    // Добавляем демо изображения из локальной папки
    const demoImages = [
        {
            name: 'Русская изба',
            url: 'images/izba.jpg',
            description: 'Традиционное деревянное жилище'
        },
        {
            name: 'Монгольская юрта',
            url: 'images/yurta.jpg',
            description: 'Переносное жилище кочевников'
        },
        {
            name: 'Эскимосское иглу',
            url: 'images/iglu.jpg',
            description: 'Снежный дом из ледяных блоков'
        },
        {
            name: 'Японская минка',
            url: 'images/minka.jpg',
            description: 'Традиционный японский дом'
        },
        {
            name: 'Чукотская яранга',
            url: 'images/yaranga.jpg',
            description: 'Жилище народов Чукотки'
        },
        {
            name: 'Индейский вигвам',
            url: 'images/vigvam.jpg',
            description: 'Жилище лесных индейцев'
        }
    ];
    
    demoImages.forEach((img, index) => {
        setTimeout(() => {
            const galleryItem = createGalleryItem(img);
            container.appendChild(galleryItem);
            galleryItem.style.animation = 'fadeIn 0.5s ease';
        }, index * 100);
    });
}

function createGalleryItem(img) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.innerHTML = `
        <div class="gallery-image" style="background-image: url('${img.url}')"></div>
        <div class="gallery-caption">
            <h4>${img.name}</h4>
            <p>${img.description}</p>
            <small>Традиционное жилище</small>
        </div>
    `;
    return galleryItem;
}

function addToGallery(imageSrc, fileName, container) {
    const galleryItem = createGalleryItem({
        name: fileName.split('.')[0],
        url: imageSrc,
        description: 'Загруженное пользователем изображение'
    });
    
    container.insertBefore(galleryItem, container.firstChild);
    showSuccessMessage('Изображение успешно добавлено в галерею!');
}

// 6. Детальная информация о жилищах
const dwellingDetails = {
    'Русская изба': `
        <div class="dwelling-detail">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 2rem 0;">
                <div>
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Особенности</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li>✓ Срубная конструкция</li>
                        <li>✓ Русская печь</li>
                        <li>✓ Волоковые окна</li>
                        <li>✓ Лавки вдоль стен</li>
                        <li>✓ Полки на стенах</li>
                    </ul>
                </div>
                <div>
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Конструкция</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li>• Материал: дерево (сосна, ель)</li>
                        <li>• Крыша: солома или дранка</li>
                        <li>• Окна: 6-8 вершков</li>
                        <li>• Отопление: печное</li>
                    </ul>
                </div>
            </div>
            <div style="background: rgba(102, 126, 234, 0.1); padding: 1.5rem; border-radius: 15px; margin: 2rem 0;">
                <p><strong>Описание:</strong> Изба — клеть с печью. У бедных людей избы были чёрными и позёмными, то есть установленные прямо на земле. Четверть площади избы занимала русская печь, вдоль стен располагались лавки. На стенах помещались полки. Очень поздно (XIX век) в интерьер избы вошли стулья и шкафы.</p>
                <p style="margin-top: 1rem;">Окна у чёрной избы от 6 до 8 вершков длины, 4 вершка ширины — предназначены для выпуска дыма. Располагались почти под потолком, рам не имели. Такие окна назывались волоковыми — их заволакивали доской или специальной крышкой.</p>
            </div>
        </div>
    `,
    'Чум': `
        <div class="dwelling-detail">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 2rem 0;">
                <div>
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Особенности</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li>✓ Коническая форма</li>
                        <li>✓ Быстрая сборка/разборка</li>
                        <li>✓ Отличная защита от ветра</li>
                        <li>✓ Мобильность</li>
                        <li>✓ Сезонные покрытия</li>
                    </ul>
                </div>
                <div>
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Народы</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li>• Ненцы</li>
                        <li>• Ханты</li>
                        <li>• Манси</li>
                        <li>• Эвенки</li>
                        <li>• Саамы</li>
                    </ul>
                </div>
            </div>
            <div style="background: rgba(102, 126, 234, 0.1); padding: 1.5rem; border-radius: 15px; margin: 2rem 0;">
                <p><strong>Описание:</strong> Чум относится к простейшим формам искусственно создаваемого жилья, к которым человек обратился на очень ранних этапах истории. Прообразом чума могли служить, например, прислонённые наклонно к дереву ветви.</p>
                <p style="margin-top: 1rem;">В Европейской России чум утратил своё былое назначение и превратился в служебную хозяйскую постройку: у марийцев, удмуртов, чувашей, татар его жердяной остов служит овином; покрытый соломой, он прикрывает ход в погреб.</p>
            </div>
        </div>
    `,
    'Яранга': `
        <div class="dwelling-detail">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 2rem 0;">
                <div>
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Особенности</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li>✓ Цилиндрическая форма</li>
                        <li>✓ Коническая крыша</li>
                        <li>✓ Разделение на зоны</li>
                        <li>✓ Тёплый полог (иоронга)</li>
                        <li>✓ Жирниковое освещение</li>
                    </ul>
                </div>
                <div>
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Народы</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li>• Чукчи</li>
                        <li>• Коряки</li>
                        <li>• Эвены</li>
                        <li>• Юкагиры</li>
                    </ul>
                </div>
            </div>
            <div style="background: rgba(102, 126, 234, 0.1); padding: 1.5rem; border-radius: 15px; margin: 2rem 0;">
                <p><strong>Описание:</strong> Каркас яранги собирают из лёгких деревянных шестов в форме слегка наклонённой внутрь стенки и конуса или купола над ней. Сверху каркас покрывают оленьими или моржовыми шкурами, летом — брезентом. В среднем на ярангу обычного размера требуется потратить около 50 шкур.</p>
                <p style="margin-top: 1rem;">Внутри яранга делится на жилое отапливаемое помещение — иоронгу и холодную переднюю часть — чоттагин. Костёр разжигают в передней части. Так как дымового отверстия нет, то дым от очага выходит через дверь.</p>
            </div>
        </div>
    `,
    'Иглу': `
        <div class="dwelling-detail">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 2rem 0;">
                <div>
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Особенности</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li>✓ Куполообразная форма</li>
                        <li>✓ Отличная теплоизоляция</li>
                        <li>✓ Строится из снежных блоков</li>
                        <li>✓ Естественная вентиляция</li>
                        <li>✓ Подземный вход</li>
                    </ul>
                </div>
                <div>
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Характеристики</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li>• Диаметр: 2-4 метра</li>
                        <li>• Высота: до 3.5 метров</li>
                        <li>• Время постройки: 45 минут</li>
                        <li>• Температура внутри: -7 до 16°C</li>
                    </ul>
                </div>
            </div>
            <div style="background: rgba(102, 126, 234, 0.1); padding: 1.5rem; border-radius: 15px; margin: 2rem 0;">
                <p><strong>Описание:</strong> Считается, что канадские эскимосы использовали иглу, по крайней мере, со второй половины I тысячелетия до н. э. Этот вывод основывается на обнаружении большого количества специальных снеговых ножей в местах их обитания.</p>
                <p style="margin-top: 1rem;">Снежная хижина представляет собой куполообразную постройку диаметром 2—4 метра из уплотнённых ветром снежных или ледяных блоков. При глубоком снеге вход обычно устраивается в полу, ко входу прорывается коридор (тоннель).</p>
            </div>
        </div>
    `,
    'Юрта': `
        <div class="dwelling-detail">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 2rem 0;">
                <div>
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Особенности</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li>✓ Круглая форма</li>
                        <li>✓ Быстрая сборка (1 час)</li>
                        <li>✓ Войлочное покрытие</li>
                        <li>✓ Регулируемая вентиляция</li>
                        <li>✓ Дымоходное отверстие</li>
                    </ul>
                </div>
                <div>
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Народы</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li>• Монголы</li>
                        <li>• Казахи</li>
                        <li>• Киргизы</li>
                        <li>• Тувинцы</li>
                    </ul>
                </div>
            </div>
            <div style="background: rgba(102, 126, 234, 0.1); padding: 1.5rem; border-radius: 15px; margin: 2rem 0;">
                <p><strong>Описание:</strong> Юрта — это круглое каркасное жилище, покрытое войлоком или кожей, которое легко собирается и разбирается, что идеально подходит для кочевого образа жизни. Возможно, прообразом юрты в эпоху поздней бронзы XII—IX веках до нашей эры являлись жилища андроновцев.</p>
                <p style="margin-top: 1rem;">Юрта полностью удовлетворяет потребностям кочевника в силу своего удобства и практичности. Она быстро собирается и легко разбирается силами одной семьи в течение одного часа. Её войлочное покрытие не пропускает дождь, ветер и холод.</p>
            </div>
        </div>
    `,
    'Минка': `
        <div class="dwelling-detail">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 2rem 0;">
                <div>
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Особенности</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li>✓ Раздвижные стены (сёдзи)</li>
                        <li>✓ Приподнятый пол</li>
                        <li>✓ Естественная вентиляция</li>
                        <li>✓ Соломенная крыша</li>
                        <li>✓ Деревянный каркас</li>
                    </ul>
                </div>
                <div>
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Типы минка</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li>• Нока (крестьянский)</li>
                        <li>• Матия (городской)</li>
                        <li>• Гёка (рыбацкий)</li>
                        <li>• Санка (горный)</li>
                    </ul>
                </div>
            </div>
            <div style="background: rgba(102, 126, 234, 0.1); padding: 1.5rem; border-radius: 15px; margin: 2rem 0;">
                <p><strong>Описание:</strong> Существует большое разнообразие минка, так как они возводились местными жителями в соответствии с региональными традициями и под влиянием местного образа жизни.</p>
                <p style="margin-top: 1rem;">Важной отличительной чертой минка является крыша, которая может быть разных типов. Крыша бывает щипцовой — киридзума-дзукури, полувальмовой — иримоя-дзукури или вальмовой — ёсэмунэ-дзукури. У крыш гассё-дзукури, типичных для горных районов префектур Гифу и Тояма, основным несущим элементом являются мощные стропила.</p>
            </div>
        </div>
    `,
    'Ханок': `
        <div class="dwelling-detail">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 2rem 0;">
                <div>
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Особенности</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li>✓ Система ондоль (подпольный обогрев)</li>
                        <li>✓ Изогнутая черепичная крыша</li>
                        <li>✓ Бумажные окна (ханчжи)</li>
                        <li>✓ Деревянные колонны</li>
                        <li>✓ Ориентация на юг</li>
                    </ul>
                </div>
                <div>
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Принципы</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li>• Баесаннимсу (背山臨水)</li>
                        <li>• Гармония с природой</li>
                        <li>• Фэн-шуй расположение</li>
                        <li>• Естественные материалы</li>
                    </ul>
                </div>
            </div>
            <div style="background: rgba(102, 126, 234, 0.1); padding: 1.5rem; border-radius: 15px; margin: 2rem 0;">
                <p><strong>Описание:</strong> Впервые спроектирован и построен в 14 веке во времена династии Чосон. Корейская архитектура учитывает расположение дома по отношению к его окружению, уделяя особое внимание земле и временам года, то есть жизнь в гармонии с природой.</p>
                <p style="margin-top: 1rem;">Идеальный дом по принципу baesanimsu (背山臨水, буквально «позади горы и перед водой») должен стоять лицом к югу, чтобы солнечный свет мог проникать внутрь дома, напротив холма и рекой спереди. Для отопления дома использовалась традиционная система отопления — ондоль.</p>
            </div>
        </div>
    `,
    'Вигвам': `
        <div class="dwelling-detail">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 2rem 0;">
                <div>
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Особенности</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li>✓ Куполообразная форма</li>
                        <li>✓ Каркас из жердей</li>
                        <li>✓ Покрытие из коры</li>
                        <li>✓ Дымовое отверстие</li>
                        <li>✓ Лесное расположение</li>
                    </ul>
                </div>
                <div>
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Характеристики</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li>• Высота: 2.5-3 метра</li>
                        <li>• Вместимость: 10-12 человек</li>
                        <li>• Племена: лесные индейцы</li>
                        <li>• Регион: Северная Америка</li>
                    </ul>
                </div>
            </div>
            <div style="background: rgba(102, 126, 234, 0.1); padding: 1.5rem; border-radius: 15px; margin: 2rem 0;">
                <p><strong>Описание:</strong> Вигвам — переносное и стационарное жилище преимущественно лесных индейцев севера и северо-востока Северной Америки, а также восточной части Великих равнин. Похожие жилища применялись и в других регионах.</p>
                <p style="margin-top: 1rem;">Наиболее известный вид вигвама — это небольшой шалаш высотой 2,5—3 метра, куполообразной или конусной (типиподобной) формы. В прошлом в вигвамах могло проживать от 3—8 до 10—12 человек. В настоящее время вигвамы чаще используются как традиционные обрядовые помещения или коптильни для кожи.</p>
            </div>
        </div>
    `,
    'Балок': `
        <div class="dwelling-detail">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 2rem 0;">
                <div>
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Особенности</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li>✓ Передвижное жилище на полозьях</li>
                        <li>✓ Используется оленеводами</li>
                        <li>✓ Деревянный каркас</li>
                        <li>✓ Войлочное покрытие</li>
                        <li>✓ Вместительное внутреннее пространство</li>
                    </ul>
                </div>
                <div>
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Регион</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li>• Северная Сибирь</li>
                        <li>• Дальний Восток</li>
                        <li>• Народы Севера</li>
                    </ul>
                </div>
            </div>
            <div style="background: rgba(102, 126, 234, 0.1); padding: 1.5rem; border-radius: 15px; margin: 2rem 0;">
                <p><strong>Описание:</strong> Балок — традиционное передвижное жилище народов Сибири, которое используется оленеводами во время сезонных перекочёвок. Это деревянная конструкция на полозьях, покрытая войлоком или шкурами.</p>
                <p style="margin-top: 1rem;">Балок позволяет кочевым народам перевозить своё жилище вместе с оленьими стадами. Внутри обычно есть отопительная печь и достаточно места для проживания всей семьи. Это удобное решение для жизни в условиях вечной мерзлоты.</p>
            </div>
        </div>
    `,
    'Яодун': `
        <div class="dwelling-detail">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 2rem 0;">
                <div>
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Особенности</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li>✓ Пещерное жилище в лёссовых склонах</li>
                        <li>✓ Отличная теплоизоляция</li>
                        <li>✓ Естественная защита от ветра</li>
                        <li>✓ Экономия строительных материалов</li>
                        <li>✓ Устойчивость к землетрясениям</li>
                    </ul>
                </div>
                <div>
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Характеристики</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li>• Глубина: 6-11 метров</li>
                        <li>• Температура: круглый год 10-22°C</li>
                        <li>• Материал: лёссовая почва</li>
                        <li>• Регион: Северный Китай</li>
                    </ul>
                </div>
            </div>
            <div style="background: rgba(102, 126, 234, 0.1); padding: 1.5rem; border-radius: 15px; margin: 2rem 0;">
                <p><strong>Описание:</strong> Яодун — традиционное пещерное жилище в Северном Китае, вырытое в лёссовых склонах холмов. Лёсс — это осадочная горная порода, которая легко поддаётся обработке, но при этом достаточно прочная для строительства.</p>
                <p style="margin-top: 1rem;">Яодуны имеют отличную теплоизоляцию — зимой в них тепло, а летом прохладно. Температура внутри круглый год держится в пределах 10-22°C. Такие жилища особенно распространены в провинциях Шэньси, Шаньси и Хэнань.</p>
            </div>
        </div>
    `
};

// 7. Функция для показа детальной информации
function showDwellingDetails(dwellingName) {
    const details = dwellingDetails[dwellingName];
    if (!details) {
        showErrorMessage('Информация о данном жилище пока не добавлена');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'dwelling-modal';
    modal.innerHTML = `
        <div class="dwelling-modal-content">
            <div class="dwelling-modal-header">
                <h2>${dwellingName}</h2>
                <span class="dwelling-close-modal">&times;</span>
            </div>
            ${details}
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        modal.style.display = 'block';
        modal.style.opacity = '1';
    }, 10);
    
    modal.querySelector('.dwelling-close-modal').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    function closeModal() {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
            modal.remove();
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// 8. Модальное окно для изображений
function initializeImageModal() {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <span class="close-modal">&times;</span>
        <div class="modal-content">
            <img class="modal-image">
        </div>
    `;
    document.body.appendChild(modal);
    
    const modalImg = modal.querySelector('.modal-image');
    const closeBtn = modal.querySelector('.close-modal');
    
    document.addEventListener('click', function(e) {
        const galleryItem = e.target.closest('.gallery-item');
        const cardImage = e.target.closest('.card-image');
        
        if (galleryItem) {
            const img = galleryItem.querySelector('.gallery-image');
            if (img.style.backgroundImage) {
                const imageUrl = img.style.backgroundImage
                    .replace('url("', '')
                    .replace('")', '');
                modalImg.src = imageUrl;
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        }
    });
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// 9. Прелоадер
function initializePreloader() {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="spinner"></div>
        <p style="margin-top: 20px; color: white; font-size: 1.2rem;">Загрузка "Жилища мира"...</p>
        <p style="margin-top: 10px; color: rgba(255,255,255,0.8); font-size: 0.9rem;">
            Изучаем традиционные жилища народов мира
        </p>
    `;
    document.body.appendChild(preloader);
    
    Promise.all([
        new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        }),
        new Promise(resolve => setTimeout(resolve, 1500))
    ]).then(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
            showSuccessMessage('Добро пожаловать в мир традиционных жилищ! 🏠');
        }, 500);
    });
}

// 10. Кнопка "Наверх"
function initializeScrollTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-top';
    scrollBtn.textContent = '↑';
    scrollBtn.title = 'Наверх';
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 11. Навигация
function initializeNavigation() {
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

// 12. Утилитные функции
function showSuccessMessage(text) {
    const message = document.createElement('div');
    message.className = 'success-message';
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.5s ease;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transform = 'translateX(100px)';
        setTimeout(() => {
            message.remove();
        }, 300);
    }, 3000);
}

function showErrorMessage(text) {
    const message = document.createElement('div');
    message.className = 'success-message';
    message.style.background = 'linear-gradient(135deg, #f5576c, #e74c3c)';
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.5s ease;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transform = 'translateX(100px)';
        setTimeout(() => {
            message.remove();
        }, 300);
    }, 3000);
}

// 13. Функция для проверки атрибутов data-image
function checkDataImageAttributes() {
    console.log('🔍 Проверяем атрибуты data-image в карточках...');
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        const dataImage = card.getAttribute('data-image');
        const title = card.querySelector('h3')?.textContent || 'Без названия';
        console.log(`Карточка ${index + 1}: "${title}" - data-image="${dataImage}"`);
        
        // Проверяем, есть ли у карточки изображение
        const cardImage = card.querySelector('.card-image');
        if (cardImage && cardImage.style.backgroundImage) {
            console.log(`   ✅ Изображение загружено`);
        } else if (cardImage) {
            console.log(`   ❌ Изображение НЕ загружено`);
        }
    });
}

// Обновляем инициализацию в конце файла:
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Инициализация проекта "Жилища мира"...');
    
    initializePreloader();
    initializeBreadcrumbs();
    initializeNavigation();
    initializeSearch();
    initializeFilters();
    initializeGallery();
    initializeImageModal();
    initializeScrollTop();
    preloadCardImages(); // ЗАГРУЖАЕМ ИЗОБРАЖЕНИЯ КАРТОЧЕК
    
    // Анимация для карточек
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.setProperty('--i', index);
    });
    
    // Обработка кнопок "Подробнее"
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn') && e.target.textContent === 'Подробнее') {
            const card = e.target.closest('.card');
            if (card) {
                const dwellingName = card.querySelector('h3').textContent;
                showDwellingDetails(dwellingName);
            }
        }
    });
    
    // Проверяем атрибуты после загрузки всех изображений
    setTimeout(() => {
        checkDataImageAttributes();
    }, 2000);
    
    console.log('✅ "Жилища мира" успешно загружен!');
});

// ========== ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Инициализация проекта "Жилища мира"...');
    
    initializePreloader();
    initializeBreadcrumbs();
    initializeNavigation();
    initializeSearch();
    initializeFilters();
    initializeGallery();
    initializeImageModal();
    initializeScrollTop();
    preloadCardImages(); // ЗАГРУЖАЕМ ИЗОБРАЖЕНИЯ КАРТОЧЕК
    
    // Анимация для карточек
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.setProperty('--i', index);
    });
    
    // Обработка кнопок "Подробнее"
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn') && e.target.textContent === 'Подробнее') {
            const card = e.target.closest('.card');
            if (card) {
                const dwellingName = card.querySelector('h3').textContent;
                showDwellingDetails(dwellingName);
            }
        }
    });
    
    console.log('✅ "Жилища мира" успешно загружен!');
});

// Добавляем стили для анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(100px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.7);
        transform: scale(0);
        animation: ripple 0.6s linear;
    }
    
    @keyframes ripple {
        to { transform: scale(4); opacity: 0; }
    }
`;
document.head.appendChild(style);