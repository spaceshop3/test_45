// Age Verification
function confirmAge(isAdult) {
  const modal = document.getElementById("ageVerificationModal")

  if (!modal) return // Exit if modal doesn't exist

  if (isAdult) {
    localStorage.setItem("ageVerified", "true")
    modal.style.display = "none"

    // Show cookie consent after age verification
    setTimeout(() => {
      const cookieConsent = document.getElementById("cookieConsent")
      const cookiesAccepted = localStorage.getItem("cookiesAccepted")
      if (cookieConsent && !cookiesAccepted) {
        cookieConsent.classList.remove("hidden")
      }
    }, 500)
  } else {
    // Redirect to age-restricted page instead of external site
    window.location.href = "./age-restricted.html"
  }
}

// Check age verification on page load
window.addEventListener("DOMContentLoaded", () => {
  const ageVerified = localStorage.getItem("ageVerified")
  const modal = document.getElementById("ageVerificationModal")

  if (modal) {
    if (ageVerified === "true") {
      modal.style.display = "none"

      // Check cookie consent
      const cookiesAccepted = localStorage.getItem("cookiesAccepted")
      const cookieConsent = document.getElementById("cookieConsent")
      if (cookieConsent && !cookiesAccepted) {
        cookieConsent.classList.remove("hidden")
      }
    }
  }
})

// Cookie Consent
function acceptCookies() {
  localStorage.setItem("cookiesAccepted", "true")
  const cookieConsent = document.getElementById("cookieConsent")
  if (cookieConsent) {
    cookieConsent.style.display = "none"
  }
}

// Mobile Menu Toggle
const burgerMenu = document.getElementById("burgerMenu")
const mobileMenu = document.getElementById("mobileMenu")

if (burgerMenu) {
  burgerMenu.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden")
  })
}

// Close mobile menu when clicking a link
const mobileLinks = mobileMenu?.querySelectorAll("a")
if (mobileLinks) {
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden")
    })
  })
}

// Login Modal
function openLoginModal() {
  const modal = document.getElementById("loginModal")
  if (modal) {
    modal.classList.add("active")
    document.body.style.overflow = "hidden"
  }
  // Close mobile menu if open
  if (mobileMenu) {
    mobileMenu.classList.add("hidden")
  }
}

function closeLoginModal() {
  const modal = document.getElementById("loginModal")
  if (modal) {
    modal.classList.remove("active")
    document.body.style.overflow = "auto"
  }
}

// Register Modal
function openRegisterModal() {
  const modal = document.getElementById("registerModal")
  if (modal) {
    modal.classList.add("active")
    document.body.style.overflow = "hidden"
  }
  // Close mobile menu if open
  if (mobileMenu) {
    mobileMenu.classList.add("hidden")
  }
}

function closeRegisterModal() {
  const modal = document.getElementById("registerModal")
  if (modal) {
    modal.classList.remove("active")
    document.body.style.overflow = "auto"
  }
}

function showEmailConfirmModal() {
  const modal = document.getElementById("emailConfirmModal")
  if (modal) {
    modal.classList.add("active")
    document.body.style.overflow = "hidden"
  }
}

function closeEmailConfirmModal() {
  const modal = document.getElementById("emailConfirmModal")
  if (modal) {
    modal.classList.remove("active")
    document.body.style.overflow = "auto"
  }
}

// Close modals when clicking outside
window.addEventListener("click", (event) => {
  const loginModal = document.getElementById("loginModal")
  const registerModal = document.getElementById("registerModal")
  const emailConfirmModal = document.getElementById("emailConfirmModal")

  if (event.target === loginModal) {
    closeLoginModal()
  }
  if (event.target === registerModal) {
    closeRegisterModal()
  }
  if (event.target === emailConfirmModal) {
    closeEmailConfirmModal()
  }
})

// Form Validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function validatePassword(password) {
  // At least 6 characters
  return password.length >= 6
}

// Login Form Submit
const loginForm = document.getElementById("loginForm")
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const email = document.getElementById("loginEmail").value
    const password = document.getElementById("loginPassword").value
    const errorDiv = document.getElementById("loginError")
    const submitBtn = loginForm.querySelector('button[type="submit"]')

    // Reset error
    errorDiv.classList.remove("active")
    errorDiv.style.display = "none"
    errorDiv.textContent = ""

    // Validate
    if (!validateEmail(email)) {
      errorDiv.textContent = "Please enter a valid email address"
      errorDiv.style.display = "block"
      errorDiv.classList.add("active")
      return
    }

    if (!validatePassword(password)) {
      errorDiv.textContent = "Password must be at least 6 characters"
      errorDiv.style.display = "block"
      errorDiv.classList.add("active")
      return
    }

    // Show loading state
    const originalText = submitBtn.innerHTML
    submitBtn.innerHTML = '<span class="spinner"></span> Logging in...'
    submitBtn.disabled = true

    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)

      const response = await fetch("./login.php", { method: "POST", body: formData })
      const data = await response.json()

      if (data.success) {
        localStorage.setItem("userLoggedIn", "true")
        showNotification("Login successful!")
        closeLoginModal()

        if (typeof checkout === "function") {
          setTimeout(() => {
            checkout()
          }, 500)
          return
        }

        window.location.href = data.redirect || "./dashboard.html"
        return
      }

      errorDiv.textContent = data.message || "Login failed. Please try again."
      errorDiv.style.display = "block"
      errorDiv.classList.add("active")
    } catch (err) {
      errorDiv.textContent = "An error occurred. Please try again."
      errorDiv.style.display = "block"
      errorDiv.classList.add("active")
    } finally {
      submitBtn.innerHTML = originalText
      submitBtn.disabled = false
    }
  })
}

