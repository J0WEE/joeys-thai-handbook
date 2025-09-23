// Data storage
let vocabulary = JSON.parse(localStorage.getItem('vocabulary')) || [];
let phrases = JSON.parse(localStorage.getItem('phrases')) || [];
let templates = JSON.parse(localStorage.getItem('templates')) || [];
let categories = JSON.parse(localStorage.getItem('categories')) || [
    { id: 1, name: 'Food', description: 'Food and dining related words' },
    { id: 2, name: 'Travel', description: 'Travel and transportation' },
    { id: 3, name: 'Daily Life', description: 'Everyday conversation' }
];

// Save categories to localStorage if empty
if (!localStorage.getItem('categories')) {
    localStorage.setItem('categories', JSON.stringify(categories));
}

// Navigation functions
function setActiveNav(activeButton) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    activeButton.classList.add('active');
}

function showDashboard() {
    setActiveNav(event.target);
    document.getElementById('page-title').textContent = 'Dashboard';
    document.getElementById('main-content').innerHTML = `
        <div class="dashboard-welcome">
            <h1>Welcome to Your Thai Learning Journey</h1>
            <p>Track your vocabulary, phrases, and sentence templates all in one place</p>
        </div>

        <div class="dashboard-stats">
            <div class="stat-card">
                <h3 id="vocab-count">0</h3>
                <p>Vocabulary Words</p>
            </div>
            <div class="stat-card">
                <h3 id="phrase-count">0</h3>
                <p>Phrases</p>
            </div>
            <div class="stat-card">
                <h3 id="template-count">0</h3>
                <p>Sentence Templates</p>
            </div>
            <div class="stat-card">
                <h3 id="category-count">0</h3>
                <p>Categories</p>
            </div>
        </div>

        <div class="quick-actions">
            <h2>Quick Actions</h2>
            <div class="action-buttons">
                <button class="action-btn" onclick="showVocabulary()">Add New Word</button>
                <button class="action-btn" onclick="showPhrases()">Add New Phrase</button>
                <button class="action-btn" onclick="showCategories()">Manage Categories</button>
            </div>
        </div>
    `;
    updateDashboardStats();
}

function showVocabulary() {
    setActiveNav(event.target);
    document.getElementById('page-title').textContent = 'Vocabulary Manager';
    document.getElementById('main-content').innerHTML = `
        <div class="vocab-header">
            <button class="action-btn" onclick="showAddWordForm()">+ Add New Word</button>
            
            <div class="filters">
                <select id="category-filter" onchange="filterVocabulary()">
                    <option value="">All Categories</option>
                </select>
                
                <select id="progress-filter" onchange="filterVocabulary()">
                    <option value="">All Progress Levels</option>
                    <option value="new">New</option>
                    <option value="recognize">Recognize</option>
                    <option value="recall">Recall</option>
                    <option value="confident">Confident</option>
                </select>
                
                <input type="text" id="search-filter" placeholder="Search words..." onkeyup="filterVocabulary()">
            </div>
        </div>

        <div class="vocab-grid" id="vocab-grid">
            <!-- Vocabulary cards will be populated here -->
        </div>

        <!-- Add Word Modal -->
        <div id="add-word-modal" class="modal" style="display: none;">
            <div class="modal-content">
                <span class="close" onclick="closeAddWordForm()">&times;</span>
                <h3>Add New Word</h3>
                <form id="add-word-form" onsubmit="addWord(event)">
                    <input type="text" id="thai-word" placeholder="Thai word" required>
                    <input type="text" id="pronunciation" placeholder="Pronunciation (English)" required>
                    <input type="text" id="translation" placeholder="English translation" required>
                    <textarea id="example" placeholder="Example usage (optional)"></textarea>
                    
                    <select id="word-category" required>
                        <option value="">Select Category</option>
                    </select>
                    
                    <select id="word-progress" required>
                        <option value="new">New</option>
                        <option value="recognize">Recognize</option>
                        <option value="recall">Recall</option>
                        <option value="confident">Confident</option>
                    </select>
                    
                    <button type="submit" class="action-btn">Add Word</button>
                </form>
            </div>
        </div>

        <!-- Edit Word Modal -->
        <div id="edit-word-modal" class="modal" style="display: none;">
            <div class="modal-content">
                <span class="close" onclick="closeEditWordForm()">&times;</span>
                <h3>Edit Word</h3>
                <form id="edit-word-form" onsubmit="updateWord(event)">
                    <input type="hidden" id="edit-word-id">
                    <input type="text" id="edit-thai-word" placeholder="Thai word" required>
                    <input type="text" id="edit-pronunciation" placeholder="Pronunciation (English)" required>
                    <input type="text" id="edit-translation" placeholder="English translation" required>
                    <textarea id="edit-example" placeholder="Example usage (optional)"></textarea>
                    
                    <select id="edit-word-category" required>
                        <option value="">Select Category</option>
                    </select>
                    
                    <select id="edit-word-progress" required>
                        <option value="new">New</option>
                        <option value="recognize">Recognize</option>
                        <option value="recall">Recall</option>
                        <option value="confident">Confident</option>
                    </select>
                    
                    <button type="submit" class="action-btn">Update Word</button>
                </form>
            </div>
        </div>
    `;
    
    loadCategories();
    displayVocabulary();
}

