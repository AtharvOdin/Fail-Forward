/* app.js
   - gallery population
   - posts in localStorage
   - game loader
   - simple search and nav interactions
*/

const people = [
  { name: "Thomas Edison", img: "assets/images/thomas-edison.jpg", desc: "Once told he was a poor student, Edison later held over 1,000 patents and invented the practical electric light.", src: "https://en.wikipedia.org/wiki/Thomas_Edison" },
  { name: "James Dyson", img: "assets/images/james-dyson.jpg", desc: "Built thousands of failed prototypes before inventing the successful bagless vacuum.", src: "https://en.wikipedia.org/wiki/James_Dyson" },
  { name: "Steven Spielberg", img: "assets/images/steven-spielberg.jpg", desc: "Rejected by film school early in his career, later became a legendary director.", src: "https://en.wikipedia.org/wiki/Steven_Spielberg" },
  { name: "J. K. Rowling", img: "assets/images/jk-rowling.jpg", desc: "Faced repeated publisher rejections before Harry Potter became a global phenomenon.", src: "https://en.wikipedia.org/wiki/J._K._Rowling" },
  { name: "Stephen King", img: "assets/images/stephen-king.jpg", desc: "Had early rejections but persisted to become a prolific and bestselling author.", src: "https://en.wikipedia.org/wiki/Stephen_King" },
  { name: "Bill Gates", img: "assets/images/bill-gates.jpg", desc: "Early project Traf-O-Data failed but taught lessons used to build Microsoft.", src: "https://en.wikipedia.org/wiki/Bill_Gates" },
  { name: "Steve Jobs", img: "assets/images/steve-jobs.jpg", desc: "Was ousted from Apple, later returned and led landmark product launches.", src: "https://en.wikipedia.org/wiki/Steve_Jobs" },
  { name: "Albert Einstein", img: "assets/images/albert-einstein.jpg", desc: "Had early academic struggles but developed revolutionary physics while working at a patent office.", src: "https://en.wikipedia.org/wiki/Albert_Einstein" }
];

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function renderGallery(filter = ""){
  const container = document.getElementById('cards');
  const template = document.getElementById('cardTemplate');
  container.innerHTML = '';
  const list = people.filter(p => (p.name + ' ' + p.desc).toLowerCase().includes(filter.toLowerCase()));
  list.forEach(p=>{
    const node = template.content.cloneNode(true);
    const img = node.querySelector('.card-img');
    img.src = p.img;
    img.alt = p.name;
    node.querySelector('.card-title').textContent = p.name;
    node.querySelector('.card-desc').textContent = p.desc;
    const link = node.querySelector('.learn-more');
    link.href = p.src;
    container.appendChild(node);
  });
}

/* POSTS */
function initPosts(){
  const form = document.getElementById('postForm');
  const feed = document.getElementById('feed');
  const clearBtn = document.getElementById('clearPosts');
  let saved = JSON.parse(localStorage.getItem('failingPosts') || '[]');

  function render(){
    feed.innerHTML = '';
    if(saved.length === 0){
      const el = document.createElement('div'); el.className='post';
      el.innerHTML = '<em>No posts yet. Share something that helped you learn.</em>';
      feed.appendChild(el); return;
    }
    saved.slice().reverse().forEach(p=>{
      const el = document.createElement('div'); el.className='post';
      const when = new Date(p.ts);
      el.innerHTML = `<strong>${escapeHtml(p.title)}</strong><small> • ${when.toLocaleString()}</small><p>${escapeHtml(p.text)}</p>`;
      feed.appendChild(el);
    });
  }

  form.addEventListener('submit', e=>{
    e.preventDefault();
    const title = document.getElementById('postTitle').value.trim();
    const text = document.getElementById('postText').value.trim();
    if(!title || !text) return;
    saved.push({title,text,ts:Date.now()});
    localStorage.setItem('failingPosts', JSON.stringify(saved));
    form.reset();
    render();
  });

  clearBtn.addEventListener('click', ()=>{
    if(!confirm('Clear all local posts?')) return;
    saved = []; localStorage.removeItem('failingPosts'); render();
  });

  render();
}

/* GAME LOADER */
function initGameLoader(){
  const load = document.getElementById('loadGame');
  const open = document.getElementById('openGame');
  const input = document.getElementById('gameUrl');
  const frame = document.getElementById('gameFrame');

  function sanitizeUrl(url){
    try{ const u = new URL(url); return u.href; } catch(e){ return null; }
  }

  load.addEventListener('click', ()=>{
    const url = input.value.trim(); const ok = sanitizeUrl(url);
    if(!ok) return alert('Paste a valid GitHub Pages URL (https://atharvodin.github.io/Fail-Game/).');
    frame.src = ok; frame.focus();
  });

  open.addEventListener('click', ()=>{
    const url = input.value.trim(); const ok = sanitizeUrl(url);
    if(!ok) return alert('Paste a valid GitHub Pages URL (https://atharvodin.github.io/Fail-Game/).');
    window.open(ok, '_blank', 'noopener');
  });
}

/* SEARCH and NAV */
function initUi(){
  const search = document.getElementById('search');
  const tbItems = document.querySelectorAll('.tb-item');

  search.addEventListener('input', e=>{
    renderGallery(e.target.value);
  });

  tbItems.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const target = document.getElementById(btn.dataset.target);
      if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  document.getElementById('ctaPosts').addEventListener('click', ()=> location.hash = '#posts');
  document.getElementById('ctaGallery').addEventListener('click', ()=> location.hash = '#gallery');
  document.getElementById('getStarted').addEventListener('click', ()=> location.hash = '#posts');
}

/* INIT */
document.addEventListener('DOMContentLoaded', ()=>{
  renderGallery();
  initPosts();
  initGameLoader();
  initUi();
});

