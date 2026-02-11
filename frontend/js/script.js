// =======================
// Hero Carousel - Auto Slide Every 4 Seconds
// =======================
const heroCarouselElement = document.getElementById('heroCarousel');
if (heroCarouselElement) {
  const heroCarousel = new bootstrap.Carousel(heroCarouselElement, {
    interval: 4000,
    ride: 'carousel',
    pause: false,
    wrap: true,
    touch: true
  });

  // Fade-in captions on slide
  const carouselCaptions = heroCarouselElement.querySelectorAll('.carousel-caption');
  heroCarouselElement.addEventListener('slide.bs.carousel', () => {
    carouselCaptions.forEach(caption => {
      caption.classList.remove('animate-caption');
      void caption.offsetWidth; // Trigger reflow
      caption.classList.add('animate-caption');
    });
  });
}

// =======================
// Chatbot Toggle & Function
// =======================
const toggle = document.getElementById('chatbot-toggle');
const chatbot = document.getElementById('chatbot');

if (toggle && chatbot) {
  toggle.addEventListener('click', () => {
    chatbot.style.display = chatbot.style.display === 'block' ? 'none' : 'block';
  });
}

function sendMessage() {
  const inputElement = document.getElementById('chatInput');
  const input = inputElement.value.trim().toLowerCase();
  const responses = document.getElementById('chatResponses');
  if (!input) return;

  responses.innerHTML += `<p><strong>You:</strong> ${input}</p>`;

  let response = "Sorry, I don't have information on that. Try asking about matches, players, or tickets!";

  if (input.includes('match') || input.includes('fixture')) {
    response = 'The next match is Mar 7, 2026 vs TBD at Home. Check the Fixtures section.';
  } else if (input.includes('player') || input.includes('squad')) {
    response = 'Our squad includes stars like Jesca Namanda (#9) and Molly Naava (#1). See the Squad section.';
  } else if (input.includes('kit') || input.includes('jersey')) {
    response = 'Kits are available for 50,000 UGX each. Purchase in the Kits section.';
  } else if (input.includes('ticket')) {
    response = 'Tickets start from 10,000 UGX. Purchase in the Tickets section.';
  } else if (input.includes('history')) {
    response = 'She Corporate FC, "The Sharks", won the 2021/22 League and 2023/24 Cup.';
  } else if (input.includes('staff')) {
    response = 'Head Coach: Ininahazwe Belyse. CEO: Kakulu Mathias.';
  } else if (input.includes('venue')) {
    response = 'Home ground: FUFA Technical Centre, Njeru.';
  } else if (input.includes('update') || input.includes('news')) {
    response = 'Check Updates section for latest from X, TikTok, and YouTube.';
  } else if (input.includes('contact')) {
    response = 'Contact via WhatsApp: +256753727200 or email info@shecorporatefc.com.';
  }

  responses.innerHTML += `<p><strong>Bot:</strong> ${response}</p>`;
  inputElement.value = '';
  responses.scrollTop = responses.scrollHeight;
}

// =======================
// Payment Modal Logic
// =======================
let currentItem = '';
let currentAmount = 0;
let selectedProvider = '';

document.querySelectorAll('.payment-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentItem = btn.dataset.item || '';
    let quantity = 1;

    if (currentItem.includes('Tickets')) {
      quantity = parseInt(document.getElementById('ticketQuantity')?.value) || 1;
      currentItem = `${quantity} Tickets for ${document.getElementById('matchSelect')?.value || 'Unknown Match'}`;
    }

    currentAmount = parseInt(btn.dataset.baseAmount) * quantity;
    const paymentModalEl = document.getElementById('paymentModal');
    if (paymentModalEl) {
      const paymentModal = new bootstrap.Modal(paymentModalEl);
      paymentModal.show();
      resetSteps();
    }
  });
});

function selectProvider(provider) {
  selectedProvider = provider;
  document.getElementById('step1')?.classList.remove('active');
  document.getElementById('step2')?.classList.add('active');
}