function showPhrases() {
    setActiveNav(event.target);
    document.getElementById('page-title').textContent = 'Phrasebook';
    document.getElementById('main-content').innerHTML = `
        <div class="vocab-header">
            <button class="action-btn" onclick="showAddPhraseForm()">+ Add New Phrase</button>
            
            <div class="filters">
                <select id="phrase-category-filter" onchange="filterPhrases()">
                    <option value="">All Categories</option>
                </select>
                
                <select id="phrase-progress-filter" onchange="filterPhrases()">
                    <option value="">All Progress Levels</option>
                    <option value="new">New</option>
                    <option value="recognize">Recognize</option>
                    <option value="recall">Recall</option>
                    <option value="confident">Confident</option>
                </select>
                
                <input type="text" id="phrase-search-filter" placeholder="Search phrases..." onkeyup="filterPhrases()">
            </div>
        </div>

        <div class="phrase-grid" id="phrase-grid">
            <!-- Phrase cards will be populated here -->
        </div>

        <!-- Add Phrase Modal -->
        <div id="add-phrase-modal" class="modal" style="display: none;">
            <div class="modal-content">
                <span class="close" onclick="closeAddPhraseForm()">&times;</span>
                <h3>Add New Phrase</h3>
                <form id="add-phrase-form" onsubmit="addPhrase(event)">
                    <input type="text" id="thai-phrase" placeholder="Thai phrase" required>
                    <input type="text" id="phrase-pronunciation" placeholder="Pronunciation (English)" required>
                    <input type="text" id="phrase-translation" placeholder="English translation" required>
                    <textarea id="phrase-context" placeholder="When/where to use this phrase (optional)"></textarea>
                    
                    <select id="phrase-category" required>
                        <option value="">Select Category</option>
                    </select>
                    
                    <select id="phrase-progress" required>
                        <option value="new">New</option>
                        <option value="recognize">Recognize</option>
                        <option value="recall">Recall</option>
                        <option value="confident">Confident</option>
                    </select>
                    
                    <button type="submit" class="action-btn">Add Phrase</button>
                </form>
            </div>
        </div>

        <!-- Edit Phrase Modal -->
        <div id="edit-phrase-modal" class="modal" style="display: none;">
            <div class="modal-content">
                <span class="close" onclick="closeEditPhraseForm()">&times;</span>
                <h3>Edit Phrase</h3>
                <form id="edit-phrase-form" onsubmit="updatePhrase(event)">
                    <input type="hidden" id="edit-phrase-id">
                    <input type="text" id="edit-thai-phrase" placeholder="Thai phrase" required>
                    <input type="text" id="edit-phrase-pronunciation" placeholder="Pronunciation (English)" required>
                    <input type="text" id="edit-phrase-translation" placeholder="English translation" required>
                    <textarea id="edit-phrase-context" placeholder="When/where to use this phrase (optional)"></textarea>
                    
                    <select id="edit-phrase-category" required>
                        <option value="">Select Category</option>
                    </select>
                    
                    <select id="edit-phrase-progress" required>
                        <option value="new">New</option>
                        <option value="recognize">Recognize</option>
                        <option value="recall">Recall</option>
                        <option value="confident">Confident</option>
                    </select>
                    
                    <button type="submit" class="action-btn">Update Phrase</button>
                </form>
            </div>
        </div>
    `;
    
    loadCategoriesForPhrases();
    displayPhrases();
}

