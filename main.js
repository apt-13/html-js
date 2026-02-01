// Core element creator
function create(tag, content = '', attrs = {}) {
    const el = document.createElement(tag);

    if (typeof content === 'string') el.textContent = content;
    else if (Array.isArray(content)) content.forEach(c => el.appendChild(c instanceof Node ? c : create(...c)));
    else if (content instanceof Node) el.appendChild(content);

    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);

    // Add modifier helper
    el.modifier = function(type, obj) {
        if (type === 'style') Object.assign(el.style, obj);
        else if (type === 'attribute') Object.entries(obj).forEach(([k, v]) => el.setAttribute(k, v));
        else if (type === 'listeners') Object.entries(obj).forEach(([evt, fn]) => el.addEventListener(evt, fn));
        return el; // chainable
    };

    return el;
}
