(() => {
  'use strict';

  const STORAGE_KEY = 'physiotherapyEnglishV1';
  const defaultStore = {
    saved: [], mastered: [], flashSeen: 0, practiceDone: 0,
    pronunciationRated: 0, grammarAttempts: {}, diagnosticHistory: [],
    accessibility: {dark:false, contrast:false, simple:false, motion:false, font:1}
  };
  let store = loadStore();
  let voices = [];
  let currentPracticeMode = 'definition';
  let practiceSession = null;
  let flashSession = null;
  let diagnosticSession = null;

  function loadStore(){
    try { return {...defaultStore, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')}; }
    catch { return structuredClone(defaultStore); }
  }
  function saveStore(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); updateSavedCounters(); }
  const qs = (s, root=document) => root.querySelector(s);
  const qsa = (s, root=document) => [...root.querySelectorAll(s)];
  const topicById = id => TOPICS.find(t => t.id === id);
  const grammarById = id => GRAMMAR.find(g => g.id === id);
  const escapeHtml = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  function toast(message){
    const el = qs('#toast'); el.textContent = message; el.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('show'), 1900);
  }

  function setView(name, pushHash=true){
    qsa('.view').forEach(v => v.classList.toggle('active', v.dataset.viewPanel === name));
    qsa('.main-nav>button[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === name));
    qsa('.main-nav details').forEach(d => d.open = false);
    if(pushHash) history.replaceState(null,'','#'+name);
    if(name === 'myvocab') renderMyVocab();
    if(name === 'progress') renderProgress();
    if(name === 'diagnostic') renderDiagnosticHistory();
    window.scrollTo({top:0, behavior: document.body.classList.contains('reduce-motion') ? 'auto' : 'smooth'});
  }

  function initNavigation(){
    document.addEventListener('click', e => {
      const viewButton = e.target.closest('[data-view]');
      if(viewButton && viewButton.dataset.view){ setView(viewButton.dataset.view); }
    });
    const hash = location.hash.replace('#','');
    if(hash && qs(`[data-view-panel="${CSS.escape(hash)}"]`)) setView(hash,false);
  }

  function applyAccessibility(){
    const a = store.accessibility || defaultStore.accessibility;
    document.body.classList.toggle('dark', !!a.dark);
    document.body.classList.toggle('high-contrast', !!a.contrast);
    document.body.classList.toggle('simple', !!a.simple);
    document.body.classList.toggle('reduce-motion', !!a.motion);
    document.documentElement.style.setProperty('--font-scale', a.font || 1);
  }
  function initAccessibility(){
    applyAccessibility();
    qs('#accessibilityToggle').addEventListener('click', () => {
      const p = qs('#accessibilityPanel'); p.hidden = !p.hidden;
      qs('#accessibilityToggle').setAttribute('aria-expanded', String(!p.hidden));
    });
    qs('#accessibilityPanel').addEventListener('click', e => {
      const btn = e.target.closest('[data-access]'); if(!btn) return;
      const a = store.accessibility;
      const action = btn.dataset.access;
      if(action === 'fontUp') a.font = Math.min(1.3, +(a.font + .1).toFixed(1));
      if(action === 'fontDown') a.font = Math.max(.9, +(a.font - .1).toFixed(1));
      if(action === 'dark') a.dark = !a.dark;
      if(action === 'contrast') a.contrast = !a.contrast;
      if(action === 'simple') a.simple = !a.simple;
      if(action === 'motion') a.motion = !a.motion;
      saveStore(); applyAccessibility();
    });
  }

  function initSpeech(){
    if(!('speechSynthesis' in window)) return;
    const refresh = () => { voices = speechSynthesis.getVoices(); };
    refresh(); speechSynthesis.onvoiceschanged = refresh;
  }
  function speak(text){
    if(!('speechSynthesis' in window)){ toast('Speech synthesis is not available in this browser.'); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/\s*\/\s*/g, '. '));
    const british = voices.find(v => /^en-GB/i.test(v.lang)) || voices.find(v => /^en/i.test(v.lang));
    if(british) u.voice = british;
    u.lang = british?.lang || 'en-GB'; u.rate = .86;
    speechSynthesis.speak(u);
  }

  function illustration(key, label=''){
    const common = `viewBox="0 0 180 140" role="img" aria-label="${escapeHtml(label)} illustration"`;
    const ink='#123044', teal='#14b8a6', coral='#fb7185', blue='#38bdf8', lime='#84cc16';
    const labelSvg = `<text x="90" y="130" text-anchor="middle" font-size="10" font-weight="700" fill="${ink}">${escapeHtml(label.split('/')[0].trim()).slice(0,22)}</text>`;
    const maps = {
      body:`<svg ${common}><circle cx="90" cy="25" r="15" fill="none" stroke="${ink}" stroke-width="5"/><path d="M90 42v48M55 63l35-17 36 17M90 90l-28 31M90 90l30 31" fill="none" stroke="${ink}" stroke-width="6" stroke-linecap="round"/><path d="M58 62l-12 32M124 62l13 32" stroke="${teal}" stroke-width="8" stroke-linecap="round"/>${labelSvg}</svg>`,
      skeleton:`<svg ${common}><circle cx="90" cy="21" r="13" fill="none" stroke="${ink}" stroke-width="4"/><path d="M90 34v54M69 45h42M76 50l14 18 14-18M90 88l-17 33M90 88l17 33" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round"/><path d="M68 55l-22 25M112 55l22 25" stroke="${coral}" stroke-width="6" stroke-linecap="round"/>${labelSvg}</svg>`,
      joint:`<svg ${common}><path d="M45 38h40c15 0 22 12 22 24v9c0 12 8 24 24 24h10" fill="none" stroke="${ink}" stroke-width="12" stroke-linecap="round"/><circle cx="108" cy="75" r="17" fill="#fff" stroke="${teal}" stroke-width="6"/><path d="M48 105c28 18 64 17 87-8" fill="none" stroke="${coral}" stroke-width="5" stroke-linecap="round"/><path d="M126 91l11 6-8 10" fill="none" stroke="${coral}" stroke-width="5"/>${labelSvg}</svg>`,
      muscle:`<svg ${common}><path d="M42 72c22-15 28-36 45-35 15 1 13 18 28 20 11 1 16-6 25-1 12 7 11 27 0 35-14 11-35 1-53 7-17 5-29 3-45-6" fill="#fff" stroke="${ink}" stroke-width="5"/><path d="M67 78c7-23 27-34 44-18 8 8 15 16 28 13" fill="none" stroke="${coral}" stroke-width="10" stroke-linecap="round"/>${labelSvg}</svg>`,
      lungs:`<svg ${common}><path d="M88 29v28" stroke="${ink}" stroke-width="6" stroke-linecap="round"/><path d="M88 52l-18 13m18-13 19 13" stroke="${ink}" stroke-width="5"/><path d="M70 57c-20 2-29 20-27 40 2 18 14 24 26 17 9-6 12-20 12-39 0-11-2-18-11-18Zm37 0c20 2 29 20 27 40-2 18-14 24-26 17-9-6-12-20-12-39 0-11 2-18 11-18Z" fill="#ecfeff" stroke="${teal}" stroke-width="5"/><path d="M58 103c17 10 45 11 63 0" fill="none" stroke="${coral}" stroke-width="5"/>${labelSvg}</svg>`,
      vessel:`<svg ${common}><path d="M83 43c-12-23-42-10-37 14 4 19 26 33 44 49 18-16 40-30 44-49 5-24-25-37-37-14-4 8-10 8-14 0Z" fill="#fff1f2" stroke="${coral}" stroke-width="5"/><path d="M90 102v18M90 102l-31 17m31-17 31 17" stroke="${teal}" stroke-width="6" stroke-linecap="round"/>${labelSvg}</svg>`,
      digestive:`<svg ${common}><path d="M88 20v32c0 13 19 9 24 20 7 14-2 31-18 28-17-3-26-15-22-30 3-10 9-14 16-18" fill="#fff7ed" stroke="${ink}" stroke-width="5"/><path d="M63 95c9-9 44-9 53 0 9 9-3 19-14 13-10-5-19-5-29 0-11 6-20-5-10-13Z" fill="#ecfeff" stroke="${teal}" stroke-width="5"/>${labelSvg}</svg>`,
      injury:`<svg ${common}><path d="M50 77h80" stroke="${ink}" stroke-width="14" stroke-linecap="round"/><path d="M79 49l24 56M103 49l-24 56" stroke="${coral}" stroke-width="6"/><path d="M136 49c10 11 13 23 8 35" fill="none" stroke="${blue}" stroke-width="5" stroke-linecap="round"/>${labelSvg}</svg>`,
      assessment:`<svg ${common}><path d="M52 105V48h76v57" fill="#fff" stroke="${ink}" stroke-width="5"/><path d="M63 92l20-19 16 11 22-27" fill="none" stroke="${teal}" stroke-width="6" stroke-linecap="round"/><circle cx="63" cy="92" r="5" fill="${coral}"/><circle cx="83" cy="73" r="5" fill="${coral}"/><circle cx="99" cy="84" r="5" fill="${coral}"/><circle cx="121" cy="57" r="5" fill="${coral}"/>${labelSvg}</svg>`,
      rehab:`<svg ${common}><path d="M67 28v87M114 28v87M60 28h14M107 28h14M67 61h47" stroke="${ink}" stroke-width="6" stroke-linecap="round"/><path d="M54 95c20-17 49-17 72 0" fill="none" stroke="${lime}" stroke-width="7" stroke-linecap="round"/>${labelSvg}</svg>`
    };
    return maps[key] || maps.body;
  }

  function updateSavedCounters(){
    const n = store.saved.length;
    const nav = qs('#savedCountNav'); if(nav) nav.textContent = n;
  }

  function renderHome(){
    qs('#homeTermCount').textContent = VOCAB.length;
    qs('#homeGrammarCount').textContent = GRAMMAR.length;
    qs('#homeTopicCount').textContent = TOPICS.length;
    qs('#topicPreview').innerHTML = TOPICS.map(t => `<button class="topic-card" data-topic-jump="${t.id}"><span class="topic-icon">${t.icon}</span><strong>${t.name}</strong><span>${t.desc}</span></button>`).join('');
    qs('#topicPreview').addEventListener('click', e => {
      const b = e.target.closest('[data-topic-jump]'); if(!b) return;
      qs('#vocabTopic').value = b.dataset.topicJump; renderVocabulary(); setView('vocabulary');
    });
    qs('#fiveWordsBtn').addEventListener('click', () => { setView('pronunciation'); renderPronunciationWorkout(); });
  }

  function populateTopicSelects(){
    const options = `<option value="all">All topics</option>` + TOPICS.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
    ['#vocabTopic','#flashTopic','#practiceTopic'].forEach(id => { qs(id).innerHTML = options; });
  }

  function vocabCard(v){
    const saved = store.saved.includes(v.id);
    return `<article class="vocab-card" data-vocab-id="${v.id}">
      <div class="vocab-visual">${illustration(v.visual,v.term)}</div>
      <div class="vocab-body">
        <div class="vocab-top"><div><h3>${v.term}</h3><div class="vocab-meta">${topicById(v.topic).icon} ${topicById(v.topic).name} · ${v.level}</div></div>
        <div><button class="pronounce-btn" data-speak="${escapeHtml(v.term)}" aria-label="Hear ${escapeHtml(v.term)}">🔊</button> <button class="save-btn ${saved?'saved':''}" data-save="${v.id}" aria-label="Save ${escapeHtml(v.term)}">${saved?'♥':'♡'}</button></div></div>
        <p class="definition">${v.definition}</p><p class="translation">🇫🇷 ${v.fr}</p><p class="example">“${v.example}”</p>
      </div></article>`;
  }

  function renderVocabulary(){
    const search = qs('#vocabSearch').value.trim().toLowerCase();
    const topic = qs('#vocabTopic').value || 'all'; const level = qs('#vocabLevel').value || 'all';
    const rows = VOCAB.filter(v => (topic==='all'||v.topic===topic) && (level==='all'||v.level===level) && (!search || [v.term,v.fr,v.definition,v.example].join(' ').toLowerCase().includes(search)));
    qs('#vocabCountPill').textContent = `${rows.length} term${rows.length===1?'':'s'}`;
    qs('#vocabGrid').innerHTML = rows.length ? rows.map(vocabCard).join('') : '<div class="empty-state">No matching terms.</div>';
  }

  function initVocabulary(){
    ['#vocabSearch','#vocabTopic','#vocabLevel'].forEach(id => qs(id).addEventListener(id==='#vocabSearch'?'input':'change',renderVocabulary));
    qs('#randomWordBtn').addEventListener('click', () => {
      const v = VOCAB[Math.floor(Math.random()*VOCAB.length)];
      qs('#vocabSearch').value = v.term.split('/')[0].trim(); qs('#vocabTopic').value='all'; qs('#vocabLevel').value='all'; renderVocabulary();
    });
    document.addEventListener('click', e => {
      const s = e.target.closest('[data-speak]'); if(s){ speak(s.dataset.speak); return; }
      const b = e.target.closest('[data-save]'); if(b){
        const id=b.dataset.save; const idx=store.saved.indexOf(id); if(idx>=0) store.saved.splice(idx,1); else store.saved.push(id);
        saveStore(); renderVocabulary(); if(qs('#view-myvocab').classList.contains('active')) renderMyVocab(); toast(idx>=0?'Removed from My Vocabulary':'Saved to My Vocabulary');
      }
    });
  }

  function initDictionary(){
    const input=qs('#dictionarySearch');
    function render(){
      const q=input.value.trim().toLowerCase();
      if(q.length<2){ qs('#dictionaryResults').className='dictionary-results empty-state'; qs('#dictionaryResults').textContent='Start typing to search.'; return; }
      const results=VOCAB.filter(v=>[v.term,v.fr,v.definition,v.example].join(' ').toLowerCase().includes(q)).slice(0,20);
      qs('#dictionaryResults').className='dictionary-results';
      qs('#dictionaryResults').innerHTML=results.length?results.map(v=>`<article class="dictionary-entry"><div class="vocab-top"><div><h3>${v.term}</h3><span class="translation">🇫🇷 ${v.fr}</span></div><button class="pronounce-btn" data-speak="${escapeHtml(v.term)}">🔊 Hear it</button></div><p>${v.definition}</p><p class="example">“${v.example}”</p><span class="pill">${topicById(v.topic).name}</span></article>`).join(''):'<div class="empty-state">No match.</div>';
    }
    input.addEventListener('input',render);
    qs('#dictionaryRandom').addEventListener('click',()=>{const v=VOCAB[Math.floor(Math.random()*VOCAB.length)];input.value=v.term.split('/')[0].trim();render();});
  }

  function renderGrammar(){
    qs('#grammarGrid').innerHTML = GRAMMAR.map(g => `<article class="grammar-card" id="grammar-${g.id}">
      <div class="grammar-head"><div><h3>${g.icon} ${g.title}</h3><p>${g.focus}</p></div><span class="pill">${g.level}</span></div>
      <div class="grammar-content">
        <div class="lesson-box"><h4>1 · Concise lesson</h4><ul>${g.rules.map(r=>`<li>${r}</li>`).join('')}</ul><div class="lesson-examples">${g.examples.map(x=>`<span>${x}</span>`).join('')}</div></div>
        <div class="video-box"><h4>2 · Video</h4><div class="video-placeholder" data-video-slot="${g.id}"><button class="primary" data-load-video="${g.id}">▶ Load video</button><p>${g.videoTitle}</p></div><p class="video-credit">Video: BBC Learning English · loaded only when you choose to play it.</p></div>
        <div class="quiz-box"><h4>3 · Physiotherapy recap quiz</h4><div data-grammar-quiz="${g.id}">${g.quiz.map((q,i)=>`<div class="quiz-question" data-q-index="${i}"><strong>${i+1}. ${q.q}</strong><div class="option-row">${q.opts.map((o,j)=>`<button class="option-btn" data-grammar-answer="${g.id}:${i}:${j}">${o}</button>`).join('')}</div><div class="feedback" aria-live="polite"></div></div>`).join('')}</div></div>
      </div></article>`).join('');
  }

  function initGrammar(){
    qs('#grammarGrid').addEventListener('click', e => {
      const load=e.target.closest('[data-load-video]');
      if(load){ const g=grammarById(load.dataset.loadVideo); const slot=qs(`[data-video-slot="${g.id}"]`); slot.innerHTML=`<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/${g.videoId}" title="${escapeHtml(g.videoTitle)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`; return; }
      const ans=e.target.closest('[data-grammar-answer]'); if(!ans) return;
      const [gid,qi,oi]=ans.dataset.grammarAnswer.split(':'); const g=grammarById(gid); const q=g.quiz[+qi]; const wrap=ans.closest('.quiz-question');
      qsa('.option-btn',wrap).forEach((b,j)=>{b.disabled=true;b.classList.toggle('correct',j===q.a); if(j===+oi && j!==q.a)b.classList.add('wrong');});
      qs('.feedback',wrap).textContent=(+oi===q.a?'✓ Correct. ':'✕ Not quite. ')+q.why;
      store.grammarAttempts[gid]=(store.grammarAttempts[gid]||0)+1; saveStore();
    });
  }

  function stressCue(term){
    const cues={dorsiflexion:'dor-si-FLEX-ion',quadriceps:'QUAD-ri-ceps',oesophagus:'oe-SOPH-a-gus',circulation:'cir-cu-LA-tion',mobility:'mo-BIL-i-ty',assessment:'as-SESS-ment',rehabilitation:'re-ha-bil-i-TA-tion',diaphragm:'DI-a-phragm',abdominal:'ab-DOM-i-nal',resistance:'re-SIS-tance'};
    return cues[term]||term;
  }
  function renderPronunciationWorkout(){
    const picks=[...VOCAB].sort(()=>Math.random()-.5).slice(0,5);
    qs('#pronunciationWorkout').innerHTML=picks.map(v=>`<article class="pron-card"><div class="vocab-visual">${illustration(v.visual,v.term)}</div><strong>${v.term}</strong><small>${stressCue(v.term.split('/')[0].trim())}</small><br><button class="primary" data-speak="${escapeHtml(v.term)}">🔊 Hear it</button></article>`).join('');
  }
  function initPronunciation(){
    const stress=['dorsiflexion','quadriceps','oesophagus','circulation','mobility','assessment','rehabilitation','diaphragm','abdominal','resistance'];
    qs('#stressWords').innerHTML=stress.map(w=>`<button class="speech-chip" data-speak="${w}">${stressCue(w)} 🔊</button>`).join('');
    qs('#newPronunciationWorkout').addEventListener('click',()=>{store.pronunciationRated++;saveStore();renderPronunciationWorkout();});
    renderPronunciationWorkout();
  }

  function newFlashSession(){
    const topic=qs('#flashTopic').value; const size=+qs('#flashSize').value;
    const pool=VOCAB.filter(v=>topic==='all'||v.topic===topic).sort(()=>Math.random()-.5).slice(0,size);
    flashSession={cards:pool,index:0,revealed:false}; renderFlashcard();
  }
  function renderFlashcard(){
    if(!flashSession||!flashSession.cards.length){qs('#flashcardArea').innerHTML='<div class="empty-state">No cards available.</div>';return;}
    if(flashSession.index>=flashSession.cards.length){qs('#flashcardArea').innerHTML='<div class="flashcard"><h3>Session complete ✓</h3><p>Good work. Start another session whenever you want.</p></div>';return;}
    const v=flashSession.cards[flashSession.index];
    qs('#flashcardArea').className='flashcard-area';
    qs('#flashcardArea').innerHTML=`<article class="flashcard"><div class="scoreline"><span>${flashSession.index+1} / ${flashSession.cards.length}</span><span>${topicById(v.topic).name}</span></div><div class="front">${v.term}</div><button class="pronounce-btn" data-speak="${escapeHtml(v.term)}">🔊</button>${flashSession.revealed?`<div class="back"><p>${v.definition}</p><p class="translation">🇫🇷 ${v.fr}</p><p class="example">“${v.example}”</p><div class="rating-row"><button class="secondary" data-flash-rate="again">↻ Again</button><button class="secondary" data-flash-rate="hard">◐ Hard</button><button class="primary" data-flash-rate="got">✓ Got it</button></div></div>`:`<p><button class="primary" id="revealFlash">Reveal meaning</button></p>`}</article>`;
    const rev=qs('#revealFlash'); if(rev)rev.addEventListener('click',()=>{flashSession.revealed=true;renderFlashcard();});
  }
  function initFlashcards(){
    qs('#newFlashSession').addEventListener('click',newFlashSession);
    qs('#flashcardArea').addEventListener('click',e=>{const b=e.target.closest('[data-flash-rate]');if(!b)return;const v=flashSession.cards[flashSession.index];store.flashSeen++;if(b.dataset.flashRate==='got'&&!store.mastered.includes(v.id))store.mastered.push(v.id);saveStore();flashSession.index++;flashSession.revealed=false;renderFlashcard();});
  }

  const PRACTICE_MODES=[
    {id:'definition',icon:'🕵️',title:'Definition Detective',desc:'Read a clinical definition and identify the term.'},
    {id:'fr',icon:'🇫🇷',title:'French → English',desc:'Turn the French equivalent back into professional English.'},
    {id:'audio',icon:'🎧',title:'Listen & Spot',desc:'Listen to a term, then choose what you heard.'},
    {id:'context',icon:'🩺',title:'Clinical Gap',desc:'Choose the term that best completes a clinical sentence.'}
  ];
  function renderGameModes(){qs('#gameModes').innerHTML=PRACTICE_MODES.map(m=>`<button class="game-mode ${m.id===currentPracticeMode?'active':''}" data-game-mode="${m.id}"><span>${m.icon}</span><strong>${m.title}</strong><small>${m.desc}</small></button>`).join('');}
  function practiceQuestion(v,pool){
    const distract=pool.filter(x=>x.id!==v.id).slice().sort(()=>Math.random()-.5).slice(0,3);let opts=[v,...distract].sort(()=>Math.random()-.5);let prompt='';
    if(currentPracticeMode==='definition')prompt=v.definition;
    if(currentPracticeMode==='fr')prompt=`🇫🇷 ${v.fr}`;
    if(currentPracticeMode==='audio')prompt=`<button class="primary" data-speak="${escapeHtml(v.term)}">🔊 Play the word</button>`;
    if(currentPracticeMode==='context')prompt=v.example.replace(new RegExp(v.term.split('/')[0].trim().replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'),'________');
    return {v,opts,prompt};
  }
  function startPractice(){
    const topic=qs('#practiceTopic').value,size=+qs('#practiceSize').value;const pool=VOCAB.filter(v=>topic==='all'||v.topic===topic);const chosen=pool.slice().sort(()=>Math.random()-.5).slice(0,size);practiceSession={pool,questions:chosen.map(v=>practiceQuestion(v,pool)),index:0,correct:0,answered:false};renderPractice();
  }
  function renderPractice(){
    if(!practiceSession)return;
    if(practiceSession.index>=practiceSession.questions.length){qs('#practiceArea').className='quiz-shell';qs('#practiceArea').innerHTML=`<div class="practice-card"><h3>Session complete</h3><p><strong>${practiceSession.correct}/${practiceSession.questions.length}</strong> correct.</p><button class="primary" id="practiceAgain">Play again</button></div>`;qs('#practiceAgain').onclick=startPractice;store.practiceDone++;saveStore();return;}
    const q=practiceSession.questions[practiceSession.index];qs('#practiceArea').className='quiz-shell';qs('#practiceArea').innerHTML=`<div class="practice-card"><div class="scoreline"><span>Question ${practiceSession.index+1}/${practiceSession.questions.length}</span><span>✓ ${practiceSession.correct}</span></div><h3>${q.prompt}</h3><div class="answer-grid">${q.opts.map(o=>`<button class="answer-btn" data-practice-answer="${o.id}">${o.term}</button>`).join('')}</div><div class="feedback" id="practiceFeedback"></div><p><button class="primary" id="nextPractice" hidden>Next →</button></p></div>`;
  }
  function initPractice(){
    renderGameModes();qs('#gameModes').addEventListener('click',e=>{const b=e.target.closest('[data-game-mode]');if(!b)return;currentPracticeMode=b.dataset.gameMode;renderGameModes();});qs('#startPractice').addEventListener('click',startPractice);
    qs('#practiceArea').addEventListener('click',e=>{
      const a=e.target.closest('[data-practice-answer]');if(a&&!practiceSession.answered){const q=practiceSession.questions[practiceSession.index],correct=a.dataset.practiceAnswer===q.v.id;practiceSession.answered=true;if(correct)practiceSession.correct++;qsa('.answer-btn',a.parentElement).forEach(b=>{b.disabled=true;if(b.dataset.practiceAnswer===q.v.id)b.classList.add('correct');else if(b===a)b.classList.add('wrong');});qs('#practiceFeedback').textContent=correct?'✓ Correct.':`✕ Answer: ${q.v.term}.`;qs('#nextPractice').hidden=false;}
      if(e.target.closest('#nextPractice')){practiceSession.index++;practiceSession.answered=false;renderPractice();}
    });
  }

  function deterministicOptions(correct, candidates, offset){
    const unique=[correct,...candidates.filter(x=>x!==correct)].slice(0,4);while(unique.length<4)unique.push('—');const pos=offset%4;const arr=unique.slice(1);arr.splice(pos,0,correct);return arr.slice(0,4);
  }
  function buildDiagnosticQuestions(){
    const out=[];
    TOPICS.forEach((t,ti)=>{
      const terms=VOCAB.filter(v=>v.topic===t.id);const v1=terms[0],v2=terms[1];
      let opts1=deterministicOptions(v1.term,terms.slice(1).map(x=>x.term),ti);out.push({areaType:'vocab',areaId:t.id,areaName:t.name,q:v1.definition,opts:opts1,a:opts1.indexOf(v1.term),label:'Definition → English'});
      let opts2=deterministicOptions(v2.term,terms.filter(x=>x.id!==v2.id).map(x=>x.term),ti+1);out.push({areaType:'vocab',areaId:t.id,areaName:t.name,q:`🇫🇷 ${v2.fr}`,opts:opts2,a:opts2.indexOf(v2.term),label:'French → English'});
    });
    GRAMMAR.forEach(g=>g.quiz.slice(0,2).forEach(q=>out.push({areaType:'grammar',areaId:g.id,areaName:g.title,q:q.q,opts:q.opts,a:q.a,label:'Grammar'})));
    return out;
  }
  function startDiagnostic(){diagnosticSession={questions:buildDiagnosticQuestions(),index:0,answers:[]};renderDiagnosticQuestion();}
  function renderDiagnosticQuestion(){
    const area=qs('#diagnosticArea');const s=diagnosticSession;
    if(s.index>=s.questions.length){finishDiagnostic();return;}
    const q=s.questions[s.index],pct=Math.round(s.index/s.questions.length*100);area.innerHTML=`<div class="progress-bar"><span style="width:${pct}%"></span></div><article class="diagnostic-question"><div class="scoreline"><span>Question ${s.index+1}/${s.questions.length}</span><span>${q.areaName}</span></div><span class="pill">${q.label}</span><h3>${q.q}</h3><div class="answer-grid">${q.opts.map((o,i)=>`<button class="answer-btn" data-diagnostic-answer="${i}">${o}</button>`).join('')}</div><p><button class="primary" id="diagnosticNext" hidden>Next →</button></p></article>`;
  }
  function finishDiagnostic(){
    const qsx=diagnosticSession.questions,answers=diagnosticSession.answers;const groups={};let total=0;
    qsx.forEach((q,i)=>{const ok=answers[i]===q.a;if(ok)total++;const k=q.areaType+':'+q.areaId;if(!groups[k])groups[k]={type:q.areaType,id:q.areaId,name:q.areaName,ok:0,total:0};groups[k].total++;if(ok)groups[k].ok++;});
    const result={date:new Date().toISOString(),score:total,total:qsx.length,groups:Object.values(groups)};store.diagnosticHistory.unshift(result);store.diagnosticHistory=store.diagnosticHistory.slice(0,8);saveStore();diagnosticSession=null;renderDiagnosticResult(result);renderDiagnosticHistory();
  }
  function renderDiagnosticResult(r){
    const vocab=r.groups.filter(g=>g.type==='vocab'),grammar=r.groups.filter(g=>g.type==='grammar');const weak=r.groups.filter(g=>g.ok/g.total<.75).sort((a,b)=>(a.ok/a.total)-(b.ok/b.total));
    const rows=arr=>arr.map(g=>`<div class="result-row"><span>${g.name}</span><div class="meter"><span style="width:${Math.round(g.ok/g.total*100)}%"></span></div><strong>${g.ok}/${g.total}</strong></div>`).join('');
    qs('#diagnosticArea').innerHTML=`<div class="section-block"><p class="eyebrow">Diagnostic complete</p><h2>${r.score}/${r.total} correct</h2><p>This score is a revision signal, not a clinical competence grade.</p><div class="result-grid"><div class="result-group"><h3>🦴 Vocabulary</h3>${rows(vocab)}</div><div class="result-group"><h3>🧩 Grammar</h3>${rows(grammar)}</div></div><h3>Suggested revision</h3>${weak.length?weak.slice(0,7).map(g=>`<div class="recommendation"><strong>${g.name}</strong> · ${g.ok}/${g.total}. <button class="text-btn" data-revise-type="${g.type}" data-revise-id="${g.id}">Open this area →</button></div>`).join(''):'<div class="recommendation"><strong>Balanced result.</strong> Keep revising with flashcards and clinical cases.</div>'}<p><button class="primary" id="retakeDiagnostic">↻ Retake diagnostic</button></p></div>`;
    qs('#retakeDiagnostic').onclick=startDiagnostic;
  }
  function renderDiagnosticHistory(){
    const h=store.diagnosticHistory;qs('#diagnosticHistory').innerHTML=`<h3>Previous attempts</h3>${h.length?h.map(r=>`<p><strong>${new Date(r.date).toLocaleDateString()}</strong> · ${r.score}/${r.total} (${Math.round(r.score/r.total*100)}%)</p>`).join(''):'<p>No completed diagnostic yet.</p>'}`;
  }
  function initDiagnostic(){
    qs('#startDiagnostic').addEventListener('click',startDiagnostic);
    qs('#diagnosticArea').addEventListener('click',e=>{
      const a=e.target.closest('[data-diagnostic-answer]');if(a&&diagnosticSession){qsa('.answer-btn',a.parentElement).forEach(b=>b.classList.remove('selected'));a.classList.add('selected');diagnosticSession.answers[diagnosticSession.index]=+a.dataset.diagnosticAnswer;qs('#diagnosticNext').hidden=false;}
      if(e.target.closest('#diagnosticNext')&&diagnosticSession){diagnosticSession.index++;renderDiagnosticQuestion();}
      const r=e.target.closest('[data-revise-type]');if(r){if(r.dataset.reviseType==='vocab'){qs('#vocabTopic').value=r.dataset.reviseId;renderVocabulary();setView('vocabulary');}else{setView('grammar');setTimeout(()=>qs('#grammar-'+r.dataset.reviseId)?.scrollIntoView({behavior:'smooth'}),100);}}
    });
    renderDiagnosticHistory();
  }

  function renderCases(){qs('#caseGrid').innerHTML=CLINICAL_CASES.map(c=>`<article class="case-card"><div class="case-icon">${c.icon}</div><div class="case-meta"><span>${c.area}</span><span>${c.difficulty}</span></div><h3>${c.title}</h3><p>${c.brief}</p><details><summary><strong>Open tasks</strong></summary><ol>${c.tasks.map(t=>`<li>${t}</li>`).join('')}</ol></details></article>`).join('');}
  function renderCommunication(){qs('#communicationGrid').innerHTML=COMMUNICATION.map(c=>`<article class="comm-card"><div class="case-icon">${c.icon}</div><h3>${c.title}</h3><ul>${c.lines.map(l=>`<li>${l}</li>`).join('')}</ul></article>`).join('');}

  function renderMyVocab(){
    const items=VOCAB.filter(v=>store.saved.includes(v.id));qs('#myVocabStats').innerHTML=`<div class="stat-box"><strong>${items.length}</strong><span>saved words</span></div><div class="stat-box"><strong>${store.mastered.filter(id=>store.saved.includes(id)).length}</strong><span>mastered</span></div><div class="stat-box"><strong>${items.filter(v=>v.level.includes('B2')).length}</strong><span>B2-level items</span></div><div class="stat-box"><strong>${new Set(items.map(v=>v.topic)).size}</strong><span>topics represented</span></div>`;
    qs('#myVocabGrid').innerHTML=items.length?items.map(vocabCard).join(''):'<div class="empty-state">Save words from Vocabulary to build your personal list.</div>';
  }
  function initMyVocab(){qs('#clearSaved').addEventListener('click',()=>{if(confirm('Clear all saved vocabulary on this device?')){store.saved=[];saveStore();renderMyVocab();renderVocabulary();}});}

  function renderProgress(){
    const latest=store.diagnosticHistory[0];qs('#progressStats').innerHTML=`<div class="stat-box"><strong>${store.saved.length}</strong><span>saved words</span></div><div class="stat-box"><strong>${store.flashSeen}</strong><span>flashcards rated</span></div><div class="stat-box"><strong>${store.practiceDone}</strong><span>practice sessions</span></div><div class="stat-box"><strong>${latest?Math.round(latest.score/latest.total*100)+'%':'—'}</strong><span>latest diagnostic</span></div>`;
    let rec='<p class="eyebrow">What should I work on next?</p><h2>Revision shortcuts</h2>';
    if(latest){const weak=latest.groups.filter(g=>g.ok/g.total<.75).sort((a,b)=>(a.ok/a.total)-(b.ok/b.total)).slice(0,5);rec+=weak.length?weak.map(g=>`<div class="recommendation"><strong>${g.name}</strong> · diagnostic ${g.ok}/${g.total}. <button class="text-btn" data-revise-type="${g.type}" data-revise-id="${g.id}">Revise →</button></div>`).join(''):'<div class="recommendation">Your latest diagnostic was balanced. Use flashcards, pronunciation and cases for maintenance.</div>';}else rec+='<div class="recommendation">Take the diagnostic first. It covers every topic and builds a revision plan.</div><button class="primary" data-view="diagnostic">Take diagnostic</button>';
    qs('#progressRecommendations').innerHTML=rec;
    qs('#progressRecommendations').onclick=e=>{const r=e.target.closest('[data-revise-type]');if(!r)return;if(r.dataset.reviseType==='vocab'){qs('#vocabTopic').value=r.dataset.reviseId;renderVocabulary();setView('vocabulary');}else{setView('grammar');setTimeout(()=>qs('#grammar-'+r.dataset.reviseId)?.scrollIntoView({behavior:'smooth'}),100);}};
  }

  function initPWA(){
    if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
    let deferredPrompt=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;qs('#installBtn').hidden=false;});
    qs('#installBtn').addEventListener('click',async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;qs('#installBtn').hidden=true;});
  }

  function bindGlobalSelectedStyle(){
    const style=document.createElement('style');style.textContent='.answer-btn.selected{border:2px solid #0f766e;background:#ecfeff;box-shadow:0 0 0 2px rgba(20,184,166,.12)} body.dark .answer-btn.selected{background:#123b3b}';document.head.appendChild(style);
  }

  function init(){
    populateTopicSelects(); initNavigation(); initAccessibility(); initSpeech(); renderHome(); initVocabulary(); renderVocabulary(); initDictionary(); renderGrammar(); initGrammar(); initPronunciation(); initFlashcards(); initPractice(); initDiagnostic(); renderCases(); renderCommunication(); initMyVocab(); renderProgress(); updateSavedCounters(); initPWA(); bindGlobalSelectedStyle();
  }
  document.addEventListener('DOMContentLoaded',init);
})();