function goToPinStep() {
  const phoneNumber = document.getElementById('phoneNumber')?.value.trim();
  if (!phoneNumber || !/^(07[78]\d{7}|075\d{7})$/.test(phoneNumber)) {
    alert('Enter a valid Ugandan phone number starting with 077, 078, or 075.');
    return;
  }
  alert(`Simulating payment prompt to your phone (${phoneNumber}) from ${selectedProvider.toUpperCase()}.`);
  document.getElementById('step2')?.classList.remove('active');
  document.getElementById('step3')?.classList.add('active');
}

function completePayment() {
  const pin = document.getElementById('pinInput')?.value.trim();
  if (!pin || pin.length !== 5) {
    alert('Enter a 5-digit PIN for demo purposes.');
    return;
  }
  document.getElementById('step3')?.classList.remove('active');
  document.getElementById('step4')?.classList.add('active');

  setTimeout(() => {
    alert(`Payment of ${currentAmount} UGX for ${currentItem} successful!`);
  }, 1000);
}

function resetSteps() {
  ['step1','step2','step3','step4'].forEach(id => document.getElementById(id)?.classList.remove('active'));
  document.getElementById('step1')?.classList.add('active');
  document.getElementById('phoneNumber')?.value = '';
  document.getElementById('pinInput')?.value = '';
  selectedProvider = '';
}

// =======================
// Fade-in Scroll Animations
// =======================
const faders = document.querySelectorAll('.fade-on-scroll, .animate-fade, .card.profile');
const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

faders.forEach(fader => appearOnScroll.observe(fader));

// =======================
// Fan Gallery Horizontal Scroll
// =======================
const fanGallery = document.querySelector('#fan-zone .row.g-2');
if (fanGallery) {
  let isDown = false, startX, scrollLeft;
  fanGallery.addEventListener('mousedown', e => {
    isDown = true;
    fanGallery.classList.add('active');
    startX = e.pageX - fanGallery.offsetLeft;
    scrollLeft = fanGallery.scrollLeft;
  });
  fanGallery.addEventListener('mouseleave', () => isDown = false);
  fanGallery.addEventListener('mouseup', () => isDown = false);
  fanGallery.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - fanGallery.offsetLeft;
    const walk = (x - startX) * 2;
    fanGallery.scrollLeft = scrollLeft - walk;
  });
}

// =======================
// YouTube API Fetch
// =======================
const apiKey = 'YOUR_YOUTUBE_API_KEY'; // Replace with valid key
const playlistId = 'UCr3cBLqIeJST4C5mvjoKVQ';

async function fetchYouTubeVideos() {
  const videosContainer = document.getElementById('youtube-videos');
  if (!videosContainer) return;
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=6&playlistId=${playlistId}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    videosContainer.innerHTML = '';

    if (data.items && data.items.length) {
      data.items.forEach(item => {
        const video = item.snippet;
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-3 animate-fade fade-on-scroll';
        col.innerHTML = `
          <div class="card h-100">
            <img src="${video.thumbnails.medium.url}" class="card-img-top" alt="${video.title}">
            <div class="card-body">
              <h5 class="card-title">${video.title}</h5>
              <p class="card-text">${video.description.substring(0, 100)}...</p>
              <a href="https://www.youtube.com/watch?v=${video.resourceId.videoId}" target="_blank" class="btn btn-primary btn-sm">Watch</a>
            </div>
          </div>`;
        videosContainer.appendChild(col);
      });
    } else {
      videosContainer.innerHTML = '<p>No videos found in this playlist.</p>';
    }
  } catch (err) {
    console.error(err);
    videosContainer.innerHTML = '<p>Could not load videos. Check API key.</p>';
  }
}

fetchYouTubeVideos();

// =======================
// Smooth Scroll for Navbar
// =======================
document.querySelectorAll('a.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 70,
        behavior: 'smooth'
      });
    }
  });
});
