import { useEffect } from 'react';

const useSmoothWheelScroll = () => {
    useEffect(() => {
        let isScrolling = false;
        let scrollTarget = window.pageYOffset;
        let currentScroll = window.pageYOffset;
        
        // Более мягкие настройки для стабильности
        const scrollSpeed = 0.6; // Скорость прокрутки
        const smoothness = 0.09; // Плавность (чем меньше, тем плавнее)
        const threshold = 0.5; // Минимальная разница для остановки анимации

        const handleWheel = (e) => {
            e.preventDefault();
            
            // Вычисляем новую позицию
            const delta = e.deltaY * scrollSpeed;
            scrollTarget += delta;
            
            // Ограничиваем прокрутку границами страницы
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            scrollTarget = Math.max(0, Math.min(scrollTarget, maxScroll));
            
            // Запускаем плавную анимацию, если она не активна
            if (!isScrolling) {
                isScrolling = true;
                animateScroll();
            }
        };

        const animateScroll = () => {
            currentScroll += (scrollTarget - currentScroll) * smoothness;
            
            // Устанавливаем позицию прокрутки
            window.scrollTo(0, currentScroll);
            
            // Продолжаем анимацию, если есть заметная разница
            if (Math.abs(scrollTarget - currentScroll) > threshold) {
                requestAnimationFrame(animateScroll);
            } else {
                // Завершаем анимацию точно на целевой позиции
                window.scrollTo(0, scrollTarget);
                currentScroll = scrollTarget;
                isScrolling = false;
            }
        };

        // Синхронизируем с текущей позицией при монтировании
        scrollTarget = window.pageYOffset;
        currentScroll = window.pageYOffset;

        // Добавляем обработчик с passive: false для preventDefault
        document.addEventListener('wheel', handleWheel, { passive: false });

        // Синхронизируем при изменении размера окна
        const handleResize = () => {
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            scrollTarget = Math.min(scrollTarget, maxScroll);
            currentScroll = Math.min(currentScroll, maxScroll);
        };
        
        window.addEventListener('resize', handleResize);

        return () => {
            document.removeEventListener('wheel', handleWheel);
            window.removeEventListener('resize', handleResize);
        };
    }, []);
};

export default useSmoothWheelScroll;

