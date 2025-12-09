const API_BASE_URL = 'http://localhost:5000/api';
let currentCategory = 'news';

document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    setupForm();
    loadArticles();
});

function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.dataset.category;
            loadArticles();
        });
    });
}

function setupForm() {
    const form = document.getElementById('articleForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await createArticle();
    });
}

async function loadArticles() {
    try {
        const response = await fetch(`${API_BASE_URL}/${currentCategory}/`);
        const articles = await response.json();
        displayArticles(articles);
    } catch (error) {
        console.error('Error loading articles:', error);
        document.getElementById('articlesList').innerHTML =
            '<p class="empty-state">Error loading articles</p>';
    }
}

function displayArticles(articles) {
    const container = document.getElementById('articlesList');

    if (articles.length === 0) {
        container.innerHTML = '<p class="empty-state">No articles yet. Create one!</p>';
        return;
    }

    container.innerHTML = articles.map(article => `
        <div class="article-card">
            <div class="article-header">
                <h3 class="article-title">${escapeHtml(article.title)}</h3>
            </div>
            <div class="article-meta">
                By ${escapeHtml(article.author || 'Anonymous')} • ${formatDate(article.created_at)}
            </div>
            <div class="article-content">${escapeHtml(article.content)}</div>
            <div class="article-actions">
                <button class="btn-delete" onclick="deleteArticle(${article.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

async function createArticle() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const content = document.getElementById('content').value;

    try {
        const response = await fetch(`${API_BASE_URL}/${currentCategory}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, author, content })
        });

        if (response.ok) {
            document.getElementById('articleForm').reset();
            loadArticles();
        } else {
            alert('Error creating article');
        }
    } catch (error) {
        console.error('Error creating article:', error);
        alert('Error creating article');
    }
}

async function deleteArticle(id) {
    if (!confirm('Are you sure you want to delete this article?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${currentCategory}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadArticles();
        } else {
            alert('Error deleting article');
        }
    } catch (error) {
        console.error('Error deleting article:', error);
        alert('Error deleting article');
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
