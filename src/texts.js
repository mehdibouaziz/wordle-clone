const texts = {
    'ENG': {
        TOGGLE: 'Do you want to start a new game in French? Current progress will be lost.',
        RANDOM: 'Do you want to start a new game with a random world? Current progress will be lost.',
        NEWGAME: 'New game',
        TUTO: {
            title: 'HOW TO PLAY',
            p1: 'Guess the ',
            b1: 'WORLDE',
            p2: ' in six tries.',
            p3: 'Each guess must be a valid five-letter word. Hit the enter button to submit.',
            p4: 'After each guess, the color of the tiles will change to show how close your guess was to the word.',
            b2: 'Examples',
            p5: 'The letter ',
            p6: ' is in the word and in the correct spot.',
            p7: ' is in the word but in the wrong spot.',
            p8: ' is not in the word in any spot.',
        },
        STATS: {
            title: 'STATISTICS'
        },
        ALERTS: {
            length: 'Not enough letters',
            list: 'Not in word list',
            win: ['Wow! Perfect!','Fantastic!','Bravo!','Well done!','You won!','Phew']
        },
        KEYBOARD: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'blank-1', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'blank-2', 'enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'del']
    },
    'FRE': {
        TOGGLE: 'Commencer une nouvelle partie en Anglais ? La progression actuelle sera perdue.',
        RANDOM: 'Commencer une nouvelle partie avec un mot aléatoire ? La progression actuelle sera perdue.',
        NEWGAME: 'Nouvelle partie',
        TUTO: {
            title: 'COMMENT JOUER',
            p1: 'Le but du jeu est de deviner le ',
            b1: 'WORLDE',
            p2: ' en six essais.',
            p3: 'Chaque essai doit etre un mot de 5 lettres valide. Appuyer sur ENTREE pour valider.',
            p4: 'À chaque essai, les lettres du mot que vous avez proposé changeront de couleur pour indiquer à quel point vous êtes proche de trouver le bon mot.',
            b2: 'Exemples',
            p5: 'La lettre ',
            p6: ' est dans le mot et à la bonne position.',
            p7: ' est dans le mot mais à la mauvaise position.',
            p8: " n'est pas dans le mot, à aucune position",
        },
        STATS: {
            title: 'STATISTIQUES'
        },
        ALERTS: {
            length: 'Pas assez de lettres',
            list: "Ce mot n'est pas valide",
            win: ['Ouah ! Parfait !','Fantastique !','Bravo !','Bien joué !','Gagné !','Ouf']
        },
        KEYBOARD: ['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'blank-1', 'enter', 'w', 'x', 'c', 'v', 'b', 'n', 'del']
    }
}

export default texts