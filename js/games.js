// Game configurations
const gameConfigs = {
  lottoMax: {
    name: "Lotto Max",
    maxNumbers: 7,
    poolSize: 50,
    price: 5.0,
  },
  lotto649: {
    name: "Lotto 6/49",
    maxNumbers: 6,
    poolSize: 49,
    price: 3.0,
  },
  dailyGrand: {
    name: "Daily Grand",
    maxNumbers: 5,
    poolSize: 35,
    price: 2.0,
  },
}

// Store selected numbers for each game
const selectedNumbers = {
  lottoMax: [],
  lotto649: [],
  dailyGrand: [],
}

// Cart data
let cart = []

// Initialize games on page load
document.addEventListener("DOMContentLoaded", () => {
  initializeGame("lottoMax")
  initializeGame("lotto649")
  initializeGame("dailyGrand")
  updateCart()
})

// Initialize a game grid
function initializeGame(gameId) {
  const config = gameConfigs[gameId]
  const grid = document.getElementById(`${gameId}Grid`)

  if (!grid) return

  grid.innerHTML = ""

  for (let i = 1; i <= config.poolSize; i++) {
    const button = document.createElement("button")
    button.textContent = i
    button.className =
      "number-btn w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 hover:border-red-500 transition font-semibold text-sm"
    button.dataset.number = i
    button.dataset.game = gameId
    button.onclick = () => toggleNumber(gameId, i, button)
    grid.appendChild(button)
  }
}

// Toggle number selection
let toggleTimeout
function toggleNumber(gameId, number, button) {
  if (toggleTimeout) return

  toggleTimeout = setTimeout(() => {
    toggleTimeout = null
  }, 100)

  const config = gameConfigs[gameId]
  const index = selectedNumbers[gameId].indexOf(number)

  if (index > -1) {
    // Remove number
    selectedNumbers[gameId].splice(index, 1)
    button.classList.remove("bg-red-600", "border-red-500")
    button.classList.add("bg-gray-800", "border-gray-700")
  } else {
    // Add number if not at max
    if (selectedNumbers[gameId].length < config.maxNumbers) {
      selectedNumbers[gameId].push(number)
      button.classList.remove("bg-gray-800", "border-gray-700")
      button.classList.add("bg-red-600", "border-red-500")
    } else {
      // Show warning
      showNotification(`You can only select ${config.maxNumbers} numbers for ${config.name}`)
    }
  }

  updateCounter(gameId)
}

// Update selection counter
function updateCounter(gameId) {
  const config = gameConfigs[gameId]
  const counter = document.getElementById(`${gameId}Count`)
  if (counter) {
    counter.textContent = `${selectedNumbers[gameId].length} / ${config.maxNumbers}`
  }
}

// Randomize numbers for a game
function randomizeNumbers(gameId) {
  const config = gameConfigs[gameId]
  const grid = document.getElementById(`${gameId}Grid`)

  // Clear current selection
  selectedNumbers[gameId] = []
  const buttons = grid.querySelectorAll(".number-btn")
  buttons.forEach((btn) => {
    btn.classList.remove("bg-red-600", "border-red-500")
    btn.classList.add("bg-gray-800", "border-gray-700")
  })

  // Generate random numbers
  const randomNumbers = []
  while (randomNumbers.length < config.maxNumbers) {
    const randomNum = Math.floor(Math.random() * config.poolSize) + 1
    if (!randomNumbers.includes(randomNum)) {
      randomNumbers.push(randomNum)
    }
  }

  // Select the random numbers
  randomNumbers.forEach((num) => {
    selectedNumbers[gameId].push(num)
    const button = grid.querySelector(`[data-number="${num}"]`)
    if (button) {
      button.classList.remove("bg-gray-800", "border-gray-700")
      button.classList.add("bg-red-600", "border-red-500")
    }
  })

  updateCounter(gameId)
  showNotification(`Random numbers generated for ${config.name}!`)
}

// Add ticket to cart
function addToCart(gameId) {
  const config = gameConfigs[gameId]

  if (selectedNumbers[gameId].length !== config.maxNumbers) {
    showNotification(`Please select exactly ${config.maxNumbers} numbers for ${config.name}`)
    return
  }

  const ticket = {
    id: Date.now(),
    game: gameId,
    gameName: config.name,
    numbers: [...selectedNumbers[gameId]].sort((a, b) => a - b),
    price: config.price,
  }

  cart.push(ticket)

  // Clear selection
  selectedNumbers[gameId] = []
  const grid = document.getElementById(`${gameId}Grid`)
  const buttons = grid.querySelectorAll(".number-btn")
  buttons.forEach((btn) => {
    btn.classList.remove("bg-red-600", "border-red-500")
    btn.classList.add("bg-gray-800", "border-gray-700")
  })

  updateCounter(gameId)
  updateCart()
  showNotification(`Ticket added to cart!`)
}

