/* ============================================================
   Специалист по энергетическому праву — лендинг (демо)
   Меню, модальное окно с формой, маска телефона, проверки,
   появление блоков. Форма демонстрационная: ничего не отправляет.
   ============================================================ */

(function () {
  "use strict";

  var body = document.body;

  /* ------------------------------------------------------------
     Счётчик Яндекс Метрики и цели подключаются здесь, когда
     заказчик даст номер счётчика. Пример места для кода:
     вставить скрипт Метрики и вызывать ym(ID, 'reachGoal', 'lead')
     в обработчике отправки формы.
     ------------------------------------------------------------ */

  /* ---------- мобильное меню ---------- */

  var burger = document.querySelector(".burger");
  var mobileNav = document.getElementById("mobile-nav");

  function openMenu() {
    if (!burger || !mobileNav) return;
    mobileNav.hidden = false;
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Закрыть меню");
    body.classList.add("is-menu-open");
  }

  function closeMenu() {
    if (!burger || !mobileNav) return;
    mobileNav.hidden = true;
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Открыть меню");
    body.classList.remove("is-menu-open");
  }

  if (burger && mobileNav) {
    burger.addEventListener("click", function () {
      if (burger.getAttribute("aria-expanded") === "true") {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && burger.getAttribute("aria-expanded") === "true") {
        closeMenu();
        burger.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  /* ---------- модальное окно с формой ---------- */

  var dialog = document.getElementById("lead-modal");
  var form = document.getElementById("lead-form");
  var success = document.getElementById("lead-success");
  var requestField = document.getElementById("lead-request");
  var formatField = document.getElementById("lead-format");
  var requestLabel = dialog ? dialog.querySelector("[data-modal-request]") : null;
  var companyField = dialog ? dialog.querySelector("[data-company-field]") : null;
  var lastFocused = null;

  function clearErrors() {
    if (!form) return;
    form.querySelectorAll(".field--error").forEach(function (field) {
      field.classList.remove("field--error");
    });
    form.querySelectorAll(".field__error").forEach(function (error) {
      error.hidden = true;
    });
  }

  function resetForm() {
    if (!form) return;
    form.reset();
    clearErrors();
    form.hidden = false;
    if (success) success.hidden = true;
    if (companyField) companyField.hidden = true;
    if (formatField) formatField.value = "";
    if (requestField) requestField.value = "";
    if (requestLabel) requestLabel.textContent = "Заявка";
  }

  function openDialog(trigger) {
    if (!dialog) return;

    lastFocused = trigger || document.activeElement;
    resetForm();

    var request = trigger ? trigger.getAttribute("data-request") : "";
    if (request && requestField) requestField.value = request;
    if (request && requestLabel) requestLabel.textContent = request;

    var format = trigger ? trigger.getAttribute("data-format") : "";
    if (format && formatField) formatField.value = format;

    var isCorporate = trigger && trigger.getAttribute("data-corporate") === "1";
    if (isCorporate && companyField) companyField.hidden = false;

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }

    body.classList.add("is-modal-open");

    var firstInput = form ? form.querySelector('input[id="lead-name"]') : null;
    if (firstInput) {
      window.setTimeout(function () {
        firstInput.focus();
      }, 40);
    }
  }

  function closeDialog() {
    if (!dialog) return;
    if (typeof dialog.close === "function" && dialog.open) {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
      body.classList.remove("is-modal-open");
    }
  }

  if (dialog) {
    document.querySelectorAll("[data-open-lead]").forEach(function (button) {
      button.addEventListener("click", function () {
        openDialog(button);
      });
    });

    dialog.querySelectorAll("[data-close-lead]").forEach(function (button) {
      button.addEventListener("click", closeDialog);
    });

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) closeDialog();
    });

    dialog.addEventListener("close", function () {
      body.classList.remove("is-modal-open");
      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
    });

    dialog.addEventListener("cancel", function () {
      body.classList.remove("is-modal-open");
    });
  }

  /* ---------- маска телефона ---------- */

  var phoneInput = document.getElementById("lead-phone");

  function onlyDigits(value) {
    return value.replace(/\D/g, "");
  }

  function formatPhone(value) {
    var digits = onlyDigits(value);
    if (!digits) return "";

    if (digits.charAt(0) === "8") digits = "7" + digits.slice(1);
    if (digits.charAt(0) === "9") digits = "7" + digits;
    if (digits.charAt(0) !== "7") digits = "7" + digits;
    digits = digits.slice(0, 11);

    var rest = digits.slice(1);
    var out = "+7";

    if (rest.length > 0) out += " (" + rest.slice(0, 3);
    if (rest.length >= 3) out += ") " + rest.slice(3, 6);
    if (rest.length >= 6) out += "-" + rest.slice(6, 8);
    if (rest.length >= 8) out += "-" + rest.slice(8, 10);

    return out;
  }

  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      phoneInput.value = formatPhone(phoneInput.value);
      var field = phoneInput.closest(".field");
      if (field && field.classList.contains("field--error")) {
        field.classList.remove("field--error");
        var error = document.getElementById("lead-phone-error");
        if (error) error.hidden = true;
      }
    });
  }

  /* ---------- проверка формы ---------- */

  function markError(input, errorId) {
    if (!input) return;
    var field = input.closest(".field");
    if (field) field.classList.add("field--error");
    var error = document.getElementById(errorId);
    if (error) error.hidden = false;
  }

  var nameInput = document.getElementById("lead-name");

  if (nameInput) {
    nameInput.addEventListener("input", function () {
      var field = nameInput.closest(".field");
      if (field && field.classList.contains("field--error")) {
        field.classList.remove("field--error");
        var error = document.getElementById("lead-name-error");
        if (error) error.hidden = true;
      }
    });
  }

  var consentInput = document.getElementById("lead-consent");

  if (consentInput) {
    consentInput.addEventListener("change", function () {
      var error = document.getElementById("lead-consent-error");
      if (consentInput.checked && error) error.hidden = true;
    });
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearErrors();

      var firstInvalid = null;
      var isValid = true;

      if (!nameInput || nameInput.value.trim().length < 2) {
        markError(nameInput, "lead-name-error");
        firstInvalid = firstInvalid || nameInput;
        isValid = false;
      }

      var phoneDigits = phoneInput ? onlyDigits(phoneInput.value) : "";
      if (phoneDigits.length !== 11) {
        markError(phoneInput, "lead-phone-error");
        firstInvalid = firstInvalid || phoneInput;
        isValid = false;
      }

      if (consentInput && !consentInput.checked) {
        var consentError = document.getElementById("lead-consent-error");
        if (consentError) consentError.hidden = false;
        isValid = false;
      }

      if (!isValid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      /* Здесь в рабочей версии была бы отправка заявки в Центр. */

      form.hidden = true;
      if (success) {
        success.hidden = false;
        var closeButton = success.querySelector("[data-close-lead]");
        if (closeButton) closeButton.focus();
      }
    });
  }

  /* ---------- появление блоков ---------- */

  var revealLeft = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var scrollTimer = null;

  function revealCheck() {
    var limit = window.innerHeight * 0.92;

    revealLeft = revealLeft.filter(function (item) {
      if (item.getBoundingClientRect().top < limit) {
        item.classList.add("is-visible");
        return false;
      }
      return true;
    });

    if (!revealLeft.length) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }
  }

  function onScroll() {
    if (scrollTimer) return;
    scrollTimer = window.setTimeout(function () {
      scrollTimer = null;
      revealCheck();
    }, 80);
  }

  revealCheck();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  /* ---------- мобильная кнопка появляется после первого экрана ---------- */

  var mobileCta = document.querySelector(".mobile-cta");

  function updateMobileCta() {
    if (!mobileCta) return;
    if (window.scrollY > 420) {
      mobileCta.classList.add("is-shown");
    } else {
      mobileCta.classList.remove("is-shown");
    }
  }

  updateMobileCta();
  window.addEventListener("scroll", updateMobileCta, { passive: true });
})();
