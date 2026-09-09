/* ==========================================================
   Terminal Developer Portfolio Script
   ========================================================== */

let allProjectsData = [];

document.addEventListener('DOMContentLoaded', () => {
    initActiveNavbar();
    initTypewriters();
    initTerminalShortcuts();
    loadProjectsGrid();
    initModalEvents();
});

/* 1. Highlight Active Nav Link */
function initActiveNavbar() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPath || (currentPath === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/* 2. Typewriter Effect */
function initTypewriters() {
    const typewriterElements = document.querySelectorAll('.typewriter-text');
    typewriterElements.forEach(el => {
        const originalText = (el.textContent || el.innerText).replace(/\s+/g, ' ').trim();
        el.textContent = '';
        let charIndex = 0;
        const typingSpeed = 40;

        function typeChar() {
            if (charIndex < originalText.length) {
                el.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, typingSpeed);
            }
        }
        setTimeout(typeChar, 250);
    });
}

/* 3. Fetch JSON & Build Grid */
async function loadProjectsGrid() {
    const container = document.getElementById('projects-container');
    if (!container) return; // Only runs on work.html

    try {
        const response = await fetch('projects.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        allProjectsData = await response.json();

        container.innerHTML = ''; // Clear loading state

        allProjectsData.forEach((project, index) => {
            const tagsHTML = project.tags
                ? project.tags.slice(0, 2).map(tag => `<span class="tag">[${tag}]</span>`).join(' ')
                : '';

            const cardHTML = `
                <article class="project-card" onclick="openProjectModal(${index})">
                    <div class="project-card-header">
                        <span class="project-id">./${project.id || 'project'}</span>
                        <span class="text-success">[INSPECT]</span>
                    </div>
                    <div class="project-card-body">
                        <h2 class="project-title">${project.name}</h2>
                        <p class="project-description-snippet">${project.description}</p>
                        <div class="project-card-footer">
                            <div class="project-tags-mini">${tagsHTML}</div>
                            <span class="project-click-hint">view_details -></span>
                        </div>
                    </div>
                </article>
            `;
            container.innerHTML += cardHTML;
        });

    } catch (error) {
        console.error('Error fetching projects:', error);
        container.innerHTML = `
            <div class="terminal-output">
                <span class="prompt text-red">[ERROR]</span> Failed to load projects.json (${error.message})
            </div>`;
    }
}

/* 4. Open Modal Preview */
function openProjectModal(index) {
    const project = allProjectsData[index];
    if (!project) return;

    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body-content');

    modalTitle.innerText = `y3script@portfolio:~/work/${project.id || 'inspect'}.sh`;

    // Render preview media (Image or Video)
    let mediaHTML = '';
    if (project.preview) {
        if (project.previewType === 'video') {
            mediaHTML = `
                <div class="modal-preview-wrapper">
                    <video class="modal-preview-video" autoplay loop muted playsinline controls>
                        <source src="${project.preview}" type="video/mp4">
                    </video>
                </div>`;
        } else {
            mediaHTML = `
                <div class="modal-preview-wrapper">
                    <img src="${project.preview}" alt="${project.name}" class="modal-preview-img">
                </div>`;
        }
    }

    // Render tags
    const tagsHTML = project.tags
        ? project.tags.map(tag => `<span class="tag">[${tag}]</span>`).join(' ')
        : '';

    // Render GitHub link if provided
    const githubHTML = project.github && project.github.trim() !== ''
        ? `<div class="project-actions">
             <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn-github">
                <span class="btn-icon">⚡</span> git clone ${project.github}
             </a>
           </div>`
        : '';

    modalBody.innerHTML = `
        ${mediaHTML}
        <h2 class="modal-project-title">${project.name}</h2>
        <p class="modal-project-description">${project.description}</p>
        <div class="modal-tags">${tagsHTML}</div>
        ${githubHTML}
    `;

    modal.classList.add('active');
}

/* 5. Close Modal Events */
function initModalEvents() {
    const modal = document.getElementById('project-modal');
    const closeDot = document.getElementById('modal-close-btn');
    const closeX = document.getElementById('modal-x-btn');

    const closeModal = () => {
        if (modal) modal.classList.remove('active');
    };

    if (closeDot) closeDot.addEventListener('click', closeModal);
    if (closeX) closeX.addEventListener('click', closeModal);

    // Close on clicking backdrop
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

/* 6. Terminal Keyboard Shortcuts */
function initTerminalShortcuts() {
    document.addEventListener('keydown', (event) => {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

        switch (event.key) {
            case '1': window.location.href = 'index.html'; break;
            case '2': window.location.href = 'work.html'; break;
            case '3': window.location.href = 'about.html'; break;
            case '4': window.location.href = 'contact.html'; break;
        }
    });
}