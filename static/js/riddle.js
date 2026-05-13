document.addEventListener('DOMContentLoaded', () => {
    const KOD = "613";
    
    const trigger = document.getElementById('riddle-trigger');
    const modal = document.getElementById('riddle-modal');
    const content = document.getElementById('modal-content');
    const input = document.getElementById('riddle-input');
    const submitBtn = document.getElementById('submit-riddle');
    const closeBtn = document.getElementById('close-riddle');
    const errorMsg = document.getElementById('riddle-error');
    const audio = document.getElementById('easter-egg-music');

    const btsImg = document.getElementById('bts-easter-egg');
    const githubBtn = document.getElementById('github-link');
    const versionInfo = document.getElementById('version-info');

    input?.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
        if (e.target.value.length > 3) e.target.value = e.target.value.slice(0, 3);
    });

    const closeModal = () => {
        modal.classList.remove('opacity-100');
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
            errorMsg.classList.add('hidden');
            input.value = "";
        }, 300);
    };

    const checkCode = () => {
        if (input.value === KOD) {
            if (audio) {
                audio.src = "/static/music/hidden.mp3";
                audio.play().catch(e => console.log("Błąd odtwarzania:", e));
                
                const eggBtn = document.getElementById('egg-btn');
                eggBtn?.classList.add('animate-bounce');
                if (eggBtn) {
                    eggBtn.style.background = "linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)";
                }
                if (btsImg) {
                    btsImg.classList.remove('opacity-0', 'translate-y-10');
                    btsImg.classList.add('opacity-100', 'translate-y-0');
                }
                
                githubBtn?.classList.add('blur-md', 'pointer-events-none', 'opacity-50');
                versionInfo?.classList.add('blur-sm', 'opacity-50');
            }
            closeModal();
        } else {
            errorMsg.classList.remove('hidden');
            input.value = "";
            input.classList.add('border-red-500', 'animate-shake');
            setTimeout(() => {
                input.classList.remove('animate-shake', 'border-red-500');
            }, 500);
        }
    };

    trigger?.addEventListener('mouseenter', () => {
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.add('opacity-100');
            content.classList.remove('scale-95');
            content.classList.add('scale-100');
            input.focus();
        }, 10);
    });

    submitBtn?.addEventListener('click', checkCode);
    closeBtn?.addEventListener('click', closeModal);
    input?.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkCode(); });
    modal?.addEventListener('click', (e) => {
        if (e.target.classList.contains('bg-slate-900/40')) closeModal();
    });
});