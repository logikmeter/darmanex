// Main JavaScript file for darmanex Health Website

// Mock Data
const mockData = {
    doctors: [
        {
            id: 1,
            name: "دکتر سارا احمدی",
            specialty: "قلب و عروق",
            image: "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg",
            rating: 4.8,
            experience: "10 سال",
            location: "تهران"
        },
        {
            id: 2,
            name: "دکتر محمد رضایی",
            specialty: "ارتوپدی",
            image: "https://images.pexels.com/photos/612608/pexels-photo-612608.jpeg",
            rating: 4.9,
            experience: "15 سال",
            location: "تهران"
        },
        {
            id: 3,
            name: "دکتر فاطمه کریمی",
            specialty: "زنان و زایمان",
            image: "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg",
            rating: 4.7,
            experience: "8 سال",
            location: "اصفهان"
        },
        {
            id: 4,
            name: "دکتر علی محمدی",
            specialty: "داخلی",
            image: "https://images.pexels.com/photos/582750/pexels-photo-582750.jpeg",
            rating: 4.6,
            experience: "12 سال",
            location: "مشهد"
        }
    ],
    
    appointments: [
        {
            id: 1,
            doctorName: "دکتر سارا احمدی",
            specialty: "قلب و عروق",
            date: "1403/01/15",
            time: "10:30",
            status: "تایید شده"
        },
        {
            id: 2,
            doctorName: "دکتر محمد رضایی",
            specialty: "ارتوپدی",
            date: "1403/01/20",
            time: "14:00",
            status: "در انتظار"
        }
    ],
    
    prescriptions: [
        {
            id: 1,
            doctorName: "دکتر سارا احمدی",
            date: "1403/01/10",
            medicines: ["قرص آسپرین", "شربت سرفه"],
            status: "فعال"
        },
        {
            id: 2,
            doctorName: "دکتر علی محمدی",
            date: "1403/01/05",
            medicines: ["آنتی بیوتیک", "ویتامین D"],
            status: "تمام شده"
        }
    ]
};

// Utility Functions
const utils = {
    // Format Persian numbers
    toPersianNumber: (num) => {
        const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
        return num.toString().replace(/\d/g, (digit) => persianDigits[digit]);
    },
    
    // Show loading state
    showLoading: (element) => {
        element.innerHTML = '<div class="text-center"><div class="loading"></div></div>';
    },
    
    // Show toast notification
    showToast: (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
        toast.style.zIndex = '9999';
        toast.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
                ${message}
                <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
            </div>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    },
    
    // Animate counter
    animateCounter: (element, target) => {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = utils.toPersianNumber(Math.floor(current));
        }, 20);
    }
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initializeNavigation();
    loadDoctors();
    animateStats();
    initializeScrollEffects();
    
    // Initialize page-specific functionality
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(currentPage) {
        case 'patient-dashboard.html':
            initializePatientDashboard();
            break;
        case 'doctor-dashboard.html':
            initializeDoctorDashboard();
            break;
        case 'admin-dashboard.html':
            initializeAdminDashboard();
            break;
        case 'login.html':
            initializeLoginForm();
            break;
        case 'register.html':
            initializeRegisterForm();
            break;
    }
});

// Navigation Functions
function initializeNavigation() {
    // Mobile menu toggle
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
        });
    }
    
    // Active link highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(currentPage)) {
            link.classList.add('active');
        }
    });
}

