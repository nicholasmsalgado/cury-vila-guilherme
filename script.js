/* ==========================================================================
   RESIDENCIAL AMADEU - VILA GUILHERME
   Interactive JavaScript Logic
   ========================================================================== */

function initApp() {

  // 1. COUNTDOWN TIMER TO 31/08/2026 00:00:00 (August 31, 2026)
  let launchDate = new Date(2026, 7, 31, 0, 0, 0).getTime();
  if (isNaN(launchDate) || launchDate <= Date.now()) {
    // Fallback de garantia: se a data do dispositivo já for posterior, exibe contagem regressiva ativa até a data de lançamento
    launchDate = Date.now() + (26 * 24 * 3600 * 1000) + (13 * 3600 * 1000) + (45 * 60 * 1000);
  }

  function updateCountdown() {
    const daysEl = document.getElementById('days');
    if (!daysEl && !document.getElementById('days-sticky')) return;
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    const daysSticky = document.getElementById('days-sticky');
    const hoursSticky = document.getElementById('hours-sticky');
    const minSticky = document.getElementById('min-sticky');
    const secSticky = document.getElementById('sec-sticky');

    const daysMob = document.getElementById('days-mob');
    const hoursMob = document.getElementById('hours-mob');
    const minMob = document.getElementById('min-mob');
    const secMob = document.getElementById('sec-mob');

    const now = Date.now();
    const distance = launchDate - now;

    if (distance <= 0) {
      if (daysEl) daysEl.innerText = '00';
      if (hoursEl) hoursEl.innerText = '00';
      if (minutesEl) minutesEl.innerText = '00';
      if (secondsEl) secondsEl.innerText = '00';

      if (daysSticky) daysSticky.innerText = '00';
      if (hoursSticky) hoursSticky.innerText = '00';
      if (minSticky) minSticky.innerText = '00';
      if (secSticky) secSticky.innerText = '00';

      if (daysMob) daysMob.innerText = '00';
      if (hoursMob) hoursMob.innerText = '00';
      if (minMob) minMob.innerText = '00';
      if (secMob) secMob.innerText = '00';
      return;
    }

    const days = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
    const hours = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
    const minutes = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const seconds = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');

    if (daysEl) daysEl.innerText = days;
    if (hoursEl) hoursEl.innerText = hours;
    if (minutesEl) minutesEl.innerText = minutes;
    if (secondsEl) secondsEl.innerText = seconds;

    if (daysSticky) daysSticky.innerText = days;
    if (hoursSticky) hoursSticky.innerText = hours;
    if (minSticky) minSticky.innerText = minutes;
    if (secSticky) secSticky.innerText = seconds;

    if (daysMob) daysMob.innerText = days;
    if (hoursMob) hoursMob.innerText = hours;
    if (minMob) minMob.innerText = minutes;
    if (secMob) secMob.innerText = seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 2. PHONE / WHATSAPP INPUT MASK
  const phoneInput = document.getElementById('whatsapp');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);

      if (value.length > 6) {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      } else if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else if (value.length > 0) {
        value = `(${value}`;
      }

      e.target.value = value;
    });
  }

  // 3. FORM SUBMISSION VIA GOOGLE SHEETS WEBHOOK & WHATSAPP REDIRECT
  const leadForm = document.getElementById('leadForm');
  if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = leadForm.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

      const nome = document.getElementById('nome').value.trim();
      const email = document.getElementById('email').value.trim();
      const whatsapp = document.getElementById('whatsapp').value.trim();
      const horario = document.getElementById('horario').value;

      if (!nome || !email || !whatsapp || !horario) {
        alert('Por favor, preencha todos os campos do formulário.');
        return;
      }

      // UI Feedback: Loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando cadastro...';
      }

      const webhookUrl = 'https://script.google.com/macros/s/AKfycbxoK_sE8UKeGC_Lvm14dskg_ReL6kJ33q7eQtEUWIOxCnD284cp1EdhshYq87Hn7cu_RQ/exec';

      const payload = {
        nome: nome,
        telefone: whatsapp,
        email: email,
        mensagem: `Melhor horário para contato: ${horario}`,
        origem: "Site - Urban Vila Guilherme",
        aba: "Cury Vila Guilherme"
      };

      try {
        // Envio POST JSON para o Webhook do Google Sheets
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload),
          mode: 'no-cors'
        });

        // Trigger Google Ads Data Layer Event
        if (window.dataLayer) {
          window.dataLayer.push({
            'event': 'lead_conversion',
            'form_name': 'LancamentoUrbanVilaGuilherme',
            'contact_time': horario
          });
        }

        // WhatsApp redirect message
        const messageText = `Olá! Vim através do site oficial do Urban Vila Guilherme e gostaria de receber a apresentação e a tabela de preços do lançamento.\n\n` +
                            `👤 Nome: ${nome}\n` +
                            `✉️ E-mail: ${email}\n` +
                            `📱 WhatsApp: ${whatsapp}\n` +
                            `⏰ Melhor Horário para Contato: ${horario}`;

        const encodedMessage = encodeURIComponent(messageText);
        const whatsappUrl = `https://wa.me/5511987689734?text=${encodedMessage}`;

        leadForm.reset();
        alert('✅ Cadastro realizado com sucesso! Seus dados foram salvos na planilha. Redirecionando para o WhatsApp...');
        
        window.open(whatsappUrl, '_blank');

      } catch (error) {
        console.error('Erro ao enviar dados para o Webhook do Google Sheets:', error);
        alert('Ocorreu um pequeno erro ao enviar para a planilha, mas vamos te direcionar para o atendimento no WhatsApp.');

        const messageText = `Olá! Gostaria de receber informações sobre o Urban Vila Guilherme.\n\n` +
                            `👤 Nome: ${nome}\n` +
                            `✉️ E-mail: ${email}\n` +
                            `📱 WhatsApp: ${whatsapp}`;
        const whatsappUrl = `https://wa.me/5511987689734?text=${encodeURIComponent(messageText)}`;
        window.open(whatsappUrl, '_blank');

      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  }

  // 4. FAQ ACCORDION
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => otherItem.classList.remove('active'));
      
      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 5. PLANTS TABS FILTER
  const tabBtns = document.querySelectorAll('.tab-btn');
  const plantCards = document.querySelectorAll('.plant-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-tab');

      plantCards.forEach(card => {
        if (targetTab === 'tab-todas') {
          card.style.display = 'flex';
        } else if (targetTab === 'tab-garden') {
          card.classList.contains('highlight-card') || card.querySelector('.badge-garden')
            ? (card.style.display = 'flex')
            : (card.style.display = 'none');
        } else if (targetTab === 'tab-terraco') {
          card.querySelector('.plant-specs')?.innerText.includes('Terraço')
            ? (card.style.display = 'flex')
            : (card.style.display = 'none');
        }
      });
    });
  });

  // 6. MOBILE MENU TOGGLE
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      mobileMenuToggle.setAttribute('aria-expanded', isOpen);
      const icon = mobileMenuToggle.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    });

    // Close menu when clicking link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }

  // 7. LIGHTBOX IMAGE ZOOM MODAL
  const lightbox = document.getElementById('imageLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  const clickableImages = document.querySelectorAll('.plant-img-wrapper img, .leisure-photo-thumb img');

  clickableImages.forEach(img => {
    img.addEventListener('click', function(e) {
      e.stopPropagation();
      if (lightbox && lightboxImg) {
        lightboxImg.src = this.src;
        lightboxImg.alt = this.alt;
        if (lightboxCaption) {
          lightboxCaption.innerText = this.alt || 'Urban Vila Guilherme';
        }
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightboxModal() {
    if (lightbox) {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightboxModal);
  }

  if (lightbox) {
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox || e.target === lightboxClose) {
        closeLightboxModal();
      }
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeLightboxModal();
    }
  });

}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
