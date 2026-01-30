function tonefind(word){
    const tonesep = word.normalize("NFD");
    if (tonesep.match(/\u0301/)) return "rising";
    if (tonesep.match(/\u0308/)) return "glottal";
    if (tonesep.match(/\u0302/)) return "turn";
    if (tonesep.match(/\u0303|̄/)) return "creaky";
    if (tonesep.match(/\u0300/)) return "flat";
    return "falling"
}
function sentencecolour(){
    const sents = document.querySelectorAll("span.lyk");
    sents.forEach(span => {
        const parts = span.textContent.split(/([ .!?:,;"]+)/);
        const wrapped = parts.map(part => {
            if (part.match(/[ .!?:,;"]+/)) return part;
            const tone = tonefind(part);
            return `<span class="${tonefind(part)}">${part}</span>`;
            
        });
        span.innerHTML = wrapped.join("");
        });
}
document.addEventListener("DOMContentLoaded", sentencecolour);
