(function () {
    if (!document.body || !document.body.classList.contains('page-template-internet-heritage')) {
        return;
    }

    var revealNodes = Array.prototype.slice.call(
        document.querySelectorAll('.slide-up-animation.hidden, .internet-columns .hidden')
    );

    if (!revealNodes.length) {
        return;
    }

    revealNodes.forEach(function (node, index) {
        node.classList.add('archive-reveal-ready');
        node.style.transitionDelay = Math.min(index % 4, 3) * 80 + 'ms';
    });

    function reveal(node) {
        node.classList.add('archive-visible');
        node.classList.remove('hidden');
    }

    if (!('IntersectionObserver' in window)) {
        revealNodes.forEach(reveal);
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) {
                return;
            }
            reveal(entry.target);
            observer.unobserve(entry.target);
        });
    }, {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.15
    });

    revealNodes.forEach(function (node) {
        observer.observe(node);
    });
})();
