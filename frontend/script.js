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

fetch('http://localhost:8000/api/menu?dato=2025-06-10')
  .then(res => res.json())
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

  // Hent aktiviteter
fetch('http://localhost:8000/api/activities')
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

// Hent vejr
fetch('http://localhost:8000/api/weather')
  .then(res => res.json())
  .then(data => {
    // Antag data.forecast = "Solrigt, 22°C"
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
