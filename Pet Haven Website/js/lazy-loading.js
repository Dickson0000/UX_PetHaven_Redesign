/* Pet Haven Lazy Loading System */
/* Optimizes image loading performance for better user experience */

document.addEventListener('DOMContentLoaded', function() {
    initializeLazyLoading();
});

function initializeLazyLoading() {
    console.log('🚀 Pet Haven lazy loading system initialized');
    
    // Check if browser supports native lazy loading
    if ('loading' in HTMLImageElement.prototype) {
        console.log('✅ Native lazy loading supported');
        setupNativeLazyLoading();
    } else {
        console.log('⚠️ Native lazy loading not supported, using Intersection Observer fallback');
        setupIntersectionObserverLazyLoading();
    }
    
    // Add loading placeholders
    addLoadingPlaceholders();
    
    // Monitor loading performance
    monitorImageLoadingPerformance();
}

function setupNativeLazyLoading() {
    // Native lazy loading is already handled by the loading="lazy" attribute
    // Just add error handling and loading feedback
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    lazyImages.forEach(img => {
        // Add loading state
        img.classList.add('lazy-loading');
        
        // Handle successful load
        img.addEventListener('load', function() {
            this.classList.remove('lazy-loading');
            this.classList.add('lazy-loaded');
            console.log(`✅ Image loaded: ${this.alt || this.src}`);
        });
        
        // Handle loading errors
        img.addEventListener('error', function() {
            this.classList.remove('lazy-loading');
            this.classList.add('lazy-error');
            handleImageError(this);
        });
    });
}

function setupIntersectionObserverLazyLoading() {
    // Fallback for browsers that don't support native lazy loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if (!lazyImages.length) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Replace data-src with src if using data attributes
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                
                img.classList.remove('lazy-loading');
                img.classList.add('lazy-loaded');
                
                observer.unobserve(img);
                console.log(`✅ Image loaded (fallback): ${img.alt || img.src}`);
            }
        });
    }, {
        // Load images when they're 100px away from viewport
        rootMargin: '100px 0px',
        threshold: 0.01
    });
    
    lazyImages.forEach(img => {
        img.classList.add('lazy-loading');
        imageObserver.observe(img);
    });
}

function addLoadingPlaceholders() {
    // Add CSS for loading states
    const style = document.createElement('style');
    style.textContent = `
        .lazy-loading {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading-shimmer 1.5s infinite;
            min-height: 60px;
            border-radius: 8px;
        }
        
        @keyframes loading-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        
        .lazy-loaded {
            animation: fade-in 0.3s ease-in-out;
        }
        
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .lazy-error {
            background: #f3f4f6;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #9ca3af;
            font-size: 24px;
            min-height: 60px;
        }
        
        .lazy-error::before {
            content: "🐾";
        }
    `;
    document.head.appendChild(style);
}

function handleImageError(img) {
    console.warn(`❌ Failed to load image: ${img.src}`);
    
    // Create fallback placeholder
    const fallbackSrc = createFallbackImage(img.alt || 'Pet Photo');
    img.src = fallbackSrc;
    
    // Add retry mechanism
    setTimeout(() => {
        if (img.classList.contains('lazy-error')) {
            console.log(`🔄 Retrying image load: ${img.dataset.originalSrc || img.src}`);
            img.src = img.dataset.originalSrc || img.src;
        }
    }, 3000);
}

function createFallbackImage(altText) {
    // Create a simple SVG placeholder
    const svg = `
        <svg width="300" height="200" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="200" fill="#F3F4F6"/>
            <text x="150" y="80" font-family="Arial, sans-serif" font-size="48" fill="#9CA3AF" text-anchor="middle">🐾</text>
            <text x="150" y="130" font-family="Arial, sans-serif" font-size="14" fill="#6B7280" text-anchor="middle">${altText}</text>
        </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}

function monitorImageLoadingPerformance() {
    // Track loading performance
    const startTime = performance.now();
    let loadedImages = 0;
    const totalImages = document.querySelectorAll('img[loading="lazy"]').length;
    
    document.addEventListener('load', function() {
        loadedImages++;
        
        if (loadedImages === totalImages) {
            const loadTime = performance.now() - startTime;
            console.log(`📊 All ${totalImages} lazy images loaded in ${loadTime.toFixed(2)}ms`);
            
            // Report performance metrics
            if (window.gtag) {
                gtag('event', 'lazy_loading_complete', {
                    'custom_parameter': {
                        'total_images': totalImages,
                        'load_time_ms': Math.round(loadTime)
                    }
                });
            }
        }
    }, true);
}

// Export functions for use in other scripts
window.PetHavenLazyLoading = {
    initialize: initializeLazyLoading,
    handleImageError: handleImageError,
    createFallbackImage: createFallbackImage
};

// Performance optimization: Preload critical images
function preloadCriticalImages() {
    // Preload the first few images that are above the fold
    const criticalImages = [
        'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=200&fit=crop', // Fluffy
        'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=200&fit=crop'   // Buddy
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
    
    console.log(`🚀 Preloaded ${criticalImages.length} critical images`);
}

// Initialize preloading for above-the-fold content
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadCriticalImages);
} else {
    preloadCriticalImages();
}