function showTemplates() {
    setActiveNav(event.target);
    document.getElementById('page-title').textContent = 'Sentence Templates';
    document.getElementById('main-content').innerHTML = `
        <div class="vocab-header">
            <button class="action-btn" onclick="showAddTemplateForm()">+ Add New Template</button>
            
            <div class="filters">
                <select id="template-category-filter" onchange="filterTemplates()">
                    <option value="">All Categories</option>
                </select>
                
                <select id="template-complexity-filter" onchange="filterTemplates()">
                    <option value="">All Complexity Levels</option>
                    <option value="basic">Basic</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>
                
                <input type="text" id="template-search-filter" placeholder="Search templates..." onkeyup="filterTemplates()">
            </div>
        </div>

        <div class="vocab-grid" id="template-grid">
            <!-- Template cards will be populated here -->
        </div>

        <!-- Add Template Modal -->
        <div id="add-template-modal" class="modal" style="display: none;">
            <div class="modal-content">
                <span class="close" onclick="closeAddTemplateForm()">&times;</span>
                <h3>Add New Template</h3>
                <form id="add-template-form">
                    <input type="text" id="template-pattern-thai" placeholder="Sentence pattern in Thai" required>
                    <input type="text" id="template-pattern-pronunciation" placeholder="Sentence pattern pronunciation (English)" required>
                    <textarea id="template-example" placeholder="Example sentence using this pattern (optional)"></textarea>
                    <textarea id="template-notes" placeholder="Grammar notes or usage tips (optional)"></textarea>
                    
                    <select id="template-category" required>
                        <option value="">Select Category</option>
                    </select>
                    
                    <select id="template-complexity" required>
                        <option value="basic">Basic</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                    
                    <button type="button" class="action-btn" onclick="handleAddTemplate()">Add Template</button>
                </form>
            </div>
        </div>

        <!-- Edit Template Modal -->
        <div id="edit-template-modal" class="modal" style="display: none;">
            <div class="modal-content">
                <span class="close" onclick="closeEditTemplateForm()">&times;</span>
                <h3>Edit Template</h3>
                <form id="edit-template-form">
                    <input type="hidden" id="edit-template-id">
                    <input type="text" id="edit-template-pattern-thai" placeholder="Sentence pattern in Thai" required>
                    <input type="text" id="edit-template-pattern-pronunciation" placeholder="Sentence pattern pronunciation (English)" required>
                    <textarea id="edit-template-example" placeholder="Example sentence (optional)"></textarea>
                    <textarea id="edit-template-notes" placeholder="Grammar notes (optional)"></textarea>
                    
                    <select id="edit-template-category" required>
                        <option value="">Select Category</option>
                    </select>
                    
                    <select id="edit-template-complexity" required>
                        <option value="basic">Basic</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                    
                    <button type="button" class="action-btn" onclick="handleUpdateTemplate()">Update Template</button>
                </form>
            </div>
        </div>
    `;
    
    loadCategoriesForTemplates();
    displayTemplates();
    
    // Ensure category dropdowns are populated after modal HTML is created
    setTimeout(() => {
        populateCategoryDropdowns();
    }, 100);
}

function showCategories() {
    setActiveNav(event.target);
    document.getElementById('page-title').textContent = 'Category Manager';
    document.getElementById('main-content').innerHTML = `
        <div class="category-header">
            <button class="action-btn" onclick="showAddCategoryForm()">+ Add New Category</button>
        </div>

        <div class="category-list" id="category-list">
            <!-- Categories will be populated here -->
        </div>

        <!-- Add Category Modal -->
        <div id="add-category-modal" class="modal" style="display: none;">
            <div class="modal-content">
                <span class="close" onclick="closeAddCategoryForm()">&times;</span>
                <h3>Add New Category</h3>
                <form id="add-category-form" onsubmit="addCategory(event)">
                    <input type="text" id="category-name" placeholder="Category name" required>
                    <textarea id="category-description" placeholder="Description (optional)"></textarea>
                    <button type="submit" class="action-btn">Add Category</button>
                </form>
            </div>
        </div>

        <!-- Edit Category Modal -->
        <div id="edit-category-modal" class="modal" style="display: none;">
            <div class="modal-content">
                <span class="close" onclick="closeEditCategoryForm()">&times;</span>
                <h3>Edit Category</h3>
                <form id="edit-category-form" onsubmit="updateCategory(event)">
                    <input type="hidden" id="edit-category-id">
                    <input type="text" id="edit-category-name" placeholder="Category name" required>
                    <textarea id="edit-category-description" placeholder="Description (optional)"></textarea>
                    <button type="submit" class="action-btn">Update Category</button>
                </form>
            </div>
        </div>
    `;
    
    displayCategories();
}

