(function () {
  'use strict';

  const navLinks   = document.querySelectorAll('.nav-link[data-section]');
  const sections   = document.querySelectorAll('.section');
  const nav        = document.querySelector('.nav');

  function showSection(id) {
    sections.forEach(s => s.classList.remove('active'));
    navLinks.forEach(l => l.classList.remove('active'));
    const target = document.getElementById(id);
    const link   = document.querySelector(`.nav-link[data-section="${id}"]`);
    if (target) { target.classList.add('active'); window.scrollTo({ top: 0, behavior: 'instant' }); }
    if (link)   link.classList.add('active');
    setTimeout(observeAnimations, 60);
    setTimeout(observeCounters, 80);
  }

  navLinks.forEach(l => l.addEventListener('click', () => showSection(l.dataset.section)));
  document.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', () => showSection(el.dataset.goto));
  });

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });

  let animIO = null;
  function observeAnimations() {
    if (animIO) animIO.disconnect();
    animIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); animIO.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.section.active .fade-up, .section.active .stagger')
      .forEach(el => animIO.observe(el));
  }

  let counterIO = null;
  function observeCounters() {
    if (counterIO) counterIO.disconnect();
    counterIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        if (el.dataset.counted) return;
        el.dataset.counted = '1';
        const target   = parseFloat(el.dataset.count);
        const suffix   = el.dataset.suffix || '';
        const decimal  = el.dataset.count.includes('.');
        const dur      = 1400;
        const t0       = performance.now();
        const step = now => {
          const p = Math.min((now - t0) / dur, 1);
          const v = (1 - Math.pow(1 - p, 3)) * target;
          el.textContent = (decimal ? v.toFixed(1) : Math.round(v)) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        counterIO.unobserve(el);
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.section.active [data-count]')
      .forEach(el => counterIO.observe(el));
  }

  document.querySelectorAll('.btn-accent, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width  / 2;
      const y = e.clientY - r.top  - r.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px) scale(1.04)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  document.querySelectorAll('.overview-card[data-goto]').forEach(card => {
    card.style.cursor = 'pointer';
  });

  /* ─────────────────────────────────────────────
     PHONE DEMO — Multi-turn Quick-Check (3 rodadas)
  ───────────────────────────────────────────── */
  var PHONE_DATA = {
    labels: [
      'Como você inicia o Quick-Check?',
      'Qual é o seu próximo ponto?',
      'Como você encerra a conversa?'
    ],
    rounds: [
      /* Rodada 1 — abertura (4 opções) */
      [
        {
          btn:   'Vim preparado com os principais pontos da semana',
          user:  { text: 'Vim preparado — trouxe os principais pontos para discutirmos.', ts: '10:02' },
          reply: { text: 'Ótima postura! Organização reflete diretamente nos resultados. Me conte os destaques: o que avançou bem e o que precisa de atenção?', ts: '10:03' }
        },
        {
          btn:   'Entreguei tudo no prazo — semana muito produtiva',
          user:  { text: 'Fechei todas as entregas no prazo. Foi uma semana bastante produtiva.', ts: '10:02' },
          reply: { text: 'Excelente! Consistência como essa impacta diretamente os indicadores do time. O que contribuiu para esse desempenho?', ts: '10:03' }
        },
        {
          btn:   'Preciso comunicar um imprevisto em uma entrega',
          user:  { text: 'Preciso comunicar um imprevisto em uma entrega importante.', ts: '10:02' },
          reply: { text: 'Obrigado pela transparência — esse é exatamente o comportamento esperado. Me conte o que ocorreu para endereçarmos juntos ainda hoje.', ts: '10:03' }
        },
        {
          btn:   'Precisamos alinhar as prioridades do próximo ciclo',
          user:  { text: 'Seria importante alinharmos as prioridades do próximo ciclo.', ts: '10:02' },
          reply: { text: 'Visão estratégica. Tenho clareza dos objetivos e quero garantir que você tenha todas as informações para agir com foco.', ts: '10:03' }
        }
      ],
      /* Rodada 2 — aprofundamento (3 opções) */
      [
        {
          btn:   'Quais são as prioridades para a próxima semana?',
          user:  { text: 'Quais são as prioridades concretas para a próxima semana?', ts: '10:06' },
          reply: { text: 'As três frentes prioritárias são: módulo B, alinhamento com RH e revisão de processos. Qual delas precisa de mais clareza da minha parte?', ts: '10:07' }
        },
        {
          btn:   'Tenho uma sugestão de melhoria de processo',
          user:  { text: 'Tenho uma sugestão de melhoria para o processo de revisão.', ts: '10:06' },
          reply: { text: 'Postura proativa como essa é diferencial de alta performance. Me envie por escrito até amanhã — quero levar para a reunião de líderes.', ts: '10:07' }
        },
        {
          btn:   'Preciso de mais visibilidade no projeto Y',
          user:  { text: 'Preciso de mais visibilidade sobre o andamento do projeto Y.', ts: '10:06' },
          reply: { text: 'Ponto fundamental. Compartilho acesso ao painel de acompanhamento ainda hoje. Visibilidade de progresso é inegociável para uma gestão eficiente.', ts: '10:07' }
        }
      ],
      /* Rodada 3 — encerramento (3 opções) */
      [
        {
          btn:   'Registro as ações e envio o resumo ainda hoje',
          user:  { text: 'Registro as ações acordadas e envio o resumo para confirmação ainda hoje.', ts: '10:10' },
          reply: { text: 'Excelente! Esse cuidado com o registro é um diferencial real de profissionalismo. Agendo o próximo Quick-Check para terça, mesmo horário. Ótima conversa! ✅', ts: '10:11' }
        },
        {
          btn:   'Agendamos o próximo Quick-Check para terça?',
          user:  { text: 'Podemos já agendar o próximo Quick-Check para terça-feira?', ts: '10:10' },
          reply: { text: 'Terça confirmada! Você chega cada vez mais preparado — esse é o espírito certo. Ótimo alinhamento de hoje, até a semana que vem! 👏', ts: '10:11' }
        },
        {
          btn:   'Envio o status atualizado antes de sexta-feira',
          user:  { text: 'Preparo o status atualizado e envio antes de sexta-feira.', ts: '10:10' },
          reply: { text: 'Iniciativa perfeita. Status na sexta garante que a semana que vem comece encaminhada. Obrigado pelo comprometimento — até o próximo Quick-Check! 🎯', ts: '10:11' }
        }
      ]
    ]
  };

  (function initPhoneDemo() {
    var msgsEl    = document.getElementById('phoneMessages');
    var choicesEl = document.getElementById('phoneChoices');
    var labelEl   = document.getElementById('phoneChoicesLabel');
    var headingEl = document.getElementById('phoneChoicesHeading');
    var typingEl  = document.getElementById('phoneTyping');
    var resetBtn  = document.getElementById('phoneReset');
    if (!msgsEl || !choicesEl) return;

    var currentRound = 0;

    function addMsg(dir, text, ts) {
      var div = document.createElement('div');
      div.className = 'phone-msg ' + dir;
      div.innerHTML = '<div class="phone-bubble">' + text + '</div><span class="phone-ts">' + ts + '</span>';
      msgsEl.appendChild(div);
      msgsEl.scrollTop = msgsEl.scrollHeight;
    }

    function showTyping() {
      typingEl.style.display = 'block';
      msgsEl.scrollTop = msgsEl.scrollHeight;
    }

    function hideTyping() {
      typingEl.style.display = 'none';
    }

    function addRoundSep(label) {
      var div = document.createElement('div');
      div.className = 'phone-day-sep';
      div.textContent = label;
      msgsEl.appendChild(div);
      msgsEl.scrollTop = msgsEl.scrollHeight;
    }

    function addBadge() {
      var div = document.createElement('div');
      div.className = 'phone-positive-badge';
      div.textContent = '✓  Quick-Check concluído com sucesso';
      msgsEl.appendChild(div);
      msgsEl.scrollTop = msgsEl.scrollHeight;
    }

    function renderRound(round) {
      if (labelEl) labelEl.textContent = PHONE_DATA.labels[round];
      if (headingEl) headingEl.style.display = '';
      choicesEl.innerHTML = '';
      PHONE_DATA.rounds[round].forEach(function(item, idx) {
        var btn = document.createElement('button');
        btn.className = 'phone-choice';
        btn.textContent = item.btn;
        btn.dataset.idx = String(idx);
        btn.addEventListener('click', function() { handlePick(round, idx); });
        choicesEl.appendChild(btn);
      });
    }

    function handlePick(round, idx) {
      var item = PHONE_DATA.rounds[round][idx];

      /* Lock choices and highlight selected */
      choicesEl.querySelectorAll('.phone-choice').forEach(function(btn) {
        btn.disabled = true;
        if (parseInt(btn.dataset.idx, 10) === idx) btn.classList.add('chosen');
      });

      /* Show user bubble */
      setTimeout(function() {
        addMsg('sent', item.user.text, item.user.ts);
      }, 0);

      /* Typing indicator */
      setTimeout(function() { showTyping(); }, 520);

      /* Gestor reply then transition */
      setTimeout(function() {
        hideTyping();
        addMsg('recv', item.reply.text, item.reply.ts);

        if (round < 2) {
          /* Advance to next round */
          setTimeout(function() {
            currentRound = round + 1;
            var sepLabels = ['', '— Aprofundamento —', '— Encerramento —'];
            addRoundSep(sepLabels[currentRound]);
            renderRound(currentRound);
          }, 750);
        } else {
          /* Final round completed */
          setTimeout(function() {
            addBadge();
            if (headingEl) headingEl.style.display = 'none';
            choicesEl.innerHTML = '';
            resetBtn.style.display = 'flex';
          }, 500);
        }
      }, 1850);
    }

    function resetPhone() {
      msgsEl.innerHTML =
        '<div class="phone-day-sep">Terça-feira · 10:00</div>' +
        '<div class="phone-msg recv">' +
          '<div class="phone-bubble">Oi! Pronto para o Quick-Check de hoje? 😊</div>' +
          '<span class="phone-ts">10:01</span>' +
        '</div>';
      hideTyping();
      resetBtn.style.display = 'none';
      currentRound = 0;
      renderRound(0);
    }

    resetBtn.addEventListener('click', resetPhone);
    renderRound(0);
  }());

  showSection('home');
}());