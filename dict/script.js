const searchInput = document.getElementById('search');
const results = document.getElementById('results');
const resnum = document.getElementById('resnum');
const afterresults = document.getElementById('afterresults');
const resnuml = document.getElementById('resnuml');


const powers_of_ten = [""," tem", " fuem", "kıom "];
const digits = ["","bı", "kı","san","von","mum","hau","dıaı","roaı","neı"];
function zulyknumber(n) {
  if (n===0){return "dìtnam"}
  const s = n.toString();
  const maxpower = s.length-1;
  const result = [...s].map((d, i) => digits.at(+d)+powers_of_ten[(maxpower - i) % 3]).join(" ");


return result;


  
}

function renderEntry(entry) {
  const type = entry.type ?? '';
  const arity = entry.arity ?? '';
  const note = entry.note ? `<p>${entry.note}</p>` : '';
  return `
    <dl class="entry">
      <dt>
        <a href="?q=${entry.name}" class="wordbox"><b>${entry.name}</b></a>
        ${arity? `<div class="posbox">verb (${entry.arity})</div>` : type ? `<div class="posbox">${entry.type}</div>` : ''}
      </dt><dd>
      <ul>${entry.defs.map(x=>`<li>${x.def}`+(x.sign? `<div class="sign">${x.sign}</div>`:"")+`</li>`)}</ul></dd>
      ${note ? `<details><summary>more</summary>${note}</details>` : ''}
    </dl>`;
}


function rankEntries(data, qRaw) {
  const qWord = qRaw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace("ı", "i");

  const qDef = qRaw.toLowerCase();

  return data
    .map(entry => {
      const word = entry.name.toLowerCase().replace("ı", "i");
      const def = (entry.defs.map(x=>x.def.toLowerCase()) || '');
      const type = (entry.type || '');
      let rank = null;

      if ((word === qWord)) rank = 0;
      else if (word.startsWith(qWord)) rank = 1;
      else if (word.includes(qWord)) rank = 2;

      else if (def.some(x=>x.includes(qDef))) rank = 3;
      else return null;
      return { entry, rank: rank};
    })
    .filter(Boolean)
    .sort((a, b) => a.rank - b.rank)
    .map(x => x.entry);
}

function runSearch() {

  const q = searchInput.value.trim().toLowerCase();
  const data = DICT;

  const matches = rankEntries(data, q).slice(0, 50);
  const len = rankEntries(data, q).length;
  resnum.textContent = `found ${len} result(s)`;
  resnuml.innerHTML = `bur nó són <b>${zulyknumber(len)}</b>`;
  results.innerHTML = matches.map(renderEntry).join('');
  afterresults.textContent = `${len>50?"˙˙˙":""}`;
}

// Language buttons
    searchInput.placeholder = `ar...`;
    searchInput.disabled = false;
    results.innerHTML = '';
    resnum.textContent = '';
    runSearch();

    const q = searchInput.value.trim();
    const params = new URLSearchParams(location.search);
    params.set('q', q);




searchInput.addEventListener('input', () => {
  runSearch();
  history.replaceState(null, '', '?' + params.toString());
});

window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);

  searchInput.placeholder = `ar...`;
  searchInput.disabled = false;

  const q = params.get('q');
  if (q) {
    searchInput.value = q;
    runSearch();
  }
});


