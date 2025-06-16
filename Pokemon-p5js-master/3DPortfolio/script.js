const pageTurnBtns = document.querySelectorAll('.nextprev-btn');
const pages = document.querySelectorAll('.book-page.page-right');
const contactMeBtn = document.querySelector('.btn.contact-me');
const backProfileBtn = document.querySelector('.back-profile');
const coverRight = document.querySelector('.cover.cover-right');
const pageLeft = document.querySelector('.book-page.page-left');
const viewMoreBtns = document.querySelectorAll('.services-box .btn'); // Sélectionnez tous les boutons "Voir plus"

let totalPages = pages.length;
let currentPageIndex = -1; // -1 = profil, 0 = première page, etc.

// Initialisation du livre
function initBook() {
    coverRight.classList.add('turn');
    coverRight.style.zIndex = -1;
    pageLeft.style.zIndex = 100; // Au premier plan au début
    
    pages.forEach((page, i) => {
        page.classList.remove('turn');
        page.style.zIndex = 50 - i;
        page.style.transition = 'transform 0.6s ease, z-index 0.3s ease';
    });
    
    currentPageIndex = -1;
}

// Fonction pour mettre à jour l'état visuel du livre avec animation plus fluide
function updateBookState(animatePageIndex = null) {
    // Le profil (pageLeft) est devant seulement si on est sur -1
    pageLeft.style.zIndex = currentPageIndex >= 0 ? 10 : 100;
    
    pages.forEach((page, i) => {
        if (i <= currentPageIndex) {
            // Page tournée (flip visible)
            if (animatePageIndex === i) {
                // Ajout léger de délai pour animation fluide
                page.classList.add('turn');
                setTimeout(() => {
                    page.style.zIndex = 20 + i;
                }, 300);
            } else {
                page.classList.add('turn');
                page.style.zIndex = 20 + i;
            }
        } else {
            // Page visible (pas tournée)
            if (animatePageIndex === i) {
                // Petite pause avant de retirer la classe pour fluidité
                setTimeout(() => {
                    page.classList.remove('turn');
                    page.style.zIndex = 50 - i;
                }, 50);
            } else {
                page.classList.remove('turn');
                page.style.zIndex = 50 - i;
            }
        }
    });
}

// Gestion des boutons de navigation
pageTurnBtns.forEach((btn) => {
    btn.onclick = () => {
        const pageId = btn.getAttribute('data-page');
        const page = document.getElementById(pageId);
        const pageIndex = Array.from(pages).indexOf(page);

        if (btn.classList.contains('back')) {
            if (currentPageIndex >= pageIndex) {
                const newIndex = pageIndex - 1;
                const changingPageIndex = currentPageIndex;
                currentPageIndex = newIndex;
                updateBookState(changingPageIndex);
            }
        } else {
            if (currentPageIndex < pageIndex) {
                currentPageIndex = pageIndex;
                updateBookState(pageIndex);
            }
        }
    };
});

// Animation progressive plus fluide pour Contact Me
contactMeBtn.onclick = () => {
    if (currentPageIndex === totalPages - 1) return; // Déjà à la fin

    let delay = 0;
    for (let i = currentPageIndex + 1; i < totalPages; i++) {
        setTimeout(() => {
            currentPageIndex = i;
            updateBookState(i);
        }, delay);
        delay += 300; // 300ms au lieu de 400ms pour un effet plus naturel
    }
};

// Animation progressive plus fluide pour retour Profil
backProfileBtn.onclick = () => {
    if (currentPageIndex < 0) return; // Déjà au profil

    let delay = 0;
    for (let i = currentPageIndex; i >= 0; i--) {
        setTimeout(() => {
            const changingPageIndex = i;
            currentPageIndex = i - 1;
            updateBookState(changingPageIndex);
        }, delay);
        delay += 300;
    }
};

// Fonctionnalité des boutons "Voir plus" pour les projets
viewMoreBtns.forEach((btn, index) => {
    btn.onclick = (e) => {
        e.preventDefault(); // Empêche le comportement par défaut du lien
        
        // Calcule la page de destination.
        // La page "Mes Projets" est à l'index 2 (turn-2).
        // Chaque projet a sa page de détails et une page de compétences.
        // Le premier projet détaillé commence à la page 8 (index 7 dans 'pages').
        // Index 0 -> Gestion du trafic aérien (pages[6] et pages[7])
        // Index 1 -> Affichage des vols (pages[8] et pages[9])
        // Index 2 -> Déplacement doux (pages[10] et pages[11])
        // Index 3 -> Simulateur de bourse (pages[12] et pages[13])
        
        // La page de détail pour le projet à l'index 'index' sera à l'index '2 * index + 6' dans le tableau 'pages'
        // Par exemple, pour le premier projet (index 0), la page de détail est pages[6] (turn-4).
        // La page "Mes Projets" (turn-2) est à l'index 2 dans le tableau `pages`.
        // Les pages de détails des projets commencent à `turn-4`, ce qui correspond à l'index 3 dans `pages`.
        // Donc, la page de destination pour le projet `index` est `pages[3 + 2 * index]`.
        // En clair:
        // Projet 0 (Gestion trafic) -> pages[3] (turn-4)
        // Projet 1 (Affichage vols) -> pages[5] (turn-5 page back) (mais vous l'avez nommée `turn-5` pour la section comp. utilisée et `turn-5` page back pour le detail du projet ce qui est un peu confus)
        // L'HTML suggère :
        // Projet 0 (Gestion trafic) -> page 8 (turn-4 page-back)
        // Projet 1 (Affichage vols) -> page 10 (turn-5 page-back)
        // Projet 2 (Déplacement doux) -> page 12 (turn-6 page-back)
        // Projet 3 (Simulateur bourse) -> page 14 (turn-7 page-back)

        // Les index de `pages` pour ces pages sont :
        // turn-4 (page 8) est pages[3]
        // turn-5 (page 10) est pages[4]
        // turn-6 (page 12) est pages[5]
        // turn-7 (page 14) est pages[6]
        
        // Si les liens "Voir plus" pointent vers les pages de *détails* des projets (pages impaires dans votre numérotation HTML interne, ex: 8, 10, 12, 14),
        // alors la page de destination dans le tableau `pages` est `pages[index + 3]`.
        // Par exemple:
        // Projet 0 (index 0) -> pages[0 + 3] = pages[3] (qui correspond à turn-4, la page 8)
        // Projet 1 (index 1) -> pages[1 + 3] = pages[4] (qui correspond à turn-5, la page 10)
        // etc.
        const targetPageIndex = index + 3; // Index dans le tableau `pages` pour la page de détail du projet

        if (targetPageIndex >= totalPages) return; // S'assurer que l'index est valide

        let delay = 0;
        // Si nous sommes déjà après la page des projets, nous devons reculer ou aller directement
        if (currentPageIndex > targetPageIndex) {
            for (let i = currentPageIndex; i >= targetPageIndex; i--) {
                setTimeout(() => {
                    const changingPageIndex = i;
                    currentPageIndex = i - 1;
                    updateBookState(changingPageIndex);
                }, delay);
                delay += 300;
            }
        } else {
            // Animer le feuilletage jusqu'à la page cible
            for (let i = currentPageIndex + 1; i <= targetPageIndex; i++) {
                setTimeout(() => {
                    currentPageIndex = i;
                    updateBookState(i);
                }, delay);
                delay += 300;
            }
        }
    };
});


// Initialiser le livre au chargement
initBook();