// Register Form Submit (single source of truth)
const registerForm = document.getElementById("registerForm")
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const name = document.getElementById("registerName").value.trim()
    const email = document.getElementById("registerEmail").value.trim()
    const password = document.getElementById("registerPassword").value
    const confirmPassword = document.getElementById("registerConfirmPassword").value
    const terms = document.getElementById("registerTerms").checked

    const errorDiv = document.getElementById("registerError")
    const submitBtn = registerForm.querySelector('button[type="submit"]')

    // reset ui
    errorDiv.classList.remove("active")
    errorDiv.style.display = "none"
    errorDiv.textContent = ""

    // validate
    if (name.length < 2) {
      errorDiv.textContent = "Please enter your name"
      errorDiv.style.display = "block"
      errorDiv.classList.add("active")
      return
    }
    if (!validateEmail(email)) {
      errorDiv.textContent = "Please enter a valid email address"
      errorDiv.style.display = "block"
      errorDiv.classList.add("active")
      return
    }
    if (!validatePassword(password)) {
      errorDiv.textContent = "Password must be at least 6 characters"
      errorDiv.style.display = "block"
      errorDiv.classList.add("active")
      return
    }
    if (password !== confirmPassword) {
      errorDiv.textContent = "Passwords do not match"
      errorDiv.style.display = "block"
      errorDiv.classList.add("active")
      return
    }
    if (!terms) {
      errorDiv.textContent = "Please accept the Terms & Conditions"
      errorDiv.style.display = "block"
      errorDiv.classList.add("active")
      return
    }

    // loading state
    const originalText = submitBtn.innerHTML
    submitBtn.innerHTML = '<span class="spinner"></span> Creating account...'
    submitBtn.disabled = true

    try {
      const formData = new FormData()
      formData.append("fullname", name)
      formData.append("email", email)
      formData.append("password", password)

      const response = await fetch("./register.php", { method: "POST", body: formData })
      const data = await response.json()

      if (data.success) {
        localStorage.removeItem("userLoggedIn")

        closeRegisterModal()
        showEmailConfirmModal()

        registerForm.reset()
        return
      }

      const msg = (data.message || "Registration failed. Please try again.").toLowerCase()
      if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
        errorDiv.textContent = "Email already registered. Please login."
      } else {
        errorDiv.textContent = data.message || "Registration failed. Please try again."
      }

      errorDiv.style.display = "block"
      errorDiv.classList.add("active")
    } catch (err) {
      errorDiv.textContent = "An error occurred. Please try again."
      errorDiv.style.display = "block"
      errorDiv.classList.add("active")
    } finally {
      submitBtn.innerHTML = originalText
      submitBtn.disabled = false
    }
  })
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href")
    if (href !== "#") {
      e.preventDefault()
      const target = document.querySelector(href)
      if (target) {
        const headerOffset = 80
        const elementPosition = target.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        })
      }
    }
  })
})

let scrollTimeout
let lastScrollTop = 0

window.addEventListener(
  "scroll",
  () => {
    if (scrollTimeout) return

    scrollTimeout = setTimeout(() => {
      const currentScroll = window.pageYOffset
      const header = document.querySelector("header")

      if (!header) {
        scrollTimeout = null
        return
      }

      if (currentScroll > 100) {
        header.style.background = "rgba(0, 0, 0, 0.95)"
      } else {
        header.style.background = "rgba(0, 0, 0, 0.8)"
      }

      lastScrollTop = currentScroll
      scrollTimeout = null
    }, 50)
  },
  { passive: true },
)

// Escape key to close modals
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeLoginModal()
    closeRegisterModal()
    closeEmailConfirmModal()
  }
})

// Prevent body scroll when modal is open
function updateBodyScroll() {
  const loginModal = document.getElementById("loginModal")
  const registerModal = document.getElementById("registerModal")
  const emailConfirmModal = document.getElementById("emailConfirmModal")

  if (
    loginModal?.classList.contains("active") ||
    registerModal?.classList.contains("active") ||
    emailConfirmModal?.classList.contains("active")
  ) {
    document.body.style.overflow = "hidden"
  } else {
    document.body.style.overflow = "auto"
  }
}

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-fade-in")
      observer.unobserve(entry.target)
    }
  })
}, observerOptions)

const elementsToObserve = document.querySelectorAll(".game-card, .feature-card")
if (elementsToObserve.length > 0) {
  elementsToObserve.forEach((el) => {
    observer.observe(el)
  })
}
