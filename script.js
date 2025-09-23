function showVocab() {
    document.getElementById('content').innerHTML = `
        <h2>Vocabulary Manager</h2>
        <p>Your personal Thai vocabulary database</p>
        <button onclick="addWord()">Add New Word</button>
    `;
}

function showPhrases() {
    document.getElementById('content').innerHTML = `
        <h2>Phrasebook</h2>
        <p>Organized Thai phrases by category</p>
    `;
}

function showTemplates() {
    document.getElementById('content').innerHTML = `
        <h2>Sentence Templates</h2>
        <p>Thai sentence patterns and structures</p>
    `;
}

function addWord() {
    alert('Add word functionality coming soon!');
}
