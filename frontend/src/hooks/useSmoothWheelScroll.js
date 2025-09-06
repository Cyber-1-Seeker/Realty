import { useEffect } from 'react';

const useSmoothWheelScroll = () => {
    useEffect(() => {
        let isScrolling = false;
        let scrollTarget = 0;
        let currentScroll = 0;
        
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
            
            // Сохраняем текущую позицию в sessionStorage
            sessionStorage.setItem('scrollPosition', Math.round(currentScroll).toString());
            
            // Продолжаем анимацию, если есть заметная разница
            if (Math.abs(scrollTarget - currentScroll) > threshold) {
                requestAnimationFrame(animateScroll);
            } else {
                // Завершаем анимацию точно на целевой позиции
                window.scrollTo(0, scrollTarget);
                currentScroll = scrollTarget;
                isScrolling = false;
                // Сохраняем финальную позицию
                sessionStorage.setItem('scrollPosition', Math.round(scrollTarget).toString());
            }
        };

        // Определяем, была ли это перезагрузка или переход на новую страницу
        const isPageReload = performance.navigation.type === 1; // TYPE_RELOAD
        const savedScrollPosition = sessionStorage.getItem('scrollPosition');
        const isNavigationReload = sessionStorage.getItem('isNavigationReload') === 'true';
        const shouldResetScroll = sessionStorage.getItem('shouldResetScroll') === 'true';
        
        // Проверяем флаг сброса прокрутки сразу
        if (shouldResetScroll) {
            // Если нужно сбросить прокрутку, делаем это немедленно
            console.log('useSmoothWheelScroll: Сбрасываем прокрутку из-за флага shouldResetScroll');
            scrollTarget = 0;
            currentScroll = 0;
            window.scrollTo(0, 0);
            sessionStorage.removeItem('shouldResetScroll');
            return; // Выходим из функции, не устанавливая обработчики
        }
        
        // Добавляем небольшую задержку, чтобы дать компонентам время установить флаги
        setTimeout(() => {
            const finalShouldResetScroll = sessionStorage.getItem('shouldResetScroll') === 'true';
            
            if (finalShouldResetScroll) {
                // Если флаг установлен, сбрасываем прокрутку
                scrollTarget = 0;
                currentScroll = 0;
                window.scrollTo(0, 0);
                sessionStorage.removeItem('shouldResetScroll');
                return;
            }
            
            if ((isPageReload || isNavigationReload) && savedScrollPosition) {
                // При перезагрузке восстанавливаем позицию
                const position = parseInt(savedScrollPosition, 10);
                scrollTarget = position;
                currentScroll = position;
                window.scrollTo(0, position);
                // Очищаем флаг навигации
                sessionStorage.removeItem('isNavigationReload');
            } else {
                // При переходе на новую страницу сбрасываем позицию
                scrollTarget = 0;
                currentScroll = 0;
                window.scrollTo(0, 0);
            }
        }, 100); // Увеличиваем задержку для лучшей синхронизации
        
        // Обработчик для определения перезагрузки страницы
        const handleBeforeUnload = () => {
            sessionStorage.setItem('isNavigationReload', 'true');
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);

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
            window.removeEventListener('beforeunload', handleBeforeUnload);
            // Очищаем сохраненную позицию при размонтировании (переходе на другую страницу)
            sessionStorage.removeItem('scrollPosition');
            sessionStorage.removeItem('isNavigationReload');
        };
    }, []);
};

export default useSmoothWheelScroll;

