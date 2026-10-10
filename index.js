const WHATSAPP_NUMBER = "201155937921";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const header = document.querySelector(".header");
const menuToggle = document.getElementById("toggle-menu");
const navLinks = Array.from(document.querySelectorAll(".header__link"));
const sections = Array.from(document.querySelectorAll("main section[id]"));

const backToTop = document.createElement("button");

backToTop.type = "button";
backToTop.className = "back-to-top";
backToTop.setAttribute("aria-label", "العودة للأعلى");
backToTop.textContent = "\u2191";
document.body.append(backToTop);

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? "auto" : "smooth"
  });
});

const updateOnScroll = () => {
  const scrollY = window.scrollY;
  const atBottom = window.innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
  const offset = header.offsetHeight + 120;
  let currentId = sections[0].id;

  sections.forEach((section) => {
    if (section.offsetTop - offset <= scrollY) {
      currentId = section.id;
    }
  });

  if (atBottom) {
    currentId = sections[sections.length - 1].id;
  }

  header.classList.toggle("header--scrolled", scrollY > 10);
  backToTop.classList.toggle("back-to-top--visible", scrollY > 600);

  navLinks.forEach((link) => {
    link.classList.toggle("header__link--active", link.getAttribute("href") === "#" + currentId);
  });
};

let scrollTicking = false;

window.addEventListener(
  "scroll",
  () => {
    if (scrollTicking) {
      return;
    }

    scrollTicking = true;

    window.requestAnimationFrame(() => {
      updateOnScroll();
      scrollTicking = false;
    });
  },
  { passive: true }
);

window.addEventListener("resize", updateOnScroll);
updateOnScroll();

if (menuToggle) {
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.checked = false;
    });
  });

  document.addEventListener("click", (event) => {
    if (menuToggle.checked && !event.target.closest(".header")) {
      menuToggle.checked = false;
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      menuToggle.checked = false;
    }
  });
}

const setupTyping = (element) => {
  const fullText = element.textContent.trim();
  const typed = document.createElement("span");
  const rest = document.createElement("span");

  rest.textContent = fullText;
  rest.style.visibility = "hidden";
  typed.style.borderInlineEnd = "2px solid currentColor";

  element.textContent = "";
  element.append(typed, rest);

  return () => {
    let index = 0;

    const step = () => {
      index += 1;
      typed.textContent = fullText.slice(0, index);
      rest.textContent = fullText.slice(index);

      if (index < fullText.length) {
        setTimeout(step, 45);
      } else {
        element.textContent = fullText;
      }
    };

    step();
  };
};

if (!prefersReducedMotion) {
  const typingStarters = new Map();

  document.querySelectorAll(".hero__accent, [data-typing]").forEach((element) => {
    typingStarters.set(element, setupTyping(element));
  });

  const typingObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        typingObserver.unobserve(entry.target);
        typingStarters.get(entry.target)();
      });
    },
    { threshold: 0.6 }
  );

  typingStarters.forEach((start, element) => {
    typingObserver.observe(element);
  });
}

const revealSelectors = [
  ".services__header",
  ".services__card",
  ".about__header",
  ".about__text",
  ".about__value",
  ".contact__header",
  ".contact__fieldset",
  ".contact__btn"
];

if (!prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("reveal--visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  revealSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add("reveal");
      element.style.setProperty("--reveal-delay", (index % 3) * 80 + "ms");
      revealObserver.observe(element);
    });
  });
}

const form = document.getElementById("contact-form");

if (form) {
  form.noValidate = true;

  const submitButton = form.querySelector(".contact__btn");
  const submitLabel = submitButton.textContent;

  const getValue = (data, name) =>
    String(data.get(name) || "").trim();

  const toLatinDigits = (value) =>
    value.replace(/[\u0660-\u0669]/g, (digit) => String(digit.charCodeAt(0) - 0x0660));

  const normalizeUrl = (value) =>
    /^https?:\/\//i.test(value) ? value : "https://" + value;

  const isValidUrl = (value) => {
    try {
      return new URL(normalizeUrl(value)).hostname.includes(".");
    } catch {
      return false;
    }
  };

  const validators = {
    name: (value) => (value.length >= 2 ? "" : "من فضلك اكتب اسمك"),
    phone: (value) => {
      const digits = value.replace(/\D/g, "");
      return digits.length >= 8 && digits.length <= 15 ? "" : "رقم الموبايل غير صحيح";
    },
    email: (value) =>
      !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "البريد الإلكتروني غير صحيح",
    company: (value) => (value ? "" : "اكتب اسم الشركة أو النشاط"),
    service: (value) => (value ? "" : "اختر الخدمة المطلوبة"),
    website: (value) => (!value || isValidUrl(value) ? "" : "الرابط غير صحيح"),
    message: (value) => (value.length >= 10 ? "" : "اكتب تفاصيل أكثر عن مشروعك")
  };

  const fields = Array.from(form.elements).filter((element) => validators[element.name]);

  const showError = (field, message) => {
    const wrapper = field.closest(".contact__field");
    let error = wrapper.querySelector(".contact__error");

    if (!message) {
      if (error) {
        error.remove();
      }

      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
      return;
    }

    if (!error) {
      error = document.createElement("p");
      error.className = "contact__error";
      error.id = field.id + "-error";
      wrapper.append(error);
    }

    error.textContent = message;
    field.setAttribute("aria-invalid", "true");
    field.setAttribute("aria-describedby", error.id);
  };

  const validateField = (field) => {
    const message = validators[field.name](field.value.trim());
    showError(field, message);
    return !message;
  };

  fields.forEach((field) => {
    field.addEventListener("blur", () => {
      validateField(field);
    });

    field.addEventListener("input", () => {
      if (field.hasAttribute("aria-invalid")) {
        validateField(field);
      }
    });
  });

  const phoneField = form.elements.phone;

  phoneField.addEventListener("input", () => {
    const cleaned = toLatinDigits(phoneField.value).replace(/[^\d+\s-]/g, "");

    if (cleaned !== phoneField.value) {
      phoneField.value = cleaned;
    }
  });

  const resetButton = () => {
    submitButton.disabled = false;
    submitButton.textContent = submitLabel;
  };

  window.addEventListener("pageshow", resetButton);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const invalidFields = fields.filter((field) => !validateField(field));

    if (invalidFields.length) {
      invalidFields[0].focus();
      return;
    }

    const data = new FormData(form);

    const lines = [
      "طلب تواصل جديد من موقع Axis Media",
      "",
      "البيانات الشخصية",
      "الاسم: " + getValue(data, "name"),
      "رقم الموبايل: " + getValue(data, "phone")
    ];

    const email = getValue(data, "email");

    if (email) {
      lines.push("البريد الإلكتروني: " + email);
    }

    lines.push(
      "",
      "بيانات العمل",
      "الشركة / النشاط: " + getValue(data, "company"),
      "الخدمة المطلوبة: " + getValue(data, "service")
    );

    const website = getValue(data, "website");

    if (website) {
      lines.push("الموقع / الصفحة: " + normalizeUrl(website));
    }

    lines.push(
      "",
      "تفاصيل المشروع:",
      getValue(data, "message")
    );

    const url =
      "https://wa.me/" +
      WHATSAPP_NUMBER +
      "?text=" +
      encodeURIComponent(lines.join("\n"));

    submitButton.disabled = true;
    submitButton.textContent = "جاري فتح واتساب...";

    window.location.href = url;

    setTimeout(resetButton, 4000);
  });
} else {
  console.error('لم يتم العثور على الفورم بالمعرف "contact-form".');
}