// Vocabulary Management Functions
function showAddWordForm() {
    populateCategoryDropdowns();
    document.getElementById('add-word-modal').style.display = 'block';
}

function closeAddWordForm() {
    document.getElementById('add-word-modal').style.display = 'none';
    document.getElementById('add-word-form').reset();
}

function addWord(event) {
    event.preventDefault();
    
    const word = {
        id: Date.now(),
        thai: document.getElementById('thai-word').value,
        pronunciation: document.getElementById('pronunciation').value,
        translation: document.getElementById('translation').value,
        example: document.getElementById('example').value,
        category: document.getElementById('word-category').value,
        progress: document.getElementById('word-progress').value
    };
    
    vocabulary.push(word);
    localStorage.setItem('vocabulary', JSON.stringify(vocabulary));
    
    closeAddWordForm();
    displayVocabulary();
    updateDashboardStats();
}

function editWord(id) {
    const word = vocabulary.find(w => w.id === id);
    if (!word) return;
    
    populateCategoryDropdowns();
    
    document.getElementById('edit-word-id').value = word.id;
    document.getElementById('edit-thai-word').value = word.thai;
    document.getElementById('edit-pronunciation').value = word.pronunciation;
    document.getElementById('edit-translation').value = word.translation;
    document.getElementById('edit-example').value = word.example || '';
    document.getElementById('edit-word-category').value = word.category;
    document.getElementById('edit-word-progress').value = word.progress;
    
    document.getElementById('edit-word-modal').style.display = 'block';
}

function closeEditWordForm() {
    document.getElementById('edit-word-modal').style.display = 'none';
    document.getElementById('edit-word-form').reset();
}

function updateWord(event) {
    event.preventDefault();
    
    const id = parseInt(document.getElementById('edit-word-id').value);
    const wordIndex = vocabulary.findIndex(w => w.id === id);
    
    if (wordIndex !== -1) {
        vocabulary[wordIndex] = {
            id: id,
            thai: document.getElementById('edit-thai-word').value,
            pronunciation: document.getElementById('edit-pronunciation').value,
            translation: document.getElementById('edit-translation').value,
            example: document.getElementById('edit-example').value,
            category: document.getElementById('edit-word-category').value,
            progress: document.getElementById('edit-word-progress').value
        };
        
        localStorage.setItem('vocabulary', JSON.stringify(vocabulary));
        closeEditWordForm();
        displayVocabulary();
        updateDashboardStats();
    }
}

function deleteWord(id) {
    if (confirm('Are you sure you want to delete this word?')) {
        vocabulary = vocabulary.filter(w => w.id !== id);
        localStorage.setItem('vocabulary', JSON.stringify(vocabulary));
        displayVocabulary();
        updateDashboardStats();
    }
}

