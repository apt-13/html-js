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
