import { getData } from "./app.js";

window.addEventListener("DOMContentLoaded", async () => {
    let data = await getData();
    const croissant = document.querySelector(".croissant");
    const decroissant = document.querySelector(".decroissant");

    const inputmail = document.querySelector(".inputMail");
    const mails = document.querySelector(".mails");
    const liste_mail = document.querySelector(".liste_mail");
    let sortMailByName = [...data];

    let domaine = {
        "gmail": 0,
        "yahoo": 0,
        "hotmail": 0,
        "other": 0,
    };

    function generateListeMail() {
        liste_mail.innerHTML = ""; // Réinitialiser avant de recréer la liste
        Object.keys(domaine).forEach(key => {
            let elt = document.createElement("p");
            let caseCocher = document.createElement("input");
            caseCocher.className = `${key}`;
            caseCocher.classList.add("checkbox");
            caseCocher.value = `${key}`;
            caseCocher.type = "checkbox";
            caseCocher.addEventListener("change", updateFilteredMails);

            elt.innerHTML = `${key}: ${domaine[key]}`;
            liste_mail.appendChild(elt);
            liste_mail.appendChild(caseCocher);
        });
    }

    function updateFilteredMails() {
        let checkedDomains = [];
        let checkedCase = document.querySelectorAll(".liste_mail input:checked");

        checkedCase.forEach(checkbox => {
            checkedDomains.push(checkbox.value);
        });

        if (checkedCase.length === 0) {
            sortMailByName = [...data];
        } else {
            sortMailByName = data.filter(email => {
                let mailDomain = getDomainFromEmail(email);
                return checkedDomains.includes(mailDomain);
            });
        }

        generateMails(sortMailByName);
        updateChart();
    }

    function getDomainFromEmail(email) {
        let parts = email.split("@");
        if (parts.length === 2) {
            let domain = parts[1].toLowerCase().trim();

            if (domain === "gmail.com") return "gmail";
            if (domain === "yahoo.com" || domain === "yahoo.fr") return "yahoo";
            if (domain === "hotmail.com" || domain === "hotmail.fr") return "hotmail";

            return "other";
        }
        return null;
    }

    function checkDomain(email) {
        let domain = getDomainFromEmail(email);
        if (domain in domaine) {
            domaine[domain]++;
        } else {
            domaine["other"]++;
        }
    }

    data.forEach(email => {
        checkDomain(email);
    });

    inputmail.addEventListener("input", (event) => {
        let lesMails = searchMail(event.target.value);
        supprimer();
        generateMails(lesMails);
    });

    croissant.addEventListener("click", () => {
        sortMailByName.sort();
        supprimer();
        generateMails(sortMailByName);
    });

    decroissant.addEventListener("click", () => {
        sortMailByName.sort().reverse();
        supprimer();
        generateMails(sortMailByName);
    });

    function generateMails(array) {
        mails.innerHTML = "";
        array.forEach(elt => {
            let li = document.createElement("li");
            li.innerHTML = elt;
            mails.appendChild(li);
        });
    }

    function supprimer() {
        mails.innerHTML = "";
    }

    function searchMail(mail) {
        return data.filter(elt => elt.toLowerCase().includes(mail.toLowerCase()));
    }

    generateMails(data);
    generateListeMail();

    // Initialisation du graphique
    const ctx = document.getElementById("myChart").getContext("2d");
    const myChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Gmail", "Yahoo", "Hotmail", "Other"],
            datasets: [{
                label: "Répartition des domaines",
                data: [domaine["gmail"], domaine["yahoo"], domaine["hotmail"], domaine["other"]],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.7)",
                    "rgba(54, 162, 235, 0.7)",
                    "rgba(255, 206, 86, 0.7)",
                    "rgba(75, 192, 192, 0.7)"
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)"
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "top"
                }
            }
        }
    });


    function updateChart() {
        let updatedData = {
            "gmail": 0,
            "yahoo": 0,
            "hotmail": 0,
            "other": 0,
        };

        sortMailByName.forEach(email => {
            let domain = getDomainFromEmail(email);
            if (domain in updatedData) {
                updatedData[domain]++;
            }
        });

        myChart.data.datasets[0].data = [
            updatedData["gmail"],
            updatedData["yahoo"],
            updatedData["hotmail"],
            updatedData["other"]
        ];

        myChart.update();
    }
});
