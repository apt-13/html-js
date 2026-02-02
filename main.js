// Core element creator
function create(tag, content = '', attrs = {}) {
    const el = document.createElement(tag);

    if (typeof content === 'string') el.textContent = content;
    else if (Array.isArray(content)) content.forEach(c => el.appendChild(c instanceof Node ? c : create(...c)));
    else if (content instanceof Node) el.appendChild(content);

    for (const [k, v] of Object.entries(attrs)) attributeAppender(el, k, v);

    // Add modifier helper
    el.modifier = function(type, obj) {
        if (type === 'style') {
            Object.assign(el.style, obj);

        } else if (type === 'attribute') {
            Object.entries(obj).forEach(([k, v]) => attributeAppender(el, k, v));

        } else if (type === 'listeners') {
            Object.entries(obj).forEach(([evt, fn]) => el.addEventListener(evt, fn));

        } else if (type === 'animation') {
            // CSS Animation
            const {
                name,
                duration = 400,
                timing = 'ease',
                delay = 0,
                iteration = 1,
                fillMode = 'forwards',
                onEnd = null
            } = obj;

            el.style.animationName = name;
            el.style.animationDuration = duration + 'ms';
            el.style.animationTimingFunction = timing;
            el.style.animationDelay = delay + 'ms';
            el.style.animationIterationCount = iteration;
            el.style.animationFillMode = fillMode;

            if (onEnd) {
                const handleEnd = () => {
                    el.removeEventListener('animationend', handleEnd);
                    onEnd();
                };
                el.addEventListener('animationend', handleEnd);
            }

        } else if (type === 'transition') {
            // CSS Transition
            const {
                property,
                values = {},
                duration = 400,
                timing = 'ease',
                delay = 0,
                onEnd = null
            } = obj;

            el.style.transition = `${property} ${duration}ms ${timing} ${delay}ms`;
            // Trigger layout for restart
            void el.offsetWidth;
            Object.entries(values).forEach(([prop, value]) => el.style[prop] = value);

            if (onEnd) {
                const handler = (e) => {
                    if (e.target === el && e.propertyName === property) {
                        el.removeEventListener('transitionend', handler);
                        onEnd();
                    }
                };
                el.addEventListener('transitionend', handler);
            }

        } else {
            throw new Error("Modifier type must be 'style', 'attribute', 'listeners', 'animation', or 'transition'");
        }

        return el; // chainable
    };

    return el;
}

// Function to append HTML tags
function appendTag(child, parent) {
    const p = parent instanceof Node ? parent : document.querySelector(parent);
    if (!p) throw new Error('Parent not found');
    p.appendChild(child);
}

// Helper function to apply attributes safely
function attributeAppender(el, k, v) {
    if (typeof v === 'boolean') {
        if (v) el.setAttribute(k, '');
        else el.removeAttribute(k);
    } else {
        el.setAttribute(k, v);
    }
}

// Expose globally (CDN ready)
(function(global) {
    global.create = create;
    global.appendTag = appendTag;
})(window);

