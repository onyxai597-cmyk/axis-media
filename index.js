const WHATSAPP_NUMBER = "201155937921";

const form = document.getElementById("contact-form");

if (form) {
const getValue = (data, name) =>
String(data.get(name) || "").trim();

form.addEventListener("submit", (event) => {
event.preventDefault();

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
  lines.push("الموقع / الصفحة: " + website);
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

window.location.href = url;

});
} else {
console.error('لم يتم العثور على الفورم بالمعرف "contact-form".');
}