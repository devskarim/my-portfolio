// Loading Screen
document.addEventListener('DOMContentLoaded', function () {
	const loadingScreen = document.querySelector('.loading-screen')

	setTimeout(() => {
		loadingScreen.classList.add('hidden')
		setTimeout(() => {
			loadingScreen.style.display = 'none'
		}, 500)
	}, 2000)
})

// 3D Background
class Background3D {
	constructor() {
		this.canvas = document.getElementById('bg-canvas')
		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		)
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
			alpha: true,
		})
		this.particles = []
		this.mouseX = 0
		this.mouseY = 0

		this.init()
	}

	init() {
		this.renderer.setSize(window.innerWidth, window.innerHeight)
		this.renderer.setClearColor(0x000000, 0)

		// Create particles
		const geometry = new THREE.SphereGeometry(0.1, 8, 8)
		const material = new THREE.MeshBasicMaterial({
			color: 0x6366f1,
			transparent: true,
			opacity: 0.6,
		})

		for (let i = 0; i < 100; i++) {
			const particle = new THREE.Mesh(geometry, material)
			particle.position.set(
				Math.random() * 200 - 100,
				Math.random() * 200 - 100,
				Math.random() * 200 - 100
			)
			particle.velocity = {
				x: (Math.random() - 0.5) * 0.02,
				y: (Math.random() - 0.5) * 0.02,
				z: (Math.random() - 0.5) * 0.02,
			}
			this.particles.push(particle)
			this.scene.add(particle)
		}

		this.camera.position.z = 50

		// Mouse movement
		document.addEventListener('mousemove', e => {
			this.mouseX = (e.clientX / window.innerWidth) * 2 - 1
			this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1
		})

		this.animate()

		// Resize handler
		window.addEventListener('resize', () => {
			this.camera.aspect = window.innerWidth / window.innerHeight
			this.camera.updateProjectionMatrix()
			this.renderer.setSize(window.innerWidth, window.innerHeight)
		})
	}

	animate() {
		requestAnimationFrame(() => this.animate())

		// Update particles
		this.particles.forEach(particle => {
			particle.position.x += particle.velocity.x
			particle.position.y += particle.velocity.y
			particle.position.z += particle.velocity.z

			// Wrap around edges
			if (particle.position.x > 100) particle.position.x = -100
			if (particle.position.x < -100) particle.position.x = 100
			if (particle.position.y > 100) particle.position.y = -100
			if (particle.position.y < -100) particle.position.y = 100
			if (particle.position.z > 100) particle.position.z = -100
			if (particle.position.z < -100) particle.position.z = 100

			// Rotate
			particle.rotation.x += 0.01
			particle.rotation.y += 0.01
		})

		// Camera movement based on mouse
		this.camera.position.x += (this.mouseX * 10 - this.camera.position.x) * 0.05
		this.camera.position.y += (this.mouseY * 10 - this.camera.position.y) * 0.05
		this.camera.lookAt(this.scene.position)

		this.renderer.render(this.scene, this.camera)
	}
}

// Mobile Navigation
class MobileNav {
	constructor() {
		this.hamburger = document.querySelector('.hamburger')
		this.navMenu = document.querySelector('.nav-menu')
		this.navLinks = document.querySelectorAll('.nav-link')

		this.init()
	}

	init() {
		this.hamburger.addEventListener('click', () => {
			this.hamburger.classList.toggle('active')
			this.navMenu.classList.toggle('active')
		})

		this.navLinks.forEach(link => {
			link.addEventListener('click', () => {
				this.hamburger.classList.remove('active')
				this.navMenu.classList.remove('active')
			})
		})
	}
}

// Smooth Scrolling
class SmoothScroll {
	constructor() {
		this.navLinks = document.querySelectorAll('.nav-link[href^="#"]')
		this.init()
	}

	init() {
		this.navLinks.forEach(link => {
			link.addEventListener('click', e => {
				e.preventDefault()
				const targetId = link.getAttribute('href')
				const targetSection = document.querySelector(targetId)

				if (targetSection) {
					targetSection.scrollIntoView({
						behavior: 'smooth',
						block: 'start',
					})
				}
			})
		})
	}
}

