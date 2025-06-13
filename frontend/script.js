function formatDateTime() {
    const now = new Date();
    const days = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];
    const dayName = days[now.getDay()];
    const day = now.getDate();
    const monthNames = ["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december"];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const hour = now.getHours().toString().padStart(2, "0");
    const minute = now.getMinutes().toString().padStart(2, "0");
    return `${dayName} d. ${day}. ${month} – Kl. ${hour}.${minute}`;
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("page-title").textContent = formatDateTime();
});

fetch('/api/menu')
  .then(response => response.json())
  .then(data => {
    document.getElementById('breakfast').textContent = data.breakfast;
    document.getElementById('lunch').textContent = data.lunch;
    document.getElementById('dinner').textContent = data.dinner;
  })
  .catch(error => {
    document.getElementById('breakfast').textContent = 'Fejl!';
    document.getElementById('lunch').textContent = 'Fejl!';
    document.getElementById('dinner').textContent = 'Fejl!';
    console.error('Fejl ved hentning af menu:', error);
  });

fetch('http://localhost:8000/api/activities', { cache: "no-store" })
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById('activities');
    list.innerHTML = ''; 
    data.forEach(activity => {
      const li = document.createElement('li');
      li.textContent = `${activity.time} – ${activity.name}`;
      list.appendChild(li);
    });
  });

fetch('http://localhost:8000/api/weather', { cache: "no-store" })
  .then(res => res.json())
  .then(data => {
    const [desc, temp] = data.forecast.split(',');
    document.getElementById('weather').innerHTML = `
      <span class="weather-desc">☀️ ${desc}</span>
      <br>
      <span class="weather-temp"> ${temp.trim()}</span>
    `;
  })
  .catch(error => {
    document.getElementById('weather').textContent = 'Fejl!';
    console.error('Fejl ved hentning af vejr:', error);
  });

function drawAnalogClock() {
    const canvas = document.getElementById('analog-clock');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Tegn urskive
    ctx.beginPath();
    ctx.arc(radius, radius, radius - 2, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Tegn tallene 12, 3, 6, 9
    ctx.font = 'bold 16px Segoe UI, Arial, sans-serif';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('12', radius, radius - radius * 0.75);
    ctx.fillText('3', radius + radius * 0.75, radius);
    ctx.fillText('6', radius, radius + radius * 0.75);
    ctx.fillText('9', radius - radius * 0.75, radius);

    // Hent tid
    const now = new Date();
    const hour = now.getHours() % 12;
    const minute = now.getMinutes();
    const second = now.getSeconds();

    // Tegn timeviser
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(((hour + minute / 60) * Math.PI) / 6);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -radius * 0.5);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();

    // Tegn minutviser
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(((minute + second / 60) * Math.PI) / 30);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -radius * 0.75);
    ctx.strokeStyle = '#228be6';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    // Tegn sekundviser
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate((second * Math.PI) / 30);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -radius * 0.85);
    ctx.strokeStyle = '#fa5252';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
}

// Opdater uret hvert sekund
setInterval(drawAnalogClock, 1000);
document.addEventListener("DOMContentLoaded", drawAnalogClock);

document.getElementById('tilbage-til-forside').addEventListener('click', () => {
    window.location.href = '/';
});
