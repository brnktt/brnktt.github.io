const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

// Scroll reveals — sections are visible by default; only armed when JS runs,
// so the page never ships blank without it.
if (!reduceMotion && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('reveal-ready')
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          io.unobserve(e.target)
        }
      }
    },
    { threshold: 0.1 },
  )
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
}

// Scrollspy: highlight the nav link of the section in view
const navLinks = [...document.querySelectorAll('.nav-link')]
if (navLinks.length && 'IntersectionObserver' in window) {
  const byId = Object.fromEntries(navLinks.map((a) => [a.hash.slice(1), a]))
  const spy = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          navLinks.forEach((a) => a.classList.remove('active'))
          byId[e.target.id]?.classList.add('active')
        }
      }
    },
    { rootMargin: '-40% 0px -55% 0px' },
  )
  Object.keys(byId).forEach((id) => {
    const el = document.getElementById(id)
    if (el) spy.observe(el)
  })
}

// Cursor-follow glow (fine pointers only; CSS hides it on touch)
if (!reduceMotion && matchMedia('(pointer: fine)').matches) {
  const root = document.documentElement
  let raf = 0
  addEventListener('pointermove', (e) => {
    if (raf) return
    raf = requestAnimationFrame(() => {
      root.style.setProperty('--mx', e.clientX + 'px')
      root.style.setProperty('--my', e.clientY + 'px')
      raf = 0
    })
  })
}

document.getElementById('year').textContent = new Date().getFullYear()