// Typing Animation
class TypingAnimation {
	constructor(element, texts, speed = 100) {
		this.element = element
		this.texts = texts
		this.speed = speed
		this.currentTextIndex = 0
		this.currentCharIndex = 0
		this.isDeleting = false

		this.type()
	}

	type() {
		const currentText = this.texts[this.currentTextIndex]

		if (this.isDeleting) {
			this.element.textContent = currentText.substring(
				0,
				this.currentCharIndex - 1
			)
			this.currentCharIndex--
		} else {
			this.element.textContent = currentText.substring(
				0,
				this.currentCharIndex + 1
			)
			this.currentCharIndex++
		}

		let typeSpeed = this.speed

		if (this.isDeleting) {
			typeSpeed /= 2
		}

		if (!this.isDeleting && this.currentCharIndex === currentText.length) {
			typeSpeed = 2000 // Pause at end
			this.isDeleting = true
		} else if (this.isDeleting && this.currentCharIndex === 0) {
			this.isDeleting = false
			this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length
			typeSpeed = 500 // Pause before next word
		}

		setTimeout(() => this.type(), typeSpeed)
	}
}

// Counter Animation
class CounterAnimation {
	constructor() {
		this.counters = document.querySelectorAll('[data-target]')
		this.init()
	}

	init() {
		const observer = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					this.animateCounter(entry.target)
					observer.unobserve(entry.target)
				}
			})
		})

		this.counters.forEach(counter => {
			observer.observe(counter)
		})
	}

	animateCounter(counter) {
		const target = parseInt(counter.getAttribute('data-target'))
		const duration = 2000
		const step = target / (duration / 16)
		let current = 0

		const timer = setInterval(() => {
			current += step
			if (current >= target) {
				current = target
				clearInterval(timer)
			}
			counter.textContent = Math.floor(current)
		}, 16)
	}
}

// GSAP Animations
class GSAPAnimations {
	constructor() {
		this.init()
	}

	init() {
		// Hero animations
		gsap.from('.hero-title', {
			duration: 1,
			y: 100,
			opacity: 0,
			ease: 'power3.out',
		})

		gsap.from('.hero-subtitle', {
			duration: 1,
			y: 50,
			opacity: 0,
			delay: 0.3,
			ease: 'power3.out',
		})

		gsap.from('.hero-description', {
			duration: 1,
			y: 50,
			opacity: 0,
			delay: 0.6,
			ease: 'power3.out',
		})

		gsap.from('.hero-buttons', {
			duration: 1,
			y: 50,
			opacity: 0,
			delay: 0.9,
			ease: 'power3.out',
		})

		gsap.from('.floating-card', {
			duration: 1,
			scale: 0,
			opacity: 0,
			delay: 1.2,
			stagger: 0.2,
			ease: 'back.out(1.7)',
		})

		// About section
		gsap.from('.about-text', {
			scrollTrigger: {
				trigger: '.about',
				start: 'top 80%',
			},
			duration: 1,
			x: -100,
			opacity: 0,
			ease: 'power3.out',
		})

		gsap.from('.code-editor', {
			scrollTrigger: {
				trigger: '.about',
				start: 'top 80%',
			},
			duration: 1,
			x: 100,
			opacity: 0,
			delay: 0.3,
			ease: 'power3.out',
		})

		// Timeline animations
		gsap.from('.timeline-item', {
			scrollTrigger: {
				trigger: '.timeline',
				start: 'top 80%',
			},
			duration: 1,
			y: 100,
			opacity: 0,
			stagger: 0.3,
			ease: 'power3.out',
		})

		// Project cards
		gsap.from('.project-card', {
			scrollTrigger: {
				trigger: '.projects-grid',
				start: 'top 80%',
			},
			duration: 1,
			y: 100,
			opacity: 0,
			stagger: 0.2,
			ease: 'power3.out',
		})

		// Skill cards
		gsap.from('.skill-card', {
			scrollTrigger: {
				trigger: '.skills-grid',
				start: 'top 80%',
			},
			duration: 1,
			y: 100,
			opacity: 0,
			stagger: 0.1,
			ease: 'power3.out',
		})
	}
}

// Skill Progress Animation
class SkillProgress {
	constructor() {
		this.progressBars = document.querySelectorAll('.progress-fill')
		this.init()
	}

