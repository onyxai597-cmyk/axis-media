let lastSubmit = 0;

document.getElementById('whatsappForm').addEventListener('submit', function(e) {
  e.preventDefault();

  let now = Date.now();
  if (now - lastSubmit < 10000) {
    alert('استنى 10 ثواني قبل ما تبعت تاني');
    return;
  }
  lastSubmit = now;

  let name = document.getElementById('name').value.trim();
  let phone = document.getElementById('phone').value.trim();
  let business = document.getElementById('business').value.trim();
  let service = document.getElementById('service').value;
  let message = document.getElementById('message').value.trim();

  if (message.length < 10) {
    alert('اكتب تفاصيل اكتر شوية');
    return;
  }

  let text = `مرحبا Axis Media 👋%0A%0A*الاسم:* ${name}%0A*الرقم:* ${phone}%0A*النشاط:* ${business}%0A*الخدمة المطلوبة:* ${service}%0A*التفاصيل:* ${message}`;
  let number = "201155937921";
  let url = `https://wa.me/${number}?text=${text}`;

  window.open(url, '_blank');
});