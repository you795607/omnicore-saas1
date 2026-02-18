document.getElementById('loginBtn').addEventListener('click', function() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // تحقق بسيط بدون قاعدة بيانات
  if(email === "user@example.com" && password === "123456") {
    alert("تم تسجيل الدخول بنجاح!");
    window.location.href = "dashboard.html"; // سينقلك للوحة التحكم
  } else {
    alert("البريد الإلكتروني أو كلمة المرور غير صحيحة!");
  }
});
