"use strict";

function changeMode() {
  document.body.classList.toggle("dark-mode");
}

function calculateCost() {
  const people = Number(document.getElementById("people")?.value);
  const days = Number(document.getElementById("days")?.value);
  const result = document.getElementById("result");

  if (!result) return;

  if (!Number.isInteger(people) || people < 1 ||
      !Number.isInteger(days) || days < 1) {
    result.textContent = "Please enter a valid number of people and days.";
    return;
  }

  result.textContent = `Total = M${people * days * 300}`;
}

function bookNow(place, price) {
  const message = document.getElementById("bookingMessage");

  if (message) {
    message.textContent =
      `You selected ${place} - M${price} - Going to booking form...`;
  }

  localStorage.setItem("selectedPlace", place);
  localStorage.setItem("selectedPrice", price);

  alert(
    `You booked: ${place} for M${price}. You will now go to Contact page to finish booking.`
  );

  window.location.href = "contact.html";
}
      function showOffice() {
  const officeInfo = document.getElementById("officeInfo");

  if (!officeInfo) return;

  officeInfo.textContent =
    "We are located in Maseru, near the main taxi rank. Open Monday to Saturday, 8am to 5pm.";

  localStorage.setItem("officeViewed", "yes");
}

let cart = [];

try {
  cart = JSON.parse(localStorage.getItem("destinationCart")) || [];
  if (!Array.isArray(cart)) cart = [];
} catch {
  cart = [];
}

function renderCart() {
  const table = document.getElementById("cartTable");
  const totalElement = document.getElementById("totalPrice");
  if (!table || !totalElement) return;

  if (cart.length === 0) {
    table.innerHTML =
      '<tr><td colspan="3" class="text-center">Your cart is empty.</td></tr>';
    totalElement.textContent = "Total: M0";
    localStorage.removeItem("destinationCart");
    localStorage.setItem("cartTotal", "0");
    return;
  }

  let total = 0;

  table.innerHTML = cart.map((item, index) => {
    const price = Number(item.price) || 0;
    total += price;

    return `
      <tr>
        <td>${escapeHTML(item.name)}</td>
        <td>M${price}</td>
        <td>
          <button type="button" class="btn btn-sm btn-outline-danger"
            onclick="removeFromCart(${index})"
            aria-label="Remove ${escapeHTML(item.name)}">
            Remove
          </button>
        </td>
      </tr>`;
  }).join("");

  totalElement.textContent = "Total: M" + total;
  localStorage.setItem("destinationCart", JSON.stringify(cart));
  localStorage.setItem("cartTotal", String(total));
}

function addToCart(name, price) {
  cart.push({ name, price: Number(price) || 0 });
  renderCart();

  const message = document.getElementById("bookingMessage");
  if (message) message.textContent = name + " added to your cart.";
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();

  const message = document.getElementById("bookingMessage");
  if (message) message.textContent = "";
}

function clearCart() {
  cart = [];
  renderCart();

  const message = document.getElementById("bookingMessage");
  if (message) message.textContent = "Your cart has been cleared.";
}

function bookNow() {
  const message = document.getElementById("bookingMessage");

  if (cart.length === 0) {
    if (message) {
      message.textContent = "Add a destination to your cart before booking.";
    }
    return;
  }

  localStorage.setItem("selectedPlace", cart[cart.length - 1].name);
  window.location.href = "contact.html";
}

function searchDestination(event) {
  event.preventDefault();

  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const cards = document.querySelectorAll(".destination-item");
  let found = 0;

  cards.forEach(card => {
    const matches = card.textContent.toLowerCase().includes(query);
    card.style.display = matches ? "" : "none";
    if (matches) found++;
  });

  const result = document.getElementById("searchResult");
  if (result) {
    result.textContent = query
      ? `Found ${found} destination${found === 1 ? "" : "s"} for “${query}”.`
      : "";
  }
}

function filterDestinations(category) {
  const cards = document.querySelectorAll(".destination-item");
  let found = 0;

  cards.forEach(card => {
    const matches = category === "all" || card.classList.contains(category);
    card.style.display = matches ? "" : "none";
    if (matches) found++;
  });

  const result = document.getElementById("searchResult");
  if (result) {
    result.textContent = category === "all"
      ? ""
      : `Showing ${found} ${category} destination${found === 1 ? "" : "s"}.`;
  }
}


function escapeHTML(value) {
  const element = document.createElement("span");
  element.textContent = value;
  return element.innerHTML;
}

renderCart();
const galleryImages = Array.from(
  document.querySelectorAll(".gallery-item img")
);

let current = 0;

function showImage(smallImg) {
  const bigImage = document.getElementById("bigImage");
  const modalImage = document.getElementById("modalImage");

  if (!bigImage || !modalImage) return;

  bigImage.src = smallImg.src;
  bigImage.alt = smallImg.alt;
  modalImage.src = smallImg.src;
  modalImage.alt = smallImg.alt;

  current = galleryImages.indexOf(smallImg);
  localStorage.setItem("lastViewedImage", smallImg.alt);
}

function showCurrentImage() {
  if (galleryImages.length === 0) return;

  const image = galleryImages[current];
  const bigImage = document.getElementById("bigImage");
  const modalImage = document.getElementById("modalImage");

  if (!bigImage || !modalImage) return;

  bigImage.src = image.src;
  bigImage.alt = image.alt;
  modalImage.src = image.src;
  modalImage.alt = image.alt;
}

function nextImage() {
  if (galleryImages.length === 0) return;
  current = (current + 1) % galleryImages.length;
  showCurrentImage();
}

function prevImage() {
  if (galleryImages.length === 0) return;
  current = (current - 1 + galleryImages.length) % galleryImages.length;
  showCurrentImage();
}

function filterImages(category) {
  document.querySelectorAll(".gallery-item").forEach(card => {
    card.style.display =
      category === "all" || card.classList.contains(category) ? "" : "none";
  });
}
