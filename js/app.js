// ================================
// VARIABLES GLOBALES
// ================================
let currentQuestion = 0;
let score = 0;
let answered = false;

// Questions du quiz
const questions = [
    {
        question: "Quelle est la première destination touristique mondiale en nombre de visiteurs ?",
        answers: ["États-Unis", "France", "Espagne", "Chine"],
        correct: 1
    },
    {
        question: "Que signifie l'acronyme OMT dans le secteur du tourisme ?",
        answers: ["Office Mondial du Tourisme", "Organisation Mondiale du Tourisme", "Organisme de Marketing Touristique", "Office de la Mobilité Touristique"],
        correct: 1
    },
    {
        question: "Quel pourcentage du PIB mondial représente approximativement le tourisme ?",
        answers: ["5%", "8%", "10%", "15%"],
        correct: 2
    },
    {
        question: "Quelle certification est requise pour exercer en tant que guide-conférencier en France ?",
        answers: ["BTS Tourisme", "Carte professionnelle de guide", "Master en Tourisme", "Aucune certification"],
        correct: 1
    },
    {
        question: "Qu'est-ce que le yield management dans l'industrie touristique ?",
        answers: ["Gestion des employés", "Optimisation des revenus par la tarification", "Marketing digital", "Gestion de la qualité"],
        correct: 1
    }
];

// ================================
// INITIALISATION
// ================================
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAnimations();
    initializeQuiz();
});

// ================================
// GESTION DE LA NAVIGATION
// ================================
function initializeNavigation() {
    // Ajout des événements de navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
}

function handleNavigation(e) {
    e.preventDefault();
    
    // Retirer les classes actives
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Ajouter la classe active au lien cliqué
    e.target.classList.add('active');
    
    // Afficher la page correspondante
    const pageId = e.target.dataset.page;
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        // Réinitialiser les animations de la page
        resetPageAnimations(targetPage);
    }
}

function resetPageAnimations(page) {
    const animatedElements = page.querySelectorAll('.fade-in');
    animatedElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
        // Force la réapplication de l'animation
        el.classList.remove('fade-in');
        setTimeout(() => {
            el.classList.add('fade-in');
        }, 10);
    });
}

// ================================
// GESTION DES ANIMATIONS
// ================================
function initializeAnimations() {
    // Observer d'intersection pour les animations au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observer tous les éléments avec la classe d'animation
    document.querySelectorAll('.section, .card').forEach(el => {
        observer.observe(el);
    });

    // Animation d'entrée décalée pour les cartes
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach((el, index) => {
            el.style.animationDelay = `${index * 0.1}s`;
        });
    }, 100);
}

// ================================
// GESTION DU QUIZ
// ================================
function initializeQuiz() {
    updateScore();
    updateProgress();
}

function selectAnswer(answerIndex) {
    if (answered) return;
    
    answered = true;
    const buttons = document.querySelectorAll('.answer-btn');
    const correct = questions[currentQuestion].correct;
    
    // Appliquer les styles de réponse
    buttons.forEach((btn, index) => {
        btn.classList.add('disabled');
        
        if (index === correct) {
            btn.classList.add('correct');
        } else if (index === answerIndex && index !== correct) {
            btn.classList.add('incorrect');
        }
    });
    
    // Mettre à jour le score
    if (answerIndex === correct) {
        score++;
        showFeedback('Bonne réponse !', 'success');
    } else {
        showFeedback('Mauvaise réponse. La bonne réponse était : ' + questions[currentQuestion].answers[correct], 'error');
    }
    
    // Afficher le bouton suivant
    document.getElementById('next-btn').style.display = 'inline-block';
    updateScore();
}

function nextQuestion() {
    currentQuestion++;
    answered = false;
    
    if (currentQuestion < questions.length) {
        displayQuestion();
        document.getElementById('next-btn').style.display = 'none';
        hideFeedback();
    } else {
        showFinalScore();
    }
    
    updateProgress();
}

function displayQuestion() {
    const question = questions[currentQuestion];
    document.getElementById('question-text').textContent = question.question;
    
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach((btn, index) => {
        btn.textContent = `${String.fromCharCode(65 + index)}) ${question.answers[index]}`;
        // Réinitialiser les classes
        btn.className = 'answer-btn';
        btn.onclick = () => selectAnswer(index);
    });
}

function updateScore() {
    const scoreDisplay = document.getElementById('score-display');
    if (scoreDisplay) {
        scoreDisplay.textContent = `Score: ${score}/${questions.length}`;
    }
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
}

function showFinalScore() {
    const container = document.getElementById('quiz-container');
    const percentage = Math.round((score / questions.length) * 100);
    let message = '';
    let emoji = '';
    
    if (percentage >= 80) {
        message = 'Excellent ! Vous maîtrisez parfaitement le secteur du tourisme !';
        emoji = '🎉';
    } else if (percentage >= 60) {
        message = 'Bien joué ! Vous avez de bonnes bases dans le tourisme.';
        emoji = '👍';
    } else {
        message = 'Continuez à vous former, le secteur du tourisme a encore des secrets à découvrir !';
        emoji = '📚';
    }
    
    container.innerHTML = createFinalScoreHTML(percentage, message, emoji);
}