	init() {
		const observer = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const progress = entry.target.getAttribute('data-progress')
					entry.target.style.width = progress + '%'
					observer.unobserve(entry.target)
				}
			})
		})

		this.progressBars.forEach(bar => {
			observer.observe(bar)
		})
	}
}

// Parallax Effect
class ParallaxEffect {
	constructor() {
		this.floatingCards = document.querySelectorAll('.floating-card')
		this.init()
	}

	init() {
		window.addEventListener('scroll', () => {
			const scrolled = window.pageYOffset

			this.floatingCards.forEach(card => {
				const speed = card.getAttribute('data-speed') || 0.5
				const yPos = -(scrolled * speed)
				card.style.transform = `translateY(${yPos}px)`
			})
		})
	}
}

// Contact Form
class ContactForm {
	constructor() {
		this.form = document.getElementById('contactForm')
		this.init()
	}

	init() {
		this.form.addEventListener('submit', e => {
			e.preventDefault()
			this.submitForm()
		})
	}

	async submitForm() {
		const formData = new FormData(this.form)
		const data = {
			name: formData.get('name'),
			email: formData.get('email'),
			subject: formData.get('subject'),
			message: formData.get('message'),
		}

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			})

			const result = await response.json()

			if (result.success) {
				this.showNotification(result.message, 'success')
				this.form.reset()
			} else {
				this.showNotification(
					"Xatolik yuz berdi. Qaytadan urinib ko'ring.",
					'error'
				)
			}
		} catch (error) {
			this.showNotification(
				"Xatolik yuz berdi. Qaytadan urinib ko'ring.",
				'error'
			)
		}
	}

	showNotification(message, type) {
		const notification = document.getElementById('notification')
		const messageEl = notification.querySelector('.notification-message')

		messageEl.textContent = message
		notification.classList.add('show')

		setTimeout(() => {
			notification.classList.remove('show')
		}, 5000)
	}
}

// Notification System
class NotificationSystem {
	constructor() {
		this.notification = document.getElementById('notification')
		this.closeBtn = this.notification.querySelector('.notification-close')
		this.init()
	}

	init() {
		this.closeBtn.addEventListener('click', () => {
			this.notification.classList.remove('show')
		})
	}
}

// Scroll to Top
class ScrollToTop {
	constructor() {
		this.button = document.getElementById('scrollTop')
		this.init()
	}

	init() {
		window.addEventListener('scroll', () => {
			if (window.pageYOffset > 300) {
				this.button.classList.add('visible')
			} else {
				this.button.classList.remove('visible')
			}
		})

		this.button.addEventListener('click', () => {
			window.scrollTo({
				top: 0,
				behavior: 'smooth',
			})
		})
	}
}

// 3D Card Tilt Effect
class CardTiltEffect {
	constructor() {
		this.cards = document.querySelectorAll('[data-tilt]')
		this.init()
	}

	init() {
		this.cards.forEach(card => {
			card.addEventListener('mousemove', e => {
				const rect = card.getBoundingClientRect()
				const x = e.clientX - rect.left
				const y = e.clientY - rect.top

				const centerX = rect.width / 2
				const centerY = rect.height / 2

				const rotateX = (y - centerY) / 10
				const rotateY = (centerX - x) / 10

				card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
			})

			card.addEventListener('mouseleave', () => {
				card.style.transform =
					'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
			})
		})
	}
}

// Initialize all classes
document.addEventListener('DOMContentLoaded', function () {
	// Initialize 3D background
	new Background3D()

	// Initialize mobile navigation
	new MobileNav()

	// Initialize smooth scrolling
	new SmoothScroll()

	// Initialize typing animation
	const typingElement = document.querySelector('.typing-text')
	if (typingElement) {
		new TypingAnimation(
			typingElement,
			[
				'Python Backend Developer',
				'Django & Flask Expert',
				'API & Database Specialist',
				'DevOps Enthusiast',
			],
			100
		)
	}

	// Initialize counter animations
	new CounterAnimation()

	// Initialize GSAP animations
	new GSAPAnimations()

	// Initialize skill progress
	new SkillProgress()

	// Initialize parallax effect
	new ParallaxEffect()

	// Initialize contact form
	new ContactForm()

	// Initialize notification system
	new NotificationSystem()

	// Initialize scroll to top
	new ScrollToTop()

	// Initialize card tilt effect
	new CardTiltEffect()
})

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)
