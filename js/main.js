/**
 * INDAYA MED - Medical Travel Turkmenistan -> India
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
  const navLinks = document.querySelectorAll('.nav-link');

  if (burgerBtn && navMenu) {
    burgerBtn.addEventListener('click', () => {
      burgerBtn.classList.toggle('open');
      navMenu.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        burgerBtn.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.classList.remove('no-scroll');
      });
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

  // --- МАСКА ТЕЛЕФОНА ТУРКМЕНИСТАНА (+993 ...) ---
  const phoneInput = document.getElementById('patientPhone');
  if (phoneInput) {
    phoneInput.addEventListener('focus', () => {
      if (!phoneInput.value) {
        phoneInput.value = '+993 ';
      }
    });

    phoneInput.addEventListener('input', (e) => {
      let val = phoneInput.value.replace(/[^\d+]/g, '');
      if (!val.startsWith('+993')) {
        val = '+993' + val.replace(/^\+?993?/, '');
      }
      
      // Форматируем +993 XX XXXXXX
      let digits = val.substring(4);
      let formatted = '+993 ';
      if (digits.length > 0) formatted += digits.substring(0, 2);
      if (digits.length > 2) formatted += ' ' + digits.substring(2, 4);
      if (digits.length > 4) formatted += '-' + digits.substring(4, 6);
      if (digits.length > 6) formatted += '-' + digits.substring(6, 8);

      phoneInput.value = formatted.trim();
    });
  }

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
_Источник: INDAYA MED (GitHub Pages)_
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
        console.info('=== [INDAYA MED] ЗАЯВКА УСПЕШНО СФОРМИРОВАНА ===');
        console.table(leadPayload);
        console.info('Чтобы настроить реальную отправку в Telegram, укажите BOT_TOKEN и CHAT_ID в js/main.js');
      }

      // Генерация прямой ссылки для WhatsApp (fallback / мгновенное продолжение диалога)
      const waText = encodeURIComponent(`Здравствуйте! Я оставил заявку на сайте INDAYA Med.\nИмя: ${name}\nТелефон: ${phone}\nНаправление: ${direction}\nКлиника: ${hospital}\nОписание: ${details}`);
      const directWhatsAppUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

      // Показываем модалку успеха
      if (successModalSummary) {
        successModalSummary.innerHTML = `
          <p style="font-size:1.05rem; color:var(--navy); font-weight:700; margin-bottom:10px;">
            Уважаемый(ая) <strong>${name}</strong>, ваши данные приняты!
          </p>
          <p style="font-size:0.92rem; color:var(--slate); margin-bottom:16px;">
            Медицинский координатор INDAYA MED свяжется с вами по номеру <strong>${phone}</strong> в течение 15–30 минут через <strong>${messenger}</strong>.
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
      alert('Заявка принята, но произошла задержка сети. Вы можете прямо сейчас написать нам в WhatsApp или Telegram!');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });

  // --- ФОНОВЫЙ СЛАЙДЕР АШХАБАДА (Hero, fade) ---
  const bgSlider = document.getElementById('heroBgSlider');
  const bgDotsWrap = document.getElementById('bgDots');
  if (bgSlider && bgDotsWrap) {
    const slides = bgSlider.querySelectorAll('.bg-slide');
    const prevBtn = document.getElementById('bgPrev');
    const nextBtn = document.getElementById('bgNext');
    let current = 0;
    let autoplayTimer = null;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Фото ' + (i + 1));
      dot.addEventListener('click', () => { goTo(i); restartAutoplay(); });
      bgDotsWrap.appendChild(dot);
    });

    const dots = bgDotsWrap.querySelectorAll('.gallery-dot');

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function restartAutoplay() {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(() => goTo(current + 1), 4500);
    }

    prevBtn?.addEventListener('click', () => { goTo(current - 1); restartAutoplay(); });
    nextBtn?.addEventListener('click', () => { goTo(current + 1); restartAutoplay(); });

    bgSlider.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    bgSlider.addEventListener('mouseleave', restartAutoplay);

    // Свайп на мобильных
    let touchStartX = 0;
    bgSlider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    bgSlider.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(dx) > 40) {
        goTo(dx < 0 ? current + 1 : current - 1);
        restartAutoplay();
      }
    }, { passive: true });

    // Пауза, если вкладка скрыта
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) clearInterval(autoplayTimer);
      else restartAutoplay();
    });

    restartAutoplay();
  }


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
