/**
 * ADYL ÇÖZGÜT - Medical assistance: Turkmenistan -> India
 * Core JavaScript Logic & Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- TELEGRAM BOT CONFIGURATION ---
  // Чтобы заявки приходили прямо вам в Telegram, создайте бота через @BotFather,
  // получите TOKEN и укажите ваш chat_id (узнать через @userinfobot).
  const TELEGRAM_CONFIG = {
    ENABLED: false, // Переключите на true после добавления вашего токена
    BOT_TOKEN: 'YOUR_BOT_TOKEN_HERE',
    CHAT_ID: 'YOUR_CHAT_ID_HERE'
  };

  // WhatsApp номер по умолчанию для Туркменистана / координаторов (без знака +)
  const WHATSAPP_NUMBER = '99365677550'; // Номер координатора в Туркменистане


  // --- МОБИЛЬНОЕ МЕНЮ (БУРГЕР) ---
  const burgerBtn = document.getElementById('burgerBtn');
  const navMenu = document.getElementById('navMenu');

  if (burgerBtn && navMenu) {
    burgerBtn.addEventListener('click', () => {
      burgerBtn.classList.toggle('open');
      navMenu.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burgerBtn.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  // --- ДРОПДАУН ТЕЛЕФОНОВ В ШАПКЕ ---
  const navPhonesToggle = document.getElementById('navPhonesToggle');
  const navPhonesDropdown = document.getElementById('navPhonesDropdown');

  if (navPhonesToggle && navPhonesDropdown) {
    navPhonesToggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 900) return;
      e.preventDefault();
      navPhonesDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!navPhonesToggle.contains(e.target) && !navPhonesDropdown.contains(e.target)) {
        navPhonesDropdown.classList.remove('show');
      }
    });
  }

  // --- NAVBAR SCROLL EFFECT & SCROLL-TOP ---
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    if (window.scrollY > 450) {
      scrollTopBtn?.classList.add('visible');
    } else {
      scrollTopBtn?.classList.remove('visible');
    }
  });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- ИНТЕРАКТИВНЫЙ АККОРДЕОН (FAQ) ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Закрываем другие активные вкладки
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      // Переключаем текущую
      if (!isActive) {
        item.classList.add('active');
        if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        if (answer) answer.style.maxHeight = null;
      }
    });
  });

  // --- ИНТЕРАКТИВНЫЙ ОПРОСНИК / КАЛЬКУЛЯТОР ПРЕДВАРИТЕЛЬНОГО РАСЧЕТА ---
  const calcChips = document.querySelectorAll('.calc-chip');
  const calcSummaryDirection = document.getElementById('calcSummaryDirection');
  const calcApplyBtn = document.getElementById('calcApplyBtn');

  let selectedCalcState = {
    direction: 'Трансплантация органов',
    documents: 'Есть свежие выписки',
    companions: '1 сопровождающий'
  };

  calcChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      const radio = chip.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        const groupName = radio.name;

        // Снимаем active со всех в этой группе
        document.querySelectorAll(`input[name="${groupName}"]`).forEach(r => {
          r.closest('.calc-chip')?.classList.remove('active');
        });
        chip.classList.add('active');

        // Обновляем состояние
        if (groupName === 'treatment_type') {
          selectedCalcState.direction = chip.dataset.label || radio.value;
          if (calcSummaryDirection) {
            calcSummaryDirection.textContent = selectedCalcState.direction;
          }
        } else if (groupName === 'docs_status') {
          selectedCalcState.documents = chip.dataset.label || radio.value;
        } else if (groupName === 'companions_count') {
          selectedCalcState.companions = chip.dataset.label || radio.value;
        }
      }
    });
  });

  // Кнопка применения расчета -> переносит данные в форму заявки
  calcApplyBtn?.addEventListener('click', () => {
    const leadSection = document.getElementById('leadSection');
    const selectDirection = document.getElementById('treatmentDirectionSelect');
    const messageField = document.getElementById('patientDetails');

    if (selectDirection) {
      // Ищем подходящее значение в select
      for (let option of selectDirection.options) {
        if (option.text.toLowerCase().includes(selectedCalcState.direction.toLowerCase()) || 
            selectedCalcState.direction.toLowerCase().includes(option.text.toLowerCase())) {
          selectDirection.value = option.value;
          break;
        }
      }
    }

    if (messageField) {
      const existing = messageField.value.trim();
      const metaText = `[Предварительный расчет]: Направление: ${selectedCalcState.direction}. Документы: ${selectedCalcState.documents}. Сопровождающие: ${selectedCalcState.companions}.`;
      messageField.value = existing ? `${existing}\n${metaText}` : metaText;
    }

    if (leadSection) {
      leadSection.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // --- МАСКА ТЕЛЕФОНА ТУРКМЕНИСТАНА (+993 ...) для всех tel-полей ---
  document.querySelectorAll('input[type="tel"]').forEach(phoneInput => {
    phoneInput.addEventListener('focus', () => {
      if (!phoneInput.value) {
        phoneInput.value = '+993 ';
      }
    });

    phoneInput.addEventListener('input', () => {
      let val = phoneInput.value.replace(/[^\d+]/g, '');
      if (!val.startsWith('+993')) {
        val = '+993' + val.replace(/^\+?993?/, '');
      }

      // Форматируем +993 XX XX-XX-XX
      let digits = val.substring(4);
      let formatted = '+993 ';
      if (digits.length > 0) formatted += digits.substring(0, 2);
      if (digits.length > 2) formatted += ' ' + digits.substring(2, 4);
      if (digits.length > 4) formatted += '-' + digits.substring(4, 6);
      if (digits.length > 6) formatted += '-' + digits.substring(6, 8);

      phoneInput.value = formatted.trim();
    });
  });

  // --- ВЫБОР МЕССЕНДЖЕРА В ФОРМЕ ---
  const messengerRadios = document.querySelectorAll('.messenger-radio');
  messengerRadios.forEach(radioLabel => {
    radioLabel.addEventListener('click', () => {
      messengerRadios.forEach(r => r.classList.remove('selected'));
      radioLabel.classList.add('selected');
    });
  });


  // --- ОБРАБОТКА И ОТПРАВКА ФОРМЫ ЗАЯВКИ ---
  const leadForm = document.getElementById('leadForm');
  const successModal = document.getElementById('successModal');
  const closeSuccessModalBtn = document.getElementById('closeSuccessModal');
  const successModalSummary = document.getElementById('successModalSummary');
  const submitBtn = document.getElementById('leadSubmitBtn');

  function closeSuccessModalFunc() {
    successModal?.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  closeSuccessModalBtn?.addEventListener('click', closeSuccessModalFunc);
  successModal?.addEventListener('click', (e) => {
    if (e.target === successModal) closeSuccessModalFunc();
  });

  leadForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('patientName')?.value.trim();
    const phone = document.getElementById('patientPhone')?.value.trim();
    const direction = document.getElementById('treatmentDirectionSelect')?.value || 'Не указано';
    const hospital = document.getElementById('preferredHospitalSelect')?.value || 'Не выбрана (подберите лучшую)';
    const details = document.getElementById('patientDetails')?.value.trim() || 'Без подробностей';
    
    // Выбранный мессенджер
    const messengerInput = document.querySelector('input[name="preferred_messenger"]:checked');
    const messenger = messengerInput ? messengerInput.value : 'WhatsApp';

    // Базовая валидация
    if (!name || name.length < 2) {
      alert('Пожалуйста, укажите имя пациента или контактного лица.');
      document.getElementById('patientName')?.focus();
      return;
    }

    if (!phone || phone.replace(/[^\d]/g, '').length < 8) {
      alert('Пожалуйста, введите корректный номер телефона для связи в Туркменистане.');
      document.getElementById('patientPhone')?.focus();
      return;
    }

    // Состояние кнопки отправки
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg style="animation:spin 1s linear infinite; width:20px; height:20px; display:inline-block; vertical-align:middle; margin-right:8px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10"></path>
      </svg>
      Отправляем заявку...
    `;

    const leadPayload = {
      name,
      phone,
      messenger,
      direction,
      hospital,
      details,
      date: new Date().toLocaleString('ru-RU')
    };

    const formattedMessage = `
🏥 *НОВАЯ ЗАЯВКА НА ЛЕЧЕНИЕ В ИНДИИ*
----------------------------------------
👤 *Пациент:* ${name}
📞 *Телефон:* ${phone}
💬 *Предпочитаемый канал:* ${messenger}
🩺 *Направление:* ${direction}
🏢 *Клиника:* ${hospital}
📝 *Описание случая:* ${details}
⏰ *Время заявки:* ${leadPayload.date}
----------------------------------------
_Источник: ADYL ÇÖZGÜT (GitHub Pages)_
    `.trim();

    try {
      if (TELEGRAM_CONFIG.ENABLED && TELEGRAM_CONFIG.BOT_TOKEN !== 'YOUR_BOT_TOKEN_HERE') {
        const tgUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`;
        await fetch(tgUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CONFIG.CHAT_ID,
            text: formattedMessage,
            parse_mode: 'Markdown'
          })
        });
      } else {
        // Режим симуляции с сохранением в локальное хранилище и логированием
        console.info('=== [ADYL ÇÖZGÜT] ЗАЯВКА УСПЕШНО СФОРМИРОВАНА ===');
        console.table(leadPayload);
        console.info('Чтобы настроить реальную отправку в Telegram, укажите BOT_TOKEN и CHAT_ID в js/main.js');
      }

      // Генерация прямой ссылки для WhatsApp (fallback / мгновенное продолжение диалога)
      const waText = encodeURIComponent(`Здравствуйте! Я оставил заявку на сайте ADYL ÇÖZGÜT.\nИмя: ${name}\nТелефон: ${phone}\nНаправление: ${direction}\nКлиника: ${hospital}\nОписание: ${details}`);
      const directWhatsAppUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

      // Показываем модалку успеха
      if (successModalSummary) {
        successModalSummary.innerHTML = `
          <p style="font-size:1.05rem; color:var(--navy); font-weight:700; margin-bottom:10px;">
            Уважаемый(ая) <strong>${name}</strong>, ваши данные приняты!
          </p>
          <p style="font-size:0.92rem; color:var(--slate); margin-bottom:16px;">
            Медицинский координатор ADYL ÇÖZGÜT свяжется с вами по номеру <strong>${phone}</strong> в течение 15–30 минут через <strong>${messenger}</strong>.
          </p>
          <div style="background:var(--teal-bg); border:1px solid #ccfbf1; padding:16px; border-radius:var(--radius-md); margin-bottom:20px; text-align:left;">
            <strong style="color:var(--teal-dark); font-size:0.9rem; display:block; margin-bottom:6px;">Что подготовить к беседе с доктором:</strong>
            <ul style="font-size:0.84rem; color:var(--slate-dark); list-style:disc; margin-left:18px; line-height:1.5;">
              <li>Последние выписки врачей и эпикризы из больниц Туркменистана</li>
              <li>Снимки МРТ, КТ или рентген (если имеются)</li>
              <li>Загранпаспорта пациента и сопровождающего лица</li>
            </ul>
          </div>
          <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
            <a href="${directWhatsAppUrl}" target="_blank" class="btn btn-whatsapp btn-sm" style="font-size:0.88rem;">
              💬 Написать координатору в WhatsApp прямо сейчас
            </a>
          </div>
        `;
      }

      leadForm.reset();
      successModal?.classList.add('active');
      document.body.classList.add('no-scroll');

    } catch (err) {
      console.error('Ошибка отправки заявки:', err);
      alert('Заявка принята! Вы также можете написать нам напрямую в WhatsApp: +993 65 677550 или позвонить по телефону +993 72 254296.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });

  // --- КОНСУЛЬТАЦИОННАЯ ФОРМА В СЕКЦИИ КЛИНИК ---
  const consultForm = document.getElementById('consultForm');

  consultForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = consultForm.querySelector('[name="name"]')?.value.trim();
    const phone = consultForm.querySelector('[name="phone"]')?.value.trim();
    const message = consultForm.querySelector('[name="message"]')?.value.trim() || 'Без сообщения';
    const submitBtn = consultForm.querySelector('[type="submit"]');

    if (!name || name.length < 2) {
      alert('Пожалуйста, укажите ваше имя.');
      consultForm.querySelector('[name="name"]')?.focus();
      return;
    }

    if (!phone || phone.replace(/[^\d]/g, '').length < 8) {
      alert('Пожалуйста, введите корректный номер телефона для связи в Туркменистане.');
      consultForm.querySelector('[name="phone"]')?.focus();
      return;
    }

    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Отправляем заявку...';
    }

    const payload = {
      name,
      phone,
      message,
      date: new Date().toLocaleString('ru-RU')
    };

    const formattedMessage = `
🏥 *БЫСТРАЯ КОНСУЛЬТАЦИЯ*
----------------------------------------
👤 *Имя:* ${name}
📞 *Телефон:* ${phone}
📝 *Сообщение:* ${message}
⏰ *Время заявки:* ${payload.date}
----------------------------------------
_Источник: ADYL ÇÖZGÜT (GitHub Pages)_
    `.trim();

    try {
      if (TELEGRAM_CONFIG.ENABLED && TELEGRAM_CONFIG.BOT_TOKEN !== 'YOUR_BOT_TOKEN_HERE') {
        const tgUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`;
        await fetch(tgUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CONFIG.CHAT_ID,
            text: formattedMessage,
            parse_mode: 'Markdown'
          })
        });
      } else {
        console.info('=== [ADYL ÇÖZGÜT] КОНСУЛЬТАЦИЯ УСПЕШНО СФОРМИРОВАНА ===');
        console.table(payload);
        console.info('Чтобы настроить реальную отправку в Telegram, укажите BOT_TOKEN и CHAT_ID в js/main.js');
      }

      const waText = encodeURIComponent(`Здравствуйте! Оставил заявку на консультацию на сайте ADYL ÇÖZGÜT.\nИмя: ${name}\nТелефон: ${phone}\nСообщение: ${message}`);
      const directWhatsAppUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

      if (successModalSummary) {
        successModalSummary.innerHTML = `
          <p style="font-size:1.05rem; color:var(--navy); font-weight:700; margin-bottom:10px;">
            Спасибо, <strong>${name}</strong>! Заявка принята.
          </p>
          <p style="font-size:0.92rem; color:var(--slate); margin-bottom:16px;">
            Медицинский координатор ADYL ÇÖZGÜT свяжется с вами по номеру <strong>${phone}</strong> в течение 15–30 минут.
          </p>
          <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
            <a href="${directWhatsAppUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm" style="font-size:0.88rem;">
              💬 Написать координатору в WhatsApp прямо сейчас
            </a>
          </div>
        `;
      }

      consultForm.reset();
      successModal?.classList.add('active');
      document.body.classList.add('no-scroll');
    } catch (err) {
      console.error('Ошибка отправки заявки:', err);
      alert('Заявка принята! Вы также можете написать нам напрямую в WhatsApp: +993 65 677550 или позвонить по телефону +993 72 254296.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    }
  });

  // --- ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКА RU | TM (туркменская версия готовится) ---
  const langSwitches = document.querySelectorAll('.lang-switch');

  function setActiveLang(lang) {
    langSwitches.forEach(group => {
      group.querySelectorAll('.lang-btn').forEach(btn => {
        const isActive = btn.dataset.lang === lang;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
      });
    });
  }

  langSwitches.forEach(group => {
    group.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.lang === 'ru') {
          setActiveLang('ru');
        } else {
          alert('Туркменская версия сайта готовится к запуску.');
        }
      });
    });
  });


  // --- АНИМАЦИИ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ (IntersectionObserver) ---
  const animatedElements = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => observer.observe(el));
  } else {
    animatedElements.forEach(el => el.classList.add('visible'));
  }
});