// Load Doctors
function loadDoctors() {
    const doctorsContainer = document.getElementById('doctors-list');
    if (!doctorsContainer) return;
    
    utils.showLoading(doctorsContainer);
    
    setTimeout(() => {
        const doctorsHTML = mockData.doctors.map(doctor => `
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="doctor-card">
                    <div class="doctor-image">
                        <img src="${doctor.image}" alt="${doctor.name}" class="img-fluid">
                    </div>
                    <div class="doctor-info">
                        <h5 class="fw-bold mb-1">${doctor.name}</h5>
                        <p class="doctor-specialty mb-2">${doctor.specialty}</p>
                        <div class="doctor-rating mb-2">
                            ${generateStars(doctor.rating)}
                            <span class="ms-1">${utils.toPersianNumber(doctor.rating)}</span>
                        </div>
                        <p class="text-muted small mb-3">
                            <i class="fas fa-clock me-1"></i>
                            ${doctor.experience} تجربه
                        </p>
                        <button class="btn btn-primary btn-sm w-100" onclick="bookAppointment(${doctor.id})">
                            <i class="fas fa-calendar-plus me-1"></i>
                            رزرو نوبت
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        doctorsContainer.innerHTML = doctorsHTML;
    }, 1000);
}

// Generate star rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Animate Statistics
function animateStats() {
    const statElements = document.querySelectorAll('[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                utils.animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    statElements.forEach(element => {
        observer.observe(element);
    });
}

// Scroll Effects
function initializeScrollEffects() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('shadow-lg');
        } else {
            navbar.classList.remove('shadow-lg');
        }
    });
    
    // Fade in animation on scroll
    const fadeElements = document.querySelectorAll('.service-card, .doctor-card');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                fadeObserver.unobserve(entry.target);
            }
        });
    });
    
    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });
}

// Book Appointment
function bookAppointment(doctorId) {
    const doctor = mockData.doctors.find(d => d.id === doctorId);
    if (doctor) {
        utils.showToast(`درخواست نوبت با ${doctor.name} ثبت شد`, 'success');
        // Redirect to appointment booking page
        setTimeout(() => {
            window.location.href = 'pages/appointment.html';
        }, 1500);
    }
}

// Patient Dashboard Functions
function initializePatientDashboard() {
    loadPatientAppointments();
    loadPatientPrescriptions();
    loadHealthStats();
}

function loadPatientAppointments() {
    const appointmentsContainer = document.getElementById('appointments-list');
    if (!appointmentsContainer) return;
    
    const appointmentsHTML = mockData.appointments.map(appointment => `
        <div class="col-md-6 mb-3">
            <div class="card">
                <div class="card-body">
                    <h6 class="card-title">${appointment.doctorName}</h6>
                    <p class="card-text text-muted">${appointment.specialty}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">
                            <i class="fas fa-calendar me-1"></i>
                            ${appointment.date} - ${appointment.time}
                        </small>
                        <span class="badge ${appointment.status === 'تایید شده' ? 'bg-success' : 'bg-warning'}">
                            ${appointment.status}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    appointmentsContainer.innerHTML = appointmentsHTML;
}

function loadPatientPrescriptions() {
    const prescriptionsContainer = document.getElementById('prescriptions-list');
    if (!prescriptionsContainer) return;
    
    const prescriptionsHTML = mockData.prescriptions.map(prescription => `
        <div class="col-md-6 mb-3">
            <div class="card">
                <div class="card-body">
                    <h6 class="card-title">${prescription.doctorName}</h6>
                    <p class="card-text">
                        ${prescription.medicines.join('، ')}
                    </p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">
                            <i class="fas fa-calendar me-1"></i>
                            ${prescription.date}
                        </small>
                        <span class="badge ${prescription.status === 'فعال' ? 'bg-success' : 'bg-secondary'}">
                            ${prescription.status}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    prescriptionsContainer.innerHTML = prescriptionsHTML;
}

function loadHealthStats() {
    // Simulate health statistics
    const healthData = {
        weight: 75,
        bloodPressure: '120/80',
        heartRate: 72,
        temperature: 36.5
    };
    
    // Update health stats if elements exist
    const weightElement = document.getElementById('weight-stat');
    const bpElement = document.getElementById('bp-stat');
    const hrElement = document.getElementById('hr-stat');
    const tempElement = document.getElementById('temp-stat');
    
    if (weightElement) weightElement.textContent = utils.toPersianNumber(healthData.weight) + ' کیلوگرم';
    if (bpElement) bpElement.textContent = healthData.bloodPressure;
    if (hrElement) hrElement.textContent = utils.toPersianNumber(healthData.heartRate) + ' ضربه در دقیقه';
    if (tempElement) tempElement.textContent = utils.toPersianNumber(healthData.temperature) + ' درجه';
}

// Login Form
function initializeLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const userType = document.getElementById('userType').value;
        
        if (!email || !password) {
            utils.showToast('لطفا تمام فیلدها را پر کنید', 'warning');
            return;
        }
        
        // Simulate login
        const submitBtn = document.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="loading"></div> در حال ورود...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            utils.showToast('ورود موفقیت‌آمیز بود', 'success');
            
            // Redirect based on user type
            let redirectUrl = 'patient-dashboard.html';
            if (userType === 'doctor') redirectUrl = 'doctor-dashboard.html';
            if (userType === 'admin') redirectUrl = 'admin-dashboard.html';
            
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 1500);
        }, 2000);
    });
}

// Register Form
function initializeRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (data.password !== data.confirmPassword) {
            utils.showToast('رمز عبور و تکرار آن یکسان نیستند', 'warning');
            return;
        }
        
        if (data.password.length < 6) {
            utils.showToast('رمز عبور باید حداقل ۶ کاراکتر باشد', 'warning');
            return;
        }
        
        // Simulate registration
        const submitBtn = document.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="loading"></div> در حال ثبت نام...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            utils.showToast('ثبت نام موفقیت‌آمیز بود', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }, 2000);
    });
}

// Doctor Dashboard Functions
function initializeDoctorDashboard() {
    loadDoctorAppointments();
    loadDoctorSchedule();
    loadDoctorStats();
}

function loadDoctorAppointments() {
    // Implementation for doctor appointments
    console.log('Loading doctor appointments...');
}

function loadDoctorSchedule() {
    // Implementation for doctor schedule
    console.log('Loading doctor schedule...');
}

function loadDoctorStats() {
    // Implementation for doctor statistics
    console.log('Loading doctor stats...');
}

// Admin Dashboard Functions
function initializeAdminDashboard() {
    loadAdminStats();
    loadRecentUsers();
    loadSystemHealth();
}

function loadAdminStats() {
    // Implementation for admin statistics
    console.log('Loading admin stats...');
}

function loadRecentUsers() {
    // Implementation for recent users
    console.log('Loading recent users...');
}

function loadSystemHealth() {
    // Implementation for system health
    console.log('Loading system health...');
}

// Export functions for global access
window.darmanex = {
    utils,
    bookAppointment,
    mockData
};