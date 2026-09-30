document.getElementById('whatsappForm').addEventListener('submit', function(e) {
  e.preventDefault();

  let name = document.getElementById('name').value;
  let phone = document.getElementById('phone').value;
  let business = document.getElementById('business').value;
  let service = document.getElementById('service').value;
  let message = document.getElementById('message').value;

  let text = `مرحبا Axis Media 👋%0A%0A*الاسم:* ${name}%0A*الرقم:* ${phone}%0A*النشاط:* ${business}%0A*الخدمة المطلوبة:* ${service}%0A*التفاصيل:* ${message}`;
  let number = "201155937921";
  let url = `https://wa.me/${number}?text=${text}`;

  window.open(url, '_blank');
});