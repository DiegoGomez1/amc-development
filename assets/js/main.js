// ── Mobile menu ──
const header = document.querySelector('.site-header');
document.querySelector('.menu-toggle')?.addEventListener('click', () => {
  header.classList.toggle('menu-open');
});

// ── Project cards ──
// <div class="project-grid" data-cats="delivered,development" data-limit="8" data-specs>
function cardHTML(p, showSpecs) {
  const specs = showSpecs
    ? `<dl class="specs">${Object.entries(p.specs).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`
    : '';
  return `
    <article class="card" data-cat="${p.cat}">
      <div class="card-img">
        <img src="assets/img/${p.img}" alt="${p.address}" loading="lazy" />
        <span class="tag tag-${p.cat}">${p.status}</span>
      </div>
      <div class="card-body">
        <p class="eyebrow">${p.type}</p>
        <h3>${p.address}</h3>
        <p class="card-text">${p.summary}</p>
        ${specs}
      </div>
    </article>`;
}

document.querySelectorAll('.project-grid').forEach(grid => {
  const cats = (grid.dataset.cats || 'delivered,development,income').split(',');
  const limit = Number(grid.dataset.limit) || Infinity;
  const list = PROJECTS.filter(p => cats.includes(p.cat)).slice(0, limit);
  grid.innerHTML = list.map(p => cardHTML(p, 'specs' in grid.dataset)).join('');
});

// ── Filter chips ── (buttons with data-filter inside .filters, next to a .project-grid)
document.querySelectorAll('.filters').forEach(bar => {
  const grid = document.getElementById(bar.dataset.grid);
  const buttons = bar.querySelectorAll('button');
  buttons.forEach(btn => {
    const f = btn.dataset.filter;
    const n = f === 'all' ? grid.children.length : grid.querySelectorAll(`[data-cat="${f}"]`).length;
    btn.insertAdjacentHTML('beforeend', ` <span class="count">${n}</span>`);
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.toggle('active', b === btn));
      grid.querySelectorAll('.card').forEach(c => {
        c.hidden = f !== 'all' && c.dataset.cat !== f;
      });
    });
  });
});

// ── Spec tables ── <tbody data-table="development" data-cols="Units,Use,Stage,Status">
document.querySelectorAll('tbody[data-table]').forEach(body => {
  const cols = body.dataset.cols.split(',');
  body.innerHTML = PROJECTS.filter(p => p.cat === body.dataset.table)
    .map(p => `<tr><td>${p.address}</td><td>${p.type}</td>${cols.map(c => `<td>${p.specs[c] ?? '—'}</td>`).join('')}</tr>`)
    .join('');
});

// ── Contact form ── no backend: opens the visitor's email app with the message filled in
document.getElementById('contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const subject = `${f.get('subject') || 'Inquiry'} — ${f.get('name')}`;
  const body = `${f.get('message')}\n\n${f.get('name')}\n${f.get('email')}\n${f.get('phone') || ''}`;
  window.location.href = `mailto:amcdevelopmentgroup@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
