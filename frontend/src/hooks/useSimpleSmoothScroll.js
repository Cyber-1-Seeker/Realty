// Хук для заметной плавной прокрутки (только для программных вызовов)
const useSimpleSmoothScroll = () => {
    
    // Функция с кастомной анимацией для более заметной плавности
    const animatedScrollTo = (targetPosition, options = {}) => {
        const {
            duration = 1000,
            easing = 'easeInOutCubic'
        } = options;

        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        // Кривые плавности
        const easingFunctions = {
            easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
            easeOutQuart: t => 1 - (--t) * t * t * t,
            easeInOutBack: t => t < 0.5 
                ? (2 * t) * (2 * t) * ((1.7 + 1) * 2 * t - 1.7) / 2
                : ((2 * t - 2) * (2 * t - 2) * ((1.7 + 1) * (2 * t - 2) + 1.7) + 2) / 2
        };

        function animate(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const ease = easingFunctions[easing] || easingFunctions.easeInOutCubic;
            const currentPosition = startPosition + distance * ease(progress);
            
            window.scrollTo(0, currentPosition);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    };
    
    // Функция для прокрутки к элементу или позиции
    const scrollTo = (target, options = {}) => {
        const { offset = 0 } = options;
        let targetPosition = 0;

        if (typeof target === 'string') {
            const element = document.querySelector(target);
            if (element) {
                targetPosition = element.offsetTop + offset;
            }
        } else if (typeof target === 'number') {
            targetPosition = target + offset;
        } else if (target instanceof Element) {
            targetPosition = target.offsetTop + offset;
        }

        animatedScrollTo(targetPosition, options);
    };

    // Функция для прокрутки к верху страницы (быстрая и заметная)
    const scrollToTop = (options = {}) => {
        animatedScrollTo(0, { 
            duration: 800, 
            easing: 'easeOutQuart', 
            ...options 
        });
    };

    // Функция для прокрутки к низу страницы
    const scrollToBottom = (options = {}) => {
        animatedScrollTo(document.body.scrollHeight, { 
            duration: 1200, 
            easing: 'easeInOutCubic', 
            ...options 
        });
    };

    return {
        scrollTo,
        scrollToTop,
        scrollToBottom
    };
};

export default useSimpleSmoothScroll;
