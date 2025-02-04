    import{getData} from "./app.js";


    window.addEventListener("DOMContentLoaded", async() => {
        const croissant = document.querySelector(".croissant");
        const decroissant = document.querySelector(".decroissant");
        const inputmail = document.querySelector(".inputMail");
        const mails = document.querySelector(".mails");
        const liste_mail = document.querySelector(".liste_mail");

        let domaine = {
            "gmail": 0,
            "yahoo": 0,
            "hotmail": 0,
            "other": 0,

        }


        function generateListeMail() {
            Object.keys(domaine).forEach(key => {
                let elt = document.createElement("p");
                elt.innerHTML = `${key}: ${domaine[key]}`;
                liste_mail.appendChild(elt);
            });
        }




        let data = await getData();



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




        function checDomain(email) {
            let domain = getDomainFromEmail(email);
            console.log("le domaine est " + domain);

            if (domain in domaine) {
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
        generateListeMail();














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

    });