function displayVocabulary() {
    const grid = document.getElementById('vocab-grid');
    if (!grid) return;
    
    let filteredVocab = [...vocabulary];
    
    const categoryFilter = document.getElementById('category-filter')?.value;
    const progressFilter = document.getElementById('progress-filter')?.value;
    const searchFilter = document.getElementById('search-filter')?.value?.toLowerCase();
    
    if (categoryFilter) {
        filteredVocab = filteredVocab.filter(word => word.category === categoryFilter);
    }
    
    if (progressFilter) {
        filteredVocab = filteredVocab.filter(word => word.progress === progressFilter);
    }
    
    if (searchFilter) {
        filteredVocab = filteredVocab.filter(word => 
            word.thai.toLowerCase().includes(searchFilter) ||
            word.translation.toLowerCase().includes(searchFilter) ||
            word.pronunciation.toLowerCase().includes(searchFilter)
        );
    }
    
    if (filteredVocab.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #7f8c8d; grid-column: 1 / -1;">No vocabulary words found.</p>';
        return;
    }
    
    grid.innerHTML = filteredVocab.map(word => {
        const category = categories.find(c => c.id == word.category);
        return `
            <div class="vocab-card">
                <div class="vocab-card-header">
                    <div>
                        <div class="thai-word">${word.thai}</div>
                        <div class="pronunciation">${word.pronunciation}</div>
                    </div>
                    <div class="card-actions">
                        <button class="card-btn edit-btn" onclick="editWord(${word.id})" title="Edit">✏️</button>
                        <button class="card-btn delete-btn" onclick="deleteWord(${word.id})" title="Delete">🗑️</button>
                    </div>
                </div>
                
                <div class="translation">${word.translation}</div>
                
                ${word.example ? `<div class="example">"${word.example}"</div>` : ''}
                
                <div class="card-meta">
                    <div>
                        <span class="progress-badge progress-${word.progress}">${word.progress}</span>
                        <span class="category-badge">${category ? category.name : 'Unknown'}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filterVocabulary() {
    displayVocabulary();
}

// Phrase Management Functions
function showAddPhraseForm() {
    populateCategoryDropdowns();
    document.getElementById('add-phrase-modal').style.display = 'block';
}

function closeAddPhraseForm() {
    document.getElementById('add-phrase-modal').style.display = 'none';
    document.getElementById('add-phrase-form').reset();
}

function addPhrase(event) {
    event.preventDefault();
    
    const phrase = {
        id: Date.now(),
        thai: document.getElementById('thai-phrase').value,
        pronunciation: document.getElementById('phrase-pronunciation').value,
        translation: document.getElementById('phrase-translation').value,
        context: document.getElementById('phrase-context').value,
        category: document.getElementById('phrase-category').value,
        progress: document.getElementById('phrase-progress').value
    };
    
    phrases.push(phrase);
    localStorage.setItem('phrases', JSON.stringify(phrases));
    
    closeAddPhraseForm();
    displayPhrases();
    updateDashboardStats();
}

function editPhrase(id) {
    const phrase = phrases.find(p => p.id === id);
    if (!phrase) return;
    
    populateCategoryDropdowns();
    
    document.getElementById('edit-phrase-id').value = phrase.id;
    document.getElementById('edit-thai-phrase').value = phrase.thai;
    document.getElementById('edit-phrase-pronunciation').value = phrase.pronunciation;
    document.getElementById('edit-phrase-translation').value = phrase.translation;
    document.getElementById('edit-phrase-context').value = phrase.context || '';
    document.getElementById('edit-phrase-category').value = phrase.category;
    document.getElementById('edit-phrase-progress').value = phrase.progress;
    
    document.getElementById('edit-phrase-modal').style.display = 'block';
}

function closeEditPhraseForm() {
    document.getElementById('edit-phrase-modal').style.display = 'none';
    document.getElementById('edit-phrase-form').reset();
}

function updatePhrase(event) {
    event.preventDefault();
    
    const id = parseInt(document.getElementById('edit-phrase-id').value);
    const phraseIndex = phrases.findIndex(p => p.id === id);
    
    if (phraseIndex !== -1) {
        phrases[phraseIndex] = {
            id: id,
            thai: document.getElementById('edit-thai-phrase').value,
            pronunciation: document.getElementById('edit-phrase-pronunciation').value,
            translation: document.getElementById('edit-phrase-translation').value,
            context: document.getElementById('edit-phrase-context').value,
            category: document.getElementById('edit-phrase-category').value,
            progress: document.getElementById('edit-phrase-progress').value
        };
        
        localStorage.setItem('phrases', JSON.stringify(phrases));
        closeEditPhraseForm();
        displayPhrases();
        updateDashboardStats();
    }
}

function deletePhrase(id) {
    if (confirm('Are you sure you want to delete this phrase?')) {
        phrases = phrases.filter(p => p.id !== id);
        localStorage.setItem('phrases', JSON.stringify(phrases));
        displayPhrases();
        updateDashboardStats();
    }
}

function displayPhrases() {
    const grid = document.getElementById('phrase-grid');
    if (!grid) return;
    
    let filteredPhrases = [...phrases];
    
    const categoryFilter = document.getElementById('phrase-category-filter')?.value;
    const progressFilter = document.getElementById('phrase-progress-filter')?.value;
    const searchFilter = document.getElementById('phrase-search-filter')?.value?.toLowerCase();
    
    if (categoryFilter) {
        filteredPhrases = filteredPhrases.filter(phrase => phrase.category === categoryFilter);
    }
    
    if (progressFilter) {
        filteredPhrases = filteredPhrases.filter(phrase => phrase.progress === progressFilter);
    }
    
    if (searchFilter) {
        filteredPhrases = filteredPhrases.filter(phrase => 
            phrase.thai.toLowerCase().includes(searchFilter) ||
            phrase.translation.toLowerCase().includes(searchFilter) ||
            phrase.pronunciation.toLowerCase().includes(searchFilter)
        );
    }
    
    if (filteredPhrases.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #7f8c8d; grid-column: 1 / -1;">No phrases found.</p>';
        return;
    }
    
    grid.innerHTML = filteredPhrases.map(phrase => {
        const category = categories.find(c => c.id == phrase.category);
        return `
            <div class="vocab-card">
                <div class="vocab-card-header">
                    <div>
                        <div class="thai-word">${phrase.thai}</div>
                        <div class="pronunciation">${phrase.pronunciation}</div>
                    </div>
                    <div class="card-actions">
                        <button class="card-btn edit-btn" onclick="editPhrase(${phrase.id})" title="Edit">✏️</button>
                        <button class="card-btn delete-btn" onclick="deletePhrase(${phrase.id})" title="Delete">🗑️</button>
                    </div>
                </div>
                
                <div class="translation">${phrase.translation}</div>
                
                ${phrase.context ? `<div class="example">Context: "${phrase.context}"</div>` : ''}
                
                <div class="card-meta">
                    <div>
                        <span class="progress-badge progress-${phrase.progress}">${phrase.progress}</span>
                        <span class="category-badge">${category ? category.name : 'Unknown'}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filterPhrases() {
    displayPhrases();
}

// Template Management Functions
function showAddTemplateForm() {
    populateCategoryDropdowns();
    const modal = document.getElementById('add-template-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeAddTemplateForm() {
    const modal = document.getElementById('add-template-modal');
    if (modal) modal.style.display = 'none';
    
    // Clear form fields
    const fields = [
        'template-pattern-thai',
        'template-pattern-pronunciation', 
        'template-example',
        'template-notes',
        'template-category',
        'template-complexity'
    ];
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            if (field.tagName === 'SELECT') {
                field.selectedIndex = 0;
            } else {
                field.value = '';
            }
        }
    });
}

function closeEditTemplateForm() {
    const modal = document.getElementById('edit-template-modal');
    if (modal) modal.style.display = 'none';
    
    // Clear edit form fields
    const fields = [
        'edit-template-pattern-thai',
        'edit-template-pattern-pronunciation', 
        'edit-template-example',
        'edit-template-notes',
        'edit-template-category',
        'edit-template-complexity'
    ];
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            if (field.tagName === 'SELECT') {
                field.selectedIndex = 0;
            } else {
                field.value = '';
            }
        }
    });
}

