// 📌 Вычисляем часы между start и end
function calculateHours(start, end) {
  const [h1, m1] = start.split(':').map(Number);
  const [h2, m2] = end.split(':').map(Number);
  return ((h2 * 60 + m2) - (h1 * 60 + m1)) / 60;
}

// 💾 Сохранение записи
function saveEntry() {
  const date = document.getElementById('date').value;
  const start = document.getElementById('start').value;
  const end = document.getElementById('end').value;
  const rate = parseFloat(document.getElementById('rate').value);

  if (!date || !start || !end || isNaN(rate)) {
    alert("Пожалуйста, заполни все поля!");
    return;
  }

  const hours = calculateHours(start, end);
  const earnings = +(hours * rate).toFixed(2);
  const entry = { date, start, end, hours, earnings };

  const data = getData();
  data.push(entry);
  saveData(data);
  renderHistory();
}

// 📋 Отображение всех записей
function renderHistory() {
  const historyEl = document.getElementById('history');
  historyEl.innerHTML = "";

  const data = getData();
  let total = 0;

  data.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.date}: ${item.start}–${item.end} — 
      ${item.hours.toFixed(2)} ч, ${item.earnings.toFixed(2)} ₪</span>
    `;
    const delBtn = document.createElement("button");
    delBtn.textContent = "✖";
    delBtn.onclick = () => deleteEntry(index);
    li.appendChild(delBtn);
    historyEl.appendChild(li);
    total += item.earnings;
  });

  if (data.length > 0) {
    const totalEl = document.createElement("p");
    totalEl.innerHTML = `<strong>Итого:</strong> ${total.toFixed(2)} ₪`;
    historyEl.appendChild(totalEl);
  }
}

// ❌ Удаление записи по индексу
function deleteEntry(index) {
  const data = getData();
  data.splice(index, 1);
  saveData(data);
  renderHistory();
}

// 🧹 Очистка всех данных
function clearData() {
  if (confirm("Точно удалить все записи?")) {
    localStorage.removeItem("workTime");
    renderHistory();
  }
}

// 📤 Экспорт данных в JSON
function exportData() {
  const data = JSON.stringify(getData(), null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "work_time_data.json";
  a.click();
  URL.revokeObjectURL(url);
}

// 📥 Импорт данных из JSON
function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) {
        alert("Файл должен содержать массив записей.");
        return;
      }

      const existing = getData();
      const merged = existing.concat(imported);
      saveData(merged);
      renderHistory();
    } catch (err) {
      alert("Ошибка при чтении файла: " + err.message);
    }
  };
  reader.readAsText(file);
}

// 📦 Утилиты
function getData() {
  try {
    return JSON.parse(localStorage.getItem("workTime")) || [];
  } catch {
    return [];
  }
}

function saveData(data) {
  localStorage.setItem("workTime", JSON.stringify(data));
}

// 🔁 Инициализация при загрузке
window.onload = renderHistory;