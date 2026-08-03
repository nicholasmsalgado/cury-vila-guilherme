/* ==========================================================================
   RESIDENCIAL AMADEU - VILA GUILHERME
   Interactive JavaScript Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. COUNTDOWN TIMER TO 31/08/2026 00:00:00
  const launchDate = new Date('2026-08-31T00:00:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = launchDate - now;

    if (distance < 0) {
      document.getElementById('days').innerText = '00';
      document.getElementById('hours').innerText = '00';
      document.getElementById('minutes').innerText = '00';
      document.getElementById('seconds').innerText = '00';
      const label = document.querySelector('.countdown-label');
      if (label) label.innerText = 'É HOJE! GRANDE LANÇAMENTO AMADEU VILA GUILHERME';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = String(days).padStart(2, '0');
    document.getElementById('hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
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
        origem: "Site - Residencial Amadeu Vila Guilherme",
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
            'form_name': 'PreLancamentoAmadeu',
            'contact_time': horario
          });
        }

        // WhatsApp redirect message
        const messageText = `Olá! Vim através do site do Residencial Amadeu Vila Guilherme e gostaria de receber a apresentação e as condições exclusivas de pré-lançamento MCMV.\n\n` +
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

        const messageText = `Olá! Gostaria de receber informações sobre o Residencial Amadeu Vila Guilherme.\n\n` +
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

});
