document.addEventListener("DOMContentLoaded", function () {
    const numStars = 100; // Adjust the number of stars
    const section = document.querySelector("section"); // Select the section
    const starsContainer = section.querySelector(".stars"); // Select existing stars container

    for (let i = 0; i < numStars; i++) {
        let star = document.createElement("div");
        star.classList.add("star");

        // Random positions within section
        let x = Math.random() * 100;
        let y = Math.random() * 100;
        let delay = Math.random() * 3;

        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.animationDelay = `-${delay}s`;

        starsContainer.appendChild(star);
    }
});
