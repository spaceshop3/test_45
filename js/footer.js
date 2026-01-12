(() => {
  const loadFooter = async () => {
    try {
      const response = await fetch("./footer.html")
      if (!response.ok) {
        throw new Error(`Failed to fetch footer (${response.status})`)
      }

      const html = await response.text()
      const wrapper = document.createElement("div")
      wrapper.innerHTML = html.trim()
      const footerElement = wrapper.querySelector(".site-footer")

      if (!footerElement) {
        console.warn("Footer template missing .site-footer root")
        return
      }

      const mountPoint = document.getElementById("footerMountPoint")

      if (mountPoint) {
        mountPoint.replaceWith(footerElement)
      } else if (!document.querySelector(".site-footer")) {
        document.body.appendChild(footerElement)
      } else {
        const existing = document.querySelector(".site-footer")
        existing.replaceWith(footerElement)
      }
    } catch (error) {
      console.error("Unable to load footer template:", error)
    }
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", loadFooter)
  } else {
    loadFooter()
  }
})()
