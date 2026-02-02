// Core element creator
function create(tag, content = '', attrs = {}) {
    const el = document.createElement(tag);

    if (typeof content === 'string') el.textContent = content;
    else if (Array.isArray(content)) content.forEach(c => el.appendChild(c instanceof Node ? c : create(...c)));
    else if (content instanceof Node) el.appendChild(content);

    for (const [k, v] of Object.entries(attrs)) attributeAppender(el, k, v);

    // Add modifier helper
    el.modifier = function(type, obj) {
        if (type === 'style') Object.assign(el.style, obj);
        else if (type === 'attribute') Object.entries(obj).forEach(([k, v]) => attributeAppender(el, k, v));
        else if (type === 'listeners') Object.entries(obj).forEach(([evt, fn]) => el.addEventListener(evt, fn));
        return el; // chainable
    };

    return el;
}

// Function to append HTML tags
function appendTag(child, parent) {
    const p = parent instanceof Node
        ? parent
        : document.querySelector(parent);

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

// Transition + Animation = transmation
function transmation(el, type, name, options = {}) {
    if (!(el instanceof Node)) throw new Error("Invalid element");

    // Defaults
    const {
        duration = 400,      // ms
        timing = "ease",
        delay = 0,
        iteration = 1,
        fillMode = "forwards",
        onEnd = null         // callback after animation ends
    } = options;

    if (type === "transition") {
        // Apply CSS transition
        el.style.transition = `${name} ${duration}ms ${timing} ${delay}ms`;
        // Trigger layout to restart transition
        void el.offsetWidth; 
        if (options.values) {
            for (const [prop, value] of Object.entries(options.values)) {
                el.style[prop] = value;
            }
        }

        if (onEnd) {
            const handler = (e) => {
                if (e.target === el && e.propertyName === name) {
                    el.removeEventListener("transitionend", handler);
                    onEnd();
                }
            };
            el.addEventListener("transitionend", handler);
        }

    } else if (type === "animation") {
        // Apply CSS animation
        el.style.animationName = name;
        el.style.animationDuration = duration + "ms";
        el.style.animationTimingFunction = timing;
        el.style.animationDelay = delay + "ms";
        el.style.animationIterationCount = iteration;
        el.style.animationFillMode = fillMode;

        const handleEnd = () => {
            el.removeEventListener("animationend", handleEnd);
            if (onEnd) onEnd();
        };
        el.addEventListener("animationend", handleEnd);
    } else {
        throw new Error("Type must be 'transition' or 'animation'");
    }

    return el; // chainable
}
