function rotateCarousel(pos){
    const c = document.querySelector('.carousel');
    switch (pos){
        //Title
        case 'title':
            //set the right property of our carousel to 0
            c.style.right = '0';
            break;
        //Game
        case 'game':
            //set to 100%
            c.style.right = '100%';
            break;
        //Instructions
        case 'howto':
            //set to 200%
            c.style.right = '200%';
            break;
    }
}

// TITLE SCREEN
document.getElementById('playgame').addEventListener('click', () => {
    rotateCarousel('game');
    help.style.opacity = '1';
});
document.getElementById('learngame').addEventListener('click', () => {
    rotateCarousel('howto');
    help.style.opacity = '1';
    help.innerHTML = 'X';
});

// HELP BUTTON
let help = document.getElementById('help');
help.addEventListener('click', () => {
    if(help.innerHTML == 'X'){
        rotateCarousel('game');
        help.innerHTML = '?';
    }else{
        rotateCarousel('howto');
        help.innerHTML = 'X';
    }
});

//STRATEGY

const _toc = document.querySelector('.toc'),
    _sections = ['objective','rules','strategy','about'];

for(let section of _sections){
    let li = document.createElement('li'),
        a = document.createElement('a');
    a.className = 'toc-link';
    a.innerHTML = section;
    a.addEventListener('click', () => {
        document.getElementById(section).scrollIntoView(true);
    });
    li.appendChild(a);
    _toc.appendChild(li);
}

const sections = document.querySelectorAll('.btt');
for(let section of sections){
    section.addEventListener('click', () => {
        document.getElementById('instructions').scrollTop = 0;
    });
}

//debug - delete later
let p = 0;
const pages = ['title','game','howto'];
document.body.addEventListener('keydown', e => {
    if(e.code == "ArrowRight"){
        p++;
        if(p >= pages.length)p = 0;
    }
    if(e.code == "ArrowLeft"){
        p--;
        if(p < 0)p = pages.length - 1;
    }
    rotateCarousel(pages[p]);
});