function deleteTemplate(id) {
    if (confirm('Are you sure you want to delete this template?')) {
        templates = templates.filter(t => t.id !== id);
        localStorage.setItem('templates', JSON.stringify(templates));
        displayTemplates();
        updateDashboardStats();
    }
}

function displayTemplates() {
    const grid = document.getElementById('template-grid');
    if (!grid) return;
    
    let filteredTemplates = [...templates];
    
    const categoryFilter = document.getElementById('template-category-filter')?.value;
    const complexityFilter = document.getElementById('template-complexity-filter')?.value;
    const searchFilter = document.getElementById('template-search-filter')?.value?.toLowerCase();
    
    if (categoryFilter) {
        filteredTemplates = filteredTemplates.filter(template => template.category === categoryFilter);
    }
    
    if (complexityFilter) {
        filteredTemplates = filteredTemplates.filter(template => template.complexity === complexityFilter);
    }
    
    if (searchFilter) {
        filteredTemplates = filteredTemplates.filter(template => 
            (template.patternThai && template.patternThai.toLowerCase().includes(searchFilter)) ||
            (template.patternPronunciation && template.patternPronunciation.toLowerCase().includes(searchFilter)) ||
            (template.example && template.example.toLowerCase().includes(searchFilter)) ||
                (template.pattern && template.pattern.toLowerCase().includes(searchFilter))
            );
        }
    }