const gameOffers = {
  digitalWarfare: {
    name: "Digital Warfare",
    description: "Tactical arenas with rapid draws.",
    price: 5.0,
  },
  mysticRealms: {
    name: "Mystic Realms",
    description: "Adventure drops with cinematic reveals.",
    price: 6.0,
  },
  velocityRush: {
    name: "Velocity Rush",
    description: "Neon circuits with high-octane stakes.",
    price: 5.5,
  },
}

function addGameOffer(offerId) {
  const offer = gameOffers[offerId]
  if (!offer) return

  const ticket = {
    id: Date.now() + Math.random(),
    game: `offer-${offerId}`,
    gameName: offer.name,
    numbers: [],
    price: offer.price,
    meta: offer.description,
  }

  cart.push(ticket)
  updateCart()
  showNotification(`${offer.name} added to cart`)
}

// Add pre-configured bundle
function addBundle(bundleId) {
  const bundles = {
    starter: {
      title: "Solo Collector",
      description: "3 curated tickets with priority support.",
      quantity: 3,
      price: 5.0,
    },
    premium: {
      title: "Team Blitz",
      description: "7 tickets + 2 bonus entries.",
      quantity: 7,
      price: 5.0,
    },
    elite: {
      title: "Event Vault",
      description: "12 tickets + live draw notifications.",
      quantity: 12,
      price: 4.5,
    },
  }

  const bundle = bundles[bundleId]
  if (!bundle) return

  const ticket = {
    id: Date.now(),
    game: `bundle-${bundleId}`,
    gameName: `${bundle.title} Bundle`,
    numbers: Array(bundle.quantity)
      .fill(0)
      .map((_, i) => i + 1),
    price: bundle.price,
    meta: bundle.description,
  }

  cart.push(ticket)
  showNotification(`${bundle.title} added to cart`)
  updateCart()
}

// Update cart display
function updateCart() {
  const cartItemsDiv = document.getElementById("cartItems")
  const cartCountSpan = document.getElementById("cartCount")
  const subtotalSpan = document.getElementById("subtotal")
  const taxesSpan = document.getElementById("taxes")
  const totalSpan = document.getElementById("total")

  if (!cartItemsDiv) return

  cartCountSpan.textContent = cart.length

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = `
      <div class="text-center text-gray-400 py-8">
        No tickets yet. Add a ticket from any game.
      </div>
    `
    subtotalSpan.textContent = "$0.00"
    taxesSpan.textContent = "$0.00"
    totalSpan.textContent = "$0.00"
    return
  }

  // Render cart items
  const fragment = document.createDocumentFragment()

  cart.forEach((ticket) => {
    const div = document.createElement("div")
    div.className = "flex items-center justify-between bg-gray-900 bg-opacity-50 p-4 rounded-lg"
    div.innerHTML = `
      <div class="flex-1">
        <div class="font-semibold text-white">${ticket.gameName}</div>
        <div class="text-sm text-gray-400">Numbers: ${ticket.numbers.join(", ")}</div>
      </div>
      <div class="flex items-center gap-4">
        <div class="text-red-500 font-semibold">$${ticket.price.toFixed(2)}</div>
        <button onclick="removeFromCart(${ticket.id})" class="text-gray-400 hover:text-red-500 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    `
    fragment.appendChild(div)
  })

  cartItemsDiv.innerHTML = ""
  cartItemsDiv.appendChild(fragment)

  // Calculate totals
  const subtotal = cart.reduce((sum, ticket) => sum + ticket.price, 0)
  const taxes = subtotal * 0.13 // 13% tax
  const total = subtotal + taxes

  subtotalSpan.textContent = `$${subtotal.toFixed(2)}`
  taxesSpan.textContent = `$${taxes.toFixed(2)}`
  totalSpan.textContent = `$${total.toFixed(2)}`
}

// Remove ticket from cart
function removeFromCart(ticketId) {
  cart = cart.filter((ticket) => ticket.id !== ticketId)
  updateCart()
  showNotification("Ticket removed from cart")
}