function createFinalScoreHTML(percentage, message, emoji) {
    return `
        <div style="text-align: center; padding: 3rem;">
            <h2 style="color: var(--accent); margin-bottom: 2rem; font-size: 2.5rem;">Quiz Terminé !</h2>
            <div style="font-size: 4rem; margin-bottom: 1rem;">${emoji}</div>
            <div style="font-size: 4rem; margin-bottom: 2rem; font-weight: bold; background: var(--primary); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${percentage}%</div>
            <p style="font-size: 1.3rem; margin-bottom: 2rem; color: var(--text-light);">${message}</p>
            <p style="font-size: 1.1rem; margin-bottom: 3rem; color: var(--text-dark);">Vous avez obtenu <strong>${score}/${questions.length}</strong> bonnes réponses</p>
            <button onclick="restartQuiz()" class="restart-btn">
                <i class="fas fa-redo"></i> Recommencer le Quiz
            </button>
        </div>
    `;
}

function restartQuiz() {
    // Réinitialiser les variables
    currentQuestion = 0;
    score = 0;
    answered = false;
    
    // Restaurer l'interface du quiz
    const container = document.getElementById('quiz-container');
    container.innerHTML = createQuizHTML();
    
    // Réinitialiser l'affichage
    updateScore();
    updateProgress();
    hideFeedback();
}

function createQuizHTML() {
    return `
        <div id="question-container">
            <h3 id="question-text">${questions[0].question}</h3>
            <div id="answers-container">
                ${questions[0].answers.map((answer, index) => 
                    `<button class="answer-btn" onclick="selectAnswer(${index})">${String.fromCharCode(65 + index)}) ${answer}</button>`
                ).join('')}
            </div>
        </div>
        
        <div id="quiz-controls">
            <button id="next-btn" onclick="nextQuestion()" style="display: none;">Question Suivante</button>
            <div id="score-display"></div>
        </div>
        
        <div id="feedback-container" style="display: none;"></div>
        
        <div id="progress-bar">
            <div id="progress-fill"></div>
        </div>
    `;
}

// ================================
// SYSTÈME DE FEEDBACK
// ================================
function showFeedback(message, type) {
    let feedbackContainer = document.getElementById('feedback-container');
    
    if (!feedbackContainer) {
        feedbackContainer = document.createElement('div');
        feedbackContainer.id = 'feedback-container';
        document.getElementById('quiz-controls').appendChild(feedbackContainer);
    }
    
    const className = type === 'success' ? 'feedback-success' : 'feedback-error';
    const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-times-circle';
    
    feedbackContainer.innerHTML = `
        <div class="feedback-message ${className}">
            <i class="${icon}"></i>
            <span>${message}</span>
        </div>
    `;
    
    feedbackContainer.style.display = 'block';
    
    // Animation d'entrée
    setTimeout(() => {
        feedbackContainer.querySelector('.feedback-message').style.opacity = '1';
        feedbackContainer.querySelector('.feedback-message').style.transform = 'translateY(0)';
    }, 10);
}

function hideFeedback() {
    const feedbackContainer = document.getElementById('feedback-container');
    if (feedbackContainer) {
        feedbackContainer.style.display = 'none';
    }
}

// ================================
// UTILITAIRES
// ================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Gestion du redimensionnement de fenêtre
window.addEventListener('resize', debounce(() => {
    // Recalculer les animations si nécessaire
    resetPageAnimations(document.querySelector('.page.active'));
}, 250));

// ================================
// STYLES DYNAMIQUES
// ================================
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .restart-btn {
            padding: 1rem 2rem;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .restart-btn:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow);
        }
        
        .feedback-message {
            padding: 1rem;
            border-radius: 12px;
            margin: 1rem 0;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
        }
        
        .feedback-success {
            background: rgba(16, 185, 129, 0.1);
            color: #065f46;
            border: 1px solid rgba(16, 185, 129, 0.3);
        }
        
        .feedback-error {
            background: rgba(239, 68, 68, 0.1);
            color: #991b1b;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }
        
        .nav-link {
            font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
            .nav-link {
                font-size: 0.8rem;
                padding: 0.5rem 0.8rem;
            }
        }
    `;
    document.head.appendChild(style);
}

// ================================
// ACCESSIBILITÉ
// ================================
function initializeAccessibility() {
    // Gestion du clavier pour la navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            // Améliorer la visibilité du focus
            document.body.classList.add('keyboard-nav');
        }
        
        // Navigation avec les flèches dans le quiz
        if (document.querySelector('#quiz.active')) {
            const buttons = document.querySelectorAll('.answer-btn:not(.disabled)');
            const focused = document.activeElement;
            const currentIndex = Array.from(buttons).indexOf(focused);
            
            if (e.key === 'ArrowDown' && currentIndex < buttons.length - 1) {
                e.preventDefault();
                buttons[currentIndex + 1].focus();
            } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                e.preventDefault();
                buttons[currentIndex - 1].focus();
            }
        }
    });
    
    // Retirer la classe lors du clic souris
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });
}

// ================================
// INITIALISATION FINALE
// ================================
document.addEventListener('DOMContentLoaded', () => {
    addDynamicStyles();
    initializeAccessibility();
});