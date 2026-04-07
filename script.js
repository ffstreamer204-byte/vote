let rating = 0;

const stars = document.querySelectorAll(".stars span");
const emoji = document.getElementById("emoji");
const live = document.getElementById("liveRating");

const emojis = ["😡","😕","😐","😊","😍"];

stars.forEach((star, index) => {
  star.addEventListener("click", () => {
    rating = index + 1;

    stars.forEach(s => s.classList.remove("active"));
    for (let i = 0; i < rating; i++) {
      stars[i].classList.add("active");
    }

    emoji.textContent = emojis[rating - 1];
    live.innerText = `⭐ ${rating} / 5`;
  });
});

// 🔥 TELEGRAM CONFIG
const BOT_TOKEN = "8658392704:AAGPui4abxdTL1HjNdmJxJhTVLT6Um3Og-Y";
const CHAT_ID = "5083324379";

// 📊 STORAGE
function getVotes() {
  return JSON.parse(localStorage.getItem("stallVotes")) || {};
}

function saveVotes(votes) {
  localStorage.setItem("stallVotes", JSON.stringify(votes));
}

// 🚀 MAIN
function submitFeedback() {
  const text = document.getElementById("text").value;
  const stall = document.getElementById("stall").value;

  if (!rating || !text || !stall) {
    alert("Fill all fields!");
    return;
  }

  // ❌ one device one vote
  if (localStorage.getItem("voted")) {
    alert("❌ Already voted from this device!");
    return;
  }

  let votes = getVotes();

  votes[stall] = (votes[stall] || 0) + 1;

  saveVotes(votes);
  localStorage.setItem("voted", true);

  alert("✅ Vote Submitted!");

  // 🏆 FIND LEADER
  let winner = "";
  let max = 0;

  for (let s in votes) {
    if (votes[s] > max) {
      max = votes[s];
      winner = s;
    }
  }

  // 📲 TELEGRAM MESSAGE
  let msg = `🗳 Bazaar O Nomics Voting\n\n`;

  for (let s in votes) {
    msg += `🏪 ${s}: ${votes[s]} votes\n`;
  }

  msg += `\n🏆 Leader: ${winner} (${max} votes)`;

  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: msg
    })
  });
}

window.submitFeedback = submitFeedback;