// Checkout function
async function checkout() {
  if (cart.length === 0) {
    showNotification("Your cart is empty. Please add tickets before checkout.")
    return
  }

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("userLoggedIn") === "true"

  if (!isLoggedIn) {
    // Show registration modal
    openRegisterModal()
    return
  }

  // User is logged in, proceed to payment
  const checkoutBtn = document.querySelector('button[onclick="checkout()"]')
  if (checkoutBtn) {
    checkoutBtn.disabled = true
    checkoutBtn.textContent = "Processing..."
  }

  try {
    // Calculate totals
    const subtotal = cart.reduce((sum, ticket) => sum + ticket.price, 0)
    const taxes = subtotal * 0.13
    const total = subtotal + taxes

    // Prepare form data
    const formData = new FormData()
    formData.append("cart", JSON.stringify(cart))
    formData.append("subtotal", subtotal.toFixed(2))
    formData.append("taxes", taxes.toFixed(2))
    formData.append("total", total.toFixed(2))

    const response = await fetch("checkout.php", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()

    if (data.success) {
      showNotification("Order placed successfully!")
      // Clear cart
      cart = []
      updateCart()

      // Reset button
      if (checkoutBtn) {
        checkoutBtn.disabled = false
        checkoutBtn.textContent = "Proceed to Checkout"
      }

      // Show success message
      setTimeout(() => {
        alert(`Thank you for your purchase!\nOrder ID: ${data.order_id}`)
      }, 500)
    } else {
      showNotification(data.message || "Checkout failed. Please try again.")
      if (checkoutBtn) {
        checkoutBtn.disabled = false
        checkoutBtn.textContent = "Proceed to Checkout"
      }

      // If needs login, show login modal
      if (data.redirect === "login") {
        localStorage.removeItem("userLoggedIn")
        setTimeout(() => {
          openLoginModal()
        }, 1000)
      }
    }
  } catch (error) {
    console.error("Checkout error:", error)
    showNotification("An error occurred during checkout. Please try again.")
    if (checkoutBtn) {
      checkoutBtn.disabled = false
      checkoutBtn.textContent = "Proceed to Checkout"
    }
  }
}

// Modal functions for tickets page
function openRegisterModal() {
  const loginModal = document.getElementById("loginModal")
  const registerModal = document.getElementById("registerModal")

  if (loginModal) {
    loginModal.classList.remove("active")
  }

  setTimeout(() => {
    if (registerModal) {
      registerModal.classList.add("active")
      document.body.style.overflow = "hidden"
    }
  }, 150)
}

function closeRegisterModal() {
  const modal = document.getElementById("registerModal")
  if (modal) {
    modal.classList.remove("active")
    document.body.style.overflow = "auto"
  }
}

function openLoginModal() {
  const registerModal = document.getElementById("registerModal")
  const loginModal = document.getElementById("loginModal")

  if (registerModal) {
    registerModal.classList.remove("active")
  }

  setTimeout(() => {
    if (loginModal) {
      loginModal.classList.add("active")
      document.body.style.overflow = "hidden"
    }
  }, 150)
}

function closeLoginModal() {
  const modal = document.getElementById("loginModal")
  if (modal) {
    modal.classList.remove("active")
    document.body.style.overflow = "auto"
  }
}

function switchToRegister() {
  closeLoginModal()
  setTimeout(() => {
    openRegisterModal()
  }, 100)
}

function switchToLogin() {
  closeRegisterModal()
  setTimeout(() => {
    openLoginModal()
  }, 100)
}

// Notification system
let notificationTimeout
function showNotification(message) {
  // Clear existing timeout
  if (notificationTimeout) {
    clearTimeout(notificationTimeout)
  }

  // Remove existing notification
  const existing = document.querySelector(".notification")
  if (existing) {
    existing.remove()
  }

  const notification = document.createElement("div")
  notification.className =
    "notification fixed top-24 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in"
  notification.textContent = message

  document.body.appendChild(notification)

  notificationTimeout = setTimeout(() => {
    notification.style.opacity = "0"
    notification.style.transform = "translateY(-20px)"
    notification.style.transition = "all 0.3s ease"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove()
      }
    }, 300)
  }, 3000)
}

// Close modals when clicking outside
window.addEventListener(
  "click",
  (event) => {
    const loginModal = document.getElementById("loginModal")
    const registerModal = document.getElementById("registerModal")

    if (event.target === loginModal && loginModal.classList.contains("active")) {
      closeLoginModal()
    }
    if (event.target === registerModal && registerModal.classList.contains("active")) {
      closeRegisterModal()
    }
  },
  { passive: true },
)
