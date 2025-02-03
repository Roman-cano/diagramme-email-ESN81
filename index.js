    import{getData} from "./app.js";


    window.addEventListener("DOMContentLoaded", async() => {
        const croissant = document.querySelector(".croissant");
        const decroissant = document.querySelector(".decroissant");
        const inputmail = document.querySelector(".inputMail");
        const mails = document.querySelector(".mails");

        let domaine = {
            "gmail": 0,
            "yahoo": 0,
            "hotmail": 0,
            "other": 0,

        }


        let data = await getData();

        function getDomainFromEmail(email) {
            let parts = email.split("@");
            if (parts.length === 2) {
                let domain = parts[1].toLowerCase().trim(); // Normalisation pour éviter les erreurs d'espaces

                // Vérifie si le domaine correspond exactement
                if (domain === "gmail.com") return "gmail";
                if (domain === "yahoo.com" || domain === "yahoo.fr") return "yahoo"; // Gestion des variantes Yahoo
                if (domain === "hotmail.com" || domain === "hotmail.fr") return "hotmail"; // Gestion Hotmail

                return "other"; // Si ce n'est pas un domaine connu
            }
            return null;
        }



// Fonction pour vérifier et mettre à jour les compteurs de domaines
        function checDomain(email) {
            let domain = getDomainFromEmail(email);
            console.log("le domaine est " + domain);

            if (domain in domaine) {  // Vérifie si la clé existe
                domaine[domain]++;
            } else {
                domaine["other"]++;
            }
        }


        data.forEach(email => {
            let domain = getDomainFromEmail(email);
            console.log(`Email : ${email}, Domaine détecté : ${domain}`);
            checDomain(email);
        });
        console.log("Domaine final après correction:", domaine);




        croissant.addEventListener("click", () => {
            data.sort();
            supprimer();
            generateMails(data);
        });

        inputmail.addEventListener("input", (event) => {
            let lesMails = searchMail(event.target.value);
            supprimer();
            generateMails(lesMails);
        })

        decroissant.addEventListener("click", () => {
            data.sort();
            data.reverse();
            supprimer();
            generateMails(data);
        })

        function generateMails(array) {

            array.forEach(elt => {
                let li = document.createElement("li");
                li.innerHTML = elt;
                mails.appendChild(li);
            })

        }

        function supprimer() {
            mails.innerHTML = "";
        }

        function searchMail(mail) {
            return data.filter(elt => elt.toLowerCase().includes(mail.toLowerCase()));
        }

        generateMails(data);














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
                responsive: false,  // Désactive la mise à l'échelle automatique
                maintainAspectRatio: false, // Permet de changer la taille librement
                plugins: {
                    legend: {
                        position: "top"
                    }
                }
            }
        });

    });