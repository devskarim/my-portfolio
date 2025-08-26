// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger')
const navMenu = document.querySelector('.nav-menu')

hamburger.addEventListener('click', () => {
	hamburger.classList.toggle('active')
	navMenu.classList.toggle('active')
})

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n =>
	n.addEventListener('click', () => {
		hamburger.classList.remove('active')
		navMenu.classList.remove('active')
	})
)

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', function (e) {
		e.preventDefault()
		const target = document.querySelector(this.getAttribute('href'))
		if (target) {
			target.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			})
		}
	})
})

// Navbar background change on scroll
window.addEventListener('scroll', () => {
	const navbar = document.querySelector('.navbar')
	if (window.scrollY > 100) {
		navbar.style.background = 'rgba(255, 255, 255, 0.98)'
		navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)'
	} else {
		navbar.style.background = 'rgba(255, 255, 255, 0.95)'
		navbar.style.boxShadow = 'none'
	}
})

// Intersection Observer for animations
const observerOptions = {
	threshold: 0.1,
	rootMargin: '0px 0px -50px 0px',
}

const observer = new IntersectionObserver(entries => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			entry.target.style.opacity = '1'
			entry.target.style.transform = 'translateY(0)'
		}
	})
}, observerOptions)

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
	const animatedElements = document.querySelectorAll(
		'.project-card, .skill-item, .stat, .contact-item'
	)

	animatedElements.forEach(el => {
		el.style.opacity = '0'
		el.style.transform = 'translateY(30px)'
		el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
		observer.observe(el)
	})
})

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
	let i = 0
	element.innerHTML = ''

	function type() {
		if (i < text.length) {
			element.innerHTML += text.charAt(i)
			i++
			setTimeout(type, speed)
		}
	}

	type()
}

// Initialize typing animation when page loads
document.addEventListener('DOMContentLoaded', () => {
	const heroTitle = document.querySelector('.hero-title')
	if (heroTitle) {
		const originalText = heroTitle.textContent
		setTimeout(() => {
			typeWriter(heroTitle, originalText, 50)
		}, 1000)
	}
})

// Form submission handling
const contactForm = document.querySelector('.contact-form form')
if (contactForm) {
	contactForm.addEventListener('submit', e => {
		e.preventDefault()

		// Get form data
		const formData = new FormData(contactForm)
		const name = contactForm.querySelector('input[type="text"]').value
		const email = contactForm.querySelector('input[type="email"]').value
		const subject = contactForm.querySelectorAll('input[type="text"]')[1].value
		const message = contactForm.querySelector('textarea').value

		// Simple validation
		if (!name || !email || !subject || !message) {
			showNotification("Iltimos, barcha maydonlarni to'ldiring", 'error')
			return
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			showNotification("Iltimos, to'g'ri email manzilini kiriting", 'error')
			return
		}

		// Simulate form submission
		showNotification('Xabar yuborilmoqda...', 'info')

		setTimeout(() => {
			showNotification('Xabar muvaffaqiyatli yuborildi!', 'success')
			contactForm.reset()
		}, 2000)
	})
}

// Notification system
function showNotification(message, type = 'info') {
	// Remove existing notifications
	const existingNotification = document.querySelector('.notification')
	if (existingNotification) {
		existingNotification.remove()
	}

	// Create notification element
	const notification = document.createElement('div')
	notification.className = `notification notification-${type}`
	notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `

	// Add styles
	notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${
					type === 'success'
						? '#10b981'
						: type === 'error'
						? '#ef4444'
						: '#3b82f6'
				};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `

	// Add to page
	document.body.appendChild(notification)

	// Animate in
	setTimeout(() => {
		notification.style.transform = 'translateX(0)'
	}, 100)

	// Close button functionality
	const closeBtn = notification.querySelector('.notification-close')
	closeBtn.addEventListener('click', () => {
		notification.style.transform = 'translateX(100%)'
		setTimeout(() => notification.remove(), 300)
	})

	// Auto remove after 5 seconds
	setTimeout(() => {
		if (notification.parentNode) {
			notification.style.transform = 'translateX(100%)'
			setTimeout(() => notification.remove(), 300)
		}
	}, 5000)
}

// Skills progress animation
function animateSkills() {
	const skillBars = document.querySelectorAll('.skill-progress')

	const skillsObserver = new IntersectionObserver(
		entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const progressBar = entry.target
					const width = progressBar.style.width
					progressBar.style.width = '0%'

					setTimeout(() => {
						progressBar.style.width = width
					}, 500)

					skillsObserver.unobserve(progressBar)
				}
			})
		},
		{ threshold: 0.5 }
	)

	skillBars.forEach(bar => {
		skillsObserver.observe(bar)
	})
}

// Initialize skills animation
document.addEventListener('DOMContentLoaded', animateSkills)

// Parallax effect for hero section
window.addEventListener('scroll', () => {
	const scrolled = window.pageYOffset
	const hero = document.querySelector('.hero')
	const profileCard = document.querySelector('.profile-card')

	if (hero && profileCard) {
		const rate = scrolled * -0.5
		profileCard.style.transform = `translateY(${rate}px)`
	}
})

// Counter animation for stats
function animateCounters() {
	const counters = document.querySelectorAll('.stat h4')

	const counterObserver = new IntersectionObserver(
		entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const counter = entry.target
					const target = parseInt(counter.textContent.replace('+', ''))
					const increment = target / 100
					let current = 0

					const updateCounter = () => {
						if (current < target) {
							current += increment
							counter.textContent = Math.ceil(current) + '+'
							requestAnimationFrame(updateCounter)
						} else {
							counter.textContent = target + '+'
						}
					}

					updateCounter()
					counterObserver.unobserve(counter)
				}
			})
		},
		{ threshold: 0.5 }
	)

	counters.forEach(counter => {
		counterObserver.observe(counter)
	})
}

// Initialize counter animation
document.addEventListener('DOMContentLoaded', animateCounters)

// Add loading animation
window.addEventListener('load', () => {
	document.body.style.opacity = '0'
	document.body.style.transition = 'opacity 0.5s ease'

	setTimeout(() => {
		document.body.style.opacity = '1'
	}, 100)
})

// Add hover effects for project cards
document.addEventListener('DOMContentLoaded', () => {
	const projectCards = document.querySelectorAll('.project-card')

	projectCards.forEach(card => {
		card.addEventListener('mouseenter', () => {
			card.style.transform = 'translateY(-10px) scale(1.02)'
		})

		card.addEventListener('mouseleave', () => {
			card.style.transform = 'translateY(0) scale(1)'
		})
	})
})

// Add scroll to top functionality
function createScrollToTopButton() {
	const scrollBtn = document.createElement('button')
	scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>'
	scrollBtn.className = 'scroll-to-top'
	scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        font-size: 1.2rem;
    `

	document.body.appendChild(scrollBtn)

	// Show/hide button based on scroll position
	window.addEventListener('scroll', () => {
		if (window.pageYOffset > 300) {
			scrollBtn.style.opacity = '1'
			scrollBtn.style.visibility = 'visible'
		} else {
			scrollBtn.style.opacity = '0'
			scrollBtn.style.visibility = 'hidden'
		}
	})

	// Scroll to top functionality
	scrollBtn.addEventListener('click', () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		})
	})

	// Hover effect
	scrollBtn.addEventListener('mouseenter', () => {
		scrollBtn.style.background = '#1d4ed8'
		scrollBtn.style.transform = 'scale(1.1)'
	})

	scrollBtn.addEventListener('mouseleave', () => {
		scrollBtn.style.background = '#2563eb'
		scrollBtn.style.transform = 'scale(1)'
	})
}

// Initialize scroll to top button
document.addEventListener('DOMContentLoaded', createScrollToTopButton)
