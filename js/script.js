// ============================================
// 仲介ハチ公 LP JavaScript
// インタラクション機能
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // ヘッダー スクロール効果
    // ============================================
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // スクロール時にヘッダーのスタイルを変更
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // ============================================
    // スムーススクロール
    // ============================================
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // "#"のみの場合はトップへ
            if (href === '#') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            // 該当要素がある場合はスムーススクロール
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // FAQ アコーディオン
    // ============================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // 他のアイテムを閉じる
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // クリックされたアイテムをトグル
            item.classList.toggle('active');
        });
    });

    // ============================================
    // トップへ戻るボタン
    // ============================================
    const backToTopButton = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ============================================
    // スクロールアニメーション（要素が表示されたら）
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // アニメーション対象の要素を設定
    const animateElements = document.querySelectorAll(
        '.flow-step, .reason-card, .testimonial-card, .detail-step, .faq-item'
    );
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // ============================================
    // 数字カウントアップアニメーション（料金比較）
    // ============================================
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value.toLocaleString() + '円';
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // 料金比較セクションが表示されたらカウントアップ開始
    const comparisonSection = document.querySelector('.comparison-section');
    let hasAnimated = false;
    
    const comparisonObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                
                // 金額のアニメーション（例）
                const totalValues = document.querySelectorAll('.total-value');
                totalValues.forEach(value => {
                    const text = value.textContent;
                    const numbers = text.match(/\d+/g);
                    if (numbers) {
                        const amount = parseInt(numbers.join(''));
                        value.textContent = '0円';
                        setTimeout(() => {
                            animateValue(value, 0, amount, 1500);
                        }, 200);
                    }
                });
            }
        });
    }, { threshold: 0.3 });
    
    if (comparisonSection) {
        comparisonObserver.observe(comparisonSection);
    }

    // ============================================
    // ヒーローセクションのパララックス効果
    // ============================================
    const heroBg = document.querySelector('.hero-bg');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        if (heroBg && scrolled < window.innerHeight) {
            heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // ============================================
    // ホバー効果の強化（カードなど）
    // ============================================
    const cards = document.querySelectorAll('.reason-card, .testimonial-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    // ============================================
    // モバイルメニュー対応（将来的な拡張用）
    // ============================================
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    
    if (isMobile) {
        // モバイル専用の処理
        console.log('モバイルビューが検出されました');
    }

    // ============================================
    // 申し込み前チェックリスト
    // ============================================
    const requirementChecks = document.querySelectorAll('.requirement-check');
    const lineCtaBtn = document.getElementById('lineCtaBtn');

    if (requirementChecks.length > 0 && lineCtaBtn) {
        function updateLineButton() {
            const allChecked = [...requirementChecks].every(cb => cb.checked);
            lineCtaBtn.classList.toggle('cta-disabled', !allChecked);
        }

        requirementChecks.forEach(cb => cb.addEventListener('change', updateLineButton));
        updateLineButton();
    }

    // ============================================
    // CTAボタンのクリックトラッキング（分析用）
    // ============================================
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const buttonText = this.textContent.trim();
            console.log('CTA クリック:', buttonText);
            
            // ここに分析ツールのコード（Google Analytics等）を追加可能
            // 例: gtag('event', 'cta_click', { button_text: buttonText });
        });
    });

    // ============================================
    // スクロール進捗インジケーター（オプション）
    // ============================================
    function updateScrollProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.pageYOffset;
        const progress = (scrolled / documentHeight) * 100;
        
        // 進捗バーがある場合は更新（将来の拡張用）
        const progressBar = document.querySelector('.scroll-progress-bar');
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    }
    
    window.addEventListener('scroll', updateScrollProgress);

    // ============================================
    // 画像の遅延読み込み（パフォーマンス向上）
    // ============================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ============================================
    // フォームバリデーション（将来の拡張用）
    // ============================================
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // ここにバリデーションロジックを追加
            console.log('フォーム送信:', form);
        });
    });

    // ============================================
    // ページロード時のアニメーション
    // ============================================
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // ヒーローセクションのフェードイン
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 100);
        }
    });

    // ============================================
    // リサイズ時の処理
    // ============================================
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // リサイズ完了後の処理
            console.log('ウィンドウサイズ変更:', window.innerWidth);
        }, 250);
    });

    // ============================================
    // エラーハンドリング
    // ============================================
    window.addEventListener('error', function(e) {
        console.error('エラーが発生しました:', e.error);
    });

    // ============================================
    // デバッグモード（開発時のみ）
    // ============================================
    const DEBUG = false; // 本番環境ではfalseに設定
    
    if (DEBUG) {
        console.log('デバッグモード: 有効');
        console.log('FAQ アイテム数:', faqItems.length);
        console.log('CTA ボタン数:', ctaButtons.length);
        console.log('アニメーション対象:', animateElements.length);
    }

    // ============================================
    // 初期化完了メッセージ
    // ============================================
    console.log('🐕 仲介ハチ公 LP: 初期化完了');
});

// ============================================
// ユーティリティ関数
// ============================================

/**
 * 要素が画面内に表示されているかチェック
 */
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * スクロール位置を取得
 */
function getScrollPosition() {
    return window.pageYOffset || document.documentElement.scrollTop;
}

/**
 * デバウンス関数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * スロットル関数
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
