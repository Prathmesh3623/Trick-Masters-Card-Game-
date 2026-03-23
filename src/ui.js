function getCardImage(code) {

    if (code.startsWith("10")) {
        code = code.replace("10","0");
    }

    return "/cards/" + code + ".png";
}


export function addCard(card, playCallback) {

    const img = document.createElement("img");

    img.src = getCardImage(card.code);

    img.classList.add("card");

    img.onclick = () => playCallback(card);

    document
        .getElementById("hand")
        .appendChild(img);
}


export function showTableCard(card) {

    const img = document.createElement("img");

    img.src = getCardImage(card.code);

    img.classList.add("card");

    document
        .getElementById("table")
        .appendChild(